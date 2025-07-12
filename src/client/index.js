import * as THREE from 'three';
import { io } from 'socket.io-client';

class KrunkerClone {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.socket = null;
        this.player = null;
        this.players = new Map();
        this.projectiles = new Map();
        this.keys = {};
        this.mouse = { x: 0, y: 0, deltaX: 0, deltaY: 0 };
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isGyroEnabled = false;
        
        // Detect if user is on laptop (for trackpad optimization)
        this.isLaptop = /Windows|Mac|Linux/.test(navigator.platform) && !this.isMobile;
        this.gyroData = { alpha: 0, beta: 0, gamma: 0 };
        this.settings = {
            sensitivity: 3.0, // Increased from 2.0 to 3.0 for very responsive movement
            sensitivityX: 2.5, // Increased from 1.5 to 2.5 for very fast horizontal movement
            sensitivityY: 2.0, // Increased from 1.2 to 2.0 for very fast vertical movement
            mobileSensitivity: 1.0,
            mobileSensitivityX: 1.0,
            mobileSensitivityY: 1.0,
            gyroSensitivity: 1.0,
            invertX: false,
            invertY: false,
            fov: 75,
            gyroEnabled: false,
            vibrationEnabled: false,
            hudLayout: 'default'
        };
        this.gameState = {
            health: 100,
            ammo: 30,
            maxAmmo: 30,
            score: 0,
            kills: 0,
            deaths: 0
        };
        
        // Reload system
        this.reloadState = {
            isReloading: false,
            reloadTime: 2000, // 2 seconds
            reloadStartTime: 0
        };
        
        // Autofire system
        this.autofire = {
            isEnabled: false, // Toggle between single-shot and continuous autofire
            fireRate: 109, // 550 RPM = 60,000ms / 550 = ~109ms between shots
            lastFireTime: 0,
            isShooting: false
        };
        
        // Scope system
        this.scope = {
            isAiming: false,
            zoomLevel: 2.0,
            originalFOV: 75
        };
        
        // Damage display system
        this.damageDisplays = [];
        
        // Target boards
        this.targetBoards = new Map();
        
        // FPS and latency tracking
        this.fps = {
            frames: 0,
            lastTime: 0,
            current: 0
        };
        this.latency = 0;
        this.lastPingTime = 0;
        this.controls = {
            leftStick: { x: 0, y: 0 },
            rightStick: { x: 0, y: 0 },
            shooting: false
        };
        
        // Physics system
        this.physics = {
            velocityY: 0,
            gravity: 0.4,
            jumpForce: 6.4
        };
        
        // Game state management
        this.gameMode = 'menu'; // 'menu', 'loading', 'playing'
        this.teamData = {
            teamId: null,
            teamCode: null,
            members: [],
            isLeader: false,
            leaderId: null
        };
        
        // Player position
        this.playerPosition = new THREE.Vector3(0, 1.8, 0);
        
        this.init();
    }

    async init() {
        try {
            console.log('Initializing Krunker Clone...');
            
            // Initially hide game container to prevent black screen
            const gameContainer = document.getElementById('gameContainer');
            if (gameContainer) {
                gameContainer.style.display = 'none';
            }
            
        await this.loadSettings();
            console.log('Settings loaded');
            
        this.setupThreeJS();
            console.log('ThreeJS setup complete');
            
        this.setupControls();
            console.log('Controls setup complete');
            
        this.setupHUD();
            console.log('HUD setup complete');
            
        this.setupMobileControls();
            console.log('Mobile controls setup complete');
            
        this.setupGyroscope();
            console.log('Gyroscope setup complete');
            
        this.createWorld();
            console.log('World creation complete');
            
            this.createGun();
            console.log('Gun creation complete');
            
            this.setupMainMenu();
            console.log('Main menu setup complete');
            
        this.animate();
            console.log('Animation loop started');
            
            // Show main menu first, connect to socket when starting game
            console.log('Showing main menu...');
            this.showMainMenu();
            console.log('Initialization complete');
        } catch (error) {
            console.error('Error during initialization:', error);
            alert('Failed to initialize game. Please refresh the page.');
        }
    }

    setupThreeJS() {
        try {
            console.log('Setting up ThreeJS...');
            
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
            console.log('Scene created with sky blue background');

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            this.settings.fov,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
            this.camera.position.set(0, 5, 10); // Start with a good viewing position
            this.camera.lookAt(0, 0, 0);
            console.log('Camera created and positioned');

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('gameCanvas'),
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            console.log('Renderer created and configured');

            // Lighting - enhanced for better visibility
            const ambientLight = new THREE.AmbientLight(0x404040, 0.8); // Increased intensity
        this.scene.add(ambientLight);
            console.log('Ambient light added');

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Increased intensity
            directionalLight.position.set(50, 100, 50); // Higher position for better coverage
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
            console.log('Directional light added');

            // Add some additional lighting for better visibility
            const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x404040, 0.6);
            this.scene.add(hemisphereLight);
            console.log('Hemisphere light added');

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
            
            console.log('ThreeJS setup complete');
        } catch (error) {
            console.error('Error in setupThreeJS:', error);
        }
    }

    setupSocket() {
        if (this.socket && this.socket.connected) {
            return; // Already connected
        }
        
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.startLatencyMeasurement();
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            alert('Failed to connect to server. Please check your internet connection and try again.');
            this.showMainMenu();
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Disconnected from server:', reason);
            if (this.gameMode === 'playing') {
                alert('Connection lost. Returning to main menu.');
                this.showMainMenu();
            }
        });

        this.socket.on('gameState', (data) => {
            this.handleGameState(data);
        });

        this.socket.on('playerJoined', (player) => {
            this.addPlayer(player);
        });

        this.socket.on('playerMoved', (data) => {
            this.updatePlayerPosition(data);
        });

        this.socket.on('playerLeft', (playerId) => {
            this.removePlayer(playerId);
        });

        this.socket.on('projectileCreated', (projectile) => {
            this.addProjectile(projectile);
        });

        this.socket.on('projectileDestroyed', (projectileId) => {
            this.removeProjectile(projectileId);
        });

        this.socket.on('playerHit', (data) => {
            this.handlePlayerHit(data);
        });

        this.socket.on('pong', () => {
            this.latency = Date.now() - this.lastPingTime;
        });

        // Team-related events
        this.socket.on('teamCreated', (data) => {
            console.log('Team created:', data.teamCode);
            this.teamData.leaderId = this.socket.id;
        });

        this.socket.on('teamJoined', (data) => {
            this.teamData.teamId = data.teamCode;
            this.teamData.teamCode = data.teamCode;
            this.teamData.isLeader = data.isLeader || false;
            this.teamData.leaderId = data.leaderId;
            this.teamData.members = data.members;
            
            document.getElementById('teamCode').textContent = data.teamCode;
            document.getElementById('teamSection').style.display = 'block';
            
            // Show/hide start deathmatch button based on leadership
            const startDeathmatchBtn = document.getElementById('startTeamDeathmatch');
            if (startDeathmatchBtn) {
                startDeathmatchBtn.style.display = this.teamData.isLeader ? 'block' : 'none';
            }
            
            this.updateTeamMembersList();
        });

        this.socket.on('teamMemberJoined', (data) => {
            this.teamData.members.push(data.member);
            this.updateTeamMembersList();
        });

        this.socket.on('teamMemberLeft', (data) => {
            this.teamData.members = this.teamData.members.filter(m => m.id !== data.memberId);
            this.updateTeamMembersList();
        });

        this.socket.on('teamDeathmatchStarted', (data) => {
            console.log('Team deathmatch started event received');
            
            // Show loading screen for all team members
            this.gameMode = 'loading';
            this.hideMainMenu();
            document.getElementById('loadingScreen').style.display = 'flex';
            document.getElementById('gameContainer').style.display = 'block';
            
            // Update loading message
            const loadingText = document.querySelector('#loadingScreen p');
            if (loadingText) {
                loadingText.textContent = 'Loading team deathmatch...';
            }
            
            // Join the game with team assignment after a short delay
            setTimeout(() => {
                console.log('Joining team deathmatch game...');
                this.socket.emit('playerJoin', { 
                    name: 'Player',
                    gameMode: 'teamDeathmatch',
                    teamCode: this.teamData.teamCode,
                    isLeader: this.teamData.isLeader
                });
            }, 1000);
        });

        this.socket.on('teamError', (data) => {
            alert(`Team Error: ${data.message}`);
        });
    }

    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Escape') this.toggleSettings();
            if (e.code === 'KeyR') this.startReload();
            if (e.code === 'KeyV') this.autofire.isEnabled = !this.autofire.isEnabled;
        });
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        // Mouse controls (PC only, no smoothing, direct mapping)
        document.addEventListener('mousemove', (e) => {
            if (!this.isMobile && document.pointerLockElement === this.renderer.domElement) {
                this.mouse.deltaX = e.movementX * this.settings.sensitivityX * 0.001;
                this.mouse.deltaY = e.movementY * this.settings.sensitivityY * 0.001;
            }
        });
        document.addEventListener('click', () => {
            if (!this.isMobile) this.renderer.domElement.requestPointerLock();
        });
        document.addEventListener('mousedown', (e) => {
            if (e.button === 0) { this.autofire.isShooting = true; this.shoot(); }
            else if (e.button === 2) { this.scope.isAiming = true; this.camera.fov = this.scope.originalFOV / this.scope.zoomLevel; this.camera.updateProjectionMatrix(); const scopeOverlay = document.getElementById('scopeOverlay'); if (scopeOverlay) scopeOverlay.style.display = 'block'; }
        });
        document.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.autofire.isShooting = false;
            else if (e.button === 2) { this.scope.isAiming = false; this.camera.fov = this.scope.originalFOV; this.camera.updateProjectionMatrix(); const scopeOverlay = document.getElementById('scopeOverlay'); if (scopeOverlay) scopeOverlay.style.display = 'none'; }
        });
        document.addEventListener('contextmenu', (e) => { e.preventDefault(); });
    }

    setupHUD() {
        // Make HUD elements draggable
        const draggableElements = document.querySelectorAll('.hud-draggable');
        draggableElements.forEach(element => {
            this.makeDraggable(element);
        });

        // Settings panel controls
        document.getElementById('sensitivity').addEventListener('input', (e) => {
            this.settings.sensitivity = parseFloat(e.target.value);
            document.getElementById('sensitivityValue').textContent = e.target.value;
        });

        document.getElementById('sensitivityX').addEventListener('input', (e) => {
            this.settings.sensitivityX = parseFloat(e.target.value);
            document.getElementById('sensitivityXValue').textContent = e.target.value;
        });

        document.getElementById('sensitivityY').addEventListener('input', (e) => {
            this.settings.sensitivityY = parseFloat(e.target.value);
            document.getElementById('sensitivityYValue').textContent = e.target.value;
        });

        document.getElementById('mobileSensitivity').addEventListener('input', (e) => {
            this.settings.mobileSensitivity = parseFloat(e.target.value);
            document.getElementById('mobileSensitivityValue').textContent = e.target.value;
        });

        document.getElementById('mobileSensitivityX').addEventListener('input', (e) => {
            this.settings.mobileSensitivityX = parseFloat(e.target.value);
            document.getElementById('mobileSensitivityXValue').textContent = e.target.value;
        });

        document.getElementById('mobileSensitivityY').addEventListener('input', (e) => {
            this.settings.mobileSensitivityY = parseFloat(e.target.value);
            document.getElementById('mobileSensitivityYValue').textContent = e.target.value;
        });

        document.getElementById('gyroSensitivity').addEventListener('input', (e) => {
            this.settings.gyroSensitivity = parseFloat(e.target.value);
            document.getElementById('gyroSensitivityValue').textContent = e.target.value;
        });

        document.getElementById('fov').addEventListener('input', (e) => {
            this.settings.fov = parseInt(e.target.value);
            document.getElementById('fovValue').textContent = e.target.value + '°';
            this.camera.fov = this.settings.fov;
            this.camera.updateProjectionMatrix();
        });

        document.getElementById('hudLayout').addEventListener('change', (e) => {
            this.settings.hudLayout = e.target.value;
            this.applyHUDLayout();
        });

        document.getElementById('gyroEnabled').addEventListener('change', (e) => {
            this.settings.gyroEnabled = e.target.checked;
            if (this.settings.gyroEnabled) {
                this.enableGyroscope();
            } else {
                this.disableGyroscope();
            }
        });

        document.getElementById('vibrationEnabled').addEventListener('change', (e) => {
            this.settings.vibrationEnabled = e.target.checked;
        });

        document.getElementById('invertX').addEventListener('change', (e) => {
            this.settings.invertX = e.target.checked;
        });

        document.getElementById('invertY').addEventListener('change', (e) => {
            this.settings.invertY = e.target.checked;
        });

        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
            this.toggleSettings();
        });

        document.getElementById('resetHUD').addEventListener('click', () => {
            this.resetHUDLayout();
        });

        document.getElementById('closeSettings').addEventListener('click', () => {
            this.toggleSettings();
        });

        // Settings button click event
        document.getElementById('settingsButton').addEventListener('click', () => {
            this.toggleSettings();
        });
    }

    setupMobileControls() {
        // Show mobile controls for testing on desktop too
        // if (!this.isMobile) return;

        const leftStick = document.getElementById('leftStick');
        const rightStick = document.getElementById('rightStick');
        const shootButton = document.getElementById('shootButton');
        const reloadButton = document.getElementById('reloadButton');

        // Left stick (movement)
        this.setupTouchStick(leftStick, (x, y) => {
            this.controls.leftStick.x = x;
            this.controls.leftStick.y = y;
        });

        // Right stick (look)
        this.setupTouchStick(rightStick, (x, y) => {
            this.controls.rightStick.x = x;
            this.controls.rightStick.y = y;
        });

        // Shoot button
        shootButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.controls.shooting = true;
            this.autofire.isShooting = true;
            // Fire immediately on touch
            this.shoot();
        });

        shootButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.controls.shooting = false;
            this.autofire.isShooting = false;
        });

        // Reload button
        reloadButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startReload();
        });
    }

    setupTouchStick(element, callback) {
        let isDragging = false;
        let centerX, centerY;
        let stickElement = element;

        // Create visual stick indicator
        const stickIndicator = document.createElement('div');
        stickIndicator.style.position = 'absolute';
        stickIndicator.style.width = '30px';
        stickIndicator.style.height = '30px';
        stickIndicator.style.background = 'rgba(255, 255, 255, 0.8)';
        stickIndicator.style.borderRadius = '50%';
        stickIndicator.style.top = '50%';
        stickIndicator.style.left = '50%';
        stickIndicator.style.transform = 'translate(-50%, -50%)';
        stickIndicator.style.pointerEvents = 'none';
        element.appendChild(stickIndicator);

        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDragging = true;
            const rect = element.getBoundingClientRect();
            centerX = rect.left + rect.width / 2;
            centerY = rect.top + rect.height / 2;
        });

        element.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!isDragging) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - centerX;
            const deltaY = touch.clientY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = 40;

            let x, y;
            if (distance > maxDistance) {
                const angle = Math.atan2(deltaY, deltaX);
                x = Math.cos(angle);
                y = Math.sin(angle);
            } else {
                x = deltaX / maxDistance;
                y = deltaY / maxDistance;
            }

            // Update visual indicator
            stickIndicator.style.transform = `translate(calc(-50% + ${x * 20}px), calc(-50% + ${y * 20}px))`;

            // Invert Y axis for proper control
            callback(x, -y);
        });

        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            isDragging = false;
            stickIndicator.style.transform = 'translate(-50%, -50%)';
            callback(0, 0);
        });

        // Add mouse support for testing on desktop
        element.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            const rect = element.getBoundingClientRect();
            centerX = rect.left + rect.width / 2;
            centerY = rect.top + rect.height / 2;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = 40;

            let x, y;
            if (distance > maxDistance) {
                const angle = Math.atan2(deltaY, deltaX);
                x = Math.cos(angle);
                y = Math.sin(angle);
            } else {
                x = deltaX / maxDistance;
                y = deltaY / maxDistance;
            }

            // Update visual indicator
            stickIndicator.style.transform = `translate(calc(-50% + ${x * 20}px), calc(-50% + ${y * 20}px))`;

            // Invert Y axis for proper control
            callback(x, -y);
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                stickIndicator.style.transform = 'translate(-50%, -50%)';
                callback(0, 0);
            }
        });
    }

    setupGyroscope() {
        if (!this.isMobile) return;

        if ('DeviceOrientationEvent' in window) {
            window.addEventListener('deviceorientation', (e) => {
                if (this.settings.gyroEnabled) {
                    this.gyroData.alpha = e.alpha || 0;
                    this.gyroData.beta = e.beta || 0;
                    this.gyroData.gamma = e.gamma || 0;
                }
            });
        }
    }

    enableGyroscope() {
        if ('DeviceOrientationEvent' in window) {
            DeviceOrientationEvent.requestPermission().then(response => {
                if (response === 'granted') {
                    this.isGyroEnabled = true;
                }
            }).catch(console.error);
        }
    }

    disableGyroscope() {
        this.isGyroEnabled = false;
    }

    createWorld() {
        try {
            console.log('Creating world...');
            
            // Add a simple test cube to verify rendering
            const testGeometry = new THREE.BoxGeometry(5, 5, 5);
            const testMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
            const testCube = new THREE.Mesh(testGeometry, testMaterial);
            testCube.position.set(0, 2.5, 0);
            this.scene.add(testCube);
            console.log('Test cube added to scene');
            
            // Ground - increased size
            const groundGeometry = new THREE.PlaneGeometry(500, 500);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
            console.log('Ground added to scene');

            // Create team bases and buildings
            this.createTeamBases();
            this.createBuildings();
        this.createObstacles();
            // Removed createTargetBoards() call
            
            console.log('World creation complete. Scene children count:', this.scene.children.length);
        } catch (error) {
            console.error('Error creating world:', error);
        }
    }

    createTeamBases() {
        // Blue Team Base (North)
        const blueBaseGeometry = new THREE.BoxGeometry(40, 15, 40);
        const blueBaseMaterial = new THREE.MeshLambertMaterial({ color: 0x0066CC, transparent: true, opacity: 0.8 });
        const blueBase = new THREE.Mesh(blueBaseGeometry, blueBaseMaterial);
        blueBase.position.set(0, 7.5, -200);
        blueBase.castShadow = true;
        blueBase.receiveShadow = true;
        this.scene.add(blueBase);

        // Blue Team Flag
        const blueFlagGeometry = new THREE.BoxGeometry(2, 8, 0.1);
        const blueFlagMaterial = new THREE.MeshLambertMaterial({ color: 0x0066CC });
        const blueFlag = new THREE.Mesh(blueFlagGeometry, blueFlagMaterial);
        blueFlag.position.set(0, 12, -200);
        this.scene.add(blueFlag);

        // Red Team Base (South)
        const redBaseGeometry = new THREE.BoxGeometry(40, 15, 40);
        const redBaseMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000, transparent: true, opacity: 0.8 });
        const redBase = new THREE.Mesh(redBaseGeometry, redBaseMaterial);
        redBase.position.set(0, 7.5, 200);
        redBase.castShadow = true;
        redBase.receiveShadow = true;
        this.scene.add(redBase);

        // Red Team Flag
        const redFlagGeometry = new THREE.BoxGeometry(2, 8, 0.1);
        const redFlagMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
        const redFlag = new THREE.Mesh(redFlagGeometry, redFlagMaterial);
        redFlag.position.set(0, 12, 200);
        this.scene.add(redFlag);

        // Base entrances (holes in the bases)
        const entranceGeometry = new THREE.BoxGeometry(8, 6, 2);
        const entranceMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        // Blue base entrance
        const blueEntrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
        blueEntrance.position.set(0, 3, -180);
        this.scene.add(blueEntrance);
        
        // Red base entrance
        const redEntrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
        redEntrance.position.set(0, 3, 180);
        this.scene.add(redEntrance);
    }

    createBuildings() {
        // Create multiple buildings that players can enter
        const buildingPositions = [
            { x: -100, z: -50, size: 20, height: 12 },
            { x: 100, z: -50, size: 15, height: 10 },
            { x: -100, z: 50, size: 18, height: 14 },
            { x: 100, z: 50, size: 22, height: 16 },
            { x: 0, z: 0, size: 25, height: 20 },
            { x: -150, z: 0, size: 16, height: 12 },
            { x: 150, z: 0, size: 16, height: 12 }
        ];

        buildingPositions.forEach((building, index) => {
            // Main building structure
            const buildingGeometry = new THREE.BoxGeometry(building.size, building.height, building.size);
            const buildingMaterial = new THREE.MeshLambertMaterial({ 
                color: index % 2 === 0 ? 0x8B7355 : 0x696969 
            });
            const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
            buildingMesh.position.set(building.x, building.height / 2, building.z);
            buildingMesh.castShadow = true;
            buildingMesh.receiveShadow = true;
            this.scene.add(buildingMesh);

            // Building entrance (hole in the building)
            const entranceGeometry = new THREE.BoxGeometry(building.size * 0.3, building.height * 0.6, 2);
            const entranceMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
            const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
            entrance.position.set(building.x, building.height * 0.3, building.z + building.size * 0.4);
            this.scene.add(entrance);

            // Building roof
            const roofGeometry = new THREE.BoxGeometry(building.size + 2, 1, building.size + 2);
            const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x4A4A4A });
            const roof = new THREE.Mesh(roofGeometry, roofMaterial);
            roof.position.set(building.x, building.height + 0.5, building.z);
            roof.castShadow = true;
            this.scene.add(roof);

            // Windows
            const windowGeometry = new THREE.BoxGeometry(2, 2, 0.1);
            const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.7 });
            
            // Front windows
            const frontWindow1 = new THREE.Mesh(windowGeometry, windowMaterial);
            frontWindow1.position.set(building.x - building.size * 0.2, building.height * 0.6, building.z + building.size * 0.4);
            this.scene.add(frontWindow1);
            
            const frontWindow2 = new THREE.Mesh(windowGeometry, windowMaterial);
            frontWindow2.position.set(building.x + building.size * 0.2, building.height * 0.6, building.z + building.size * 0.4);
            this.scene.add(frontWindow2);
        });
    }

    createObstacles() {
        // Create some basic obstacles (reduced from 20 to 8 for better performance)
        const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
        const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });

        for (let i = 0; i < 8; i++) { // Reduced from 20 to 8
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.set(
                Math.random() * 400 - 200,
                2.5,
                Math.random() * 400 - 200
            );
            box.castShadow = true;
            box.receiveShadow = true;
            this.scene.add(box);
        }
    }

    createGun() {
        // Create a simple gun model
        const gunGroup = new THREE.Group();
        
        // Gun body (main part) - made larger and more visible
        const gunBodyGeometry = new THREE.BoxGeometry(0.15, 0.15, 1.0);
        const gunBodyMaterial = new THREE.MeshLambertMaterial({ color: 0x2C2C2C });
        const gunBody = new THREE.Mesh(gunBodyGeometry, gunBodyMaterial);
        gunGroup.add(gunBody);
        
        // Gun barrel - made longer and more visible
        const barrelGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8);
        const barrelMaterial = new THREE.MeshLambertMaterial({ color: 0x4A4A4A });
        const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        barrel.rotation.z = Math.PI / 2;
        barrel.position.set(0, 0, 0.9);
        gunGroup.add(barrel);
        
        // Gun grip - made larger
        const gripGeometry = new THREE.BoxGeometry(0.12, 0.4, 0.15);
        const gripMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const grip = new THREE.Mesh(gripGeometry, gripMaterial);
        grip.position.set(0, -0.3, 0.3);
        gunGroup.add(grip);
        
        // Gun trigger - made more visible
        const triggerGeometry = new THREE.BoxGeometry(0.03, 0.08, 0.03);
        const triggerMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
        const trigger = new THREE.Mesh(triggerGeometry, triggerMaterial);
        trigger.position.set(0, -0.25, 0.4);
        gunGroup.add(trigger);
        
        // Gun scope/sight - enhanced with visual effects
        const scopeBodyGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8);
        const scopeBodyMaterial = new THREE.MeshLambertMaterial({ color: 0x1A1A1A });
        const scopeBody = new THREE.Mesh(scopeBodyGeometry, scopeBodyMaterial);
        scopeBody.rotation.z = Math.PI / 2;
        scopeBody.position.set(0, 0.15, 0.5);
        gunGroup.add(scopeBody);
        
        // Scope lens (front)
        const lensGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16);
        const lensMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: 0.8
        });
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        lens.rotation.z = Math.PI / 2;
        lens.position.set(0, 0.15, 0.65);
        gunGroup.add(lens);
        
        // Scope lens (back)
        const backLensGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16);
        const backLensMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: 0.6
        });
        const backLens = new THREE.Mesh(backLensGeometry, backLensMaterial);
        backLens.rotation.z = Math.PI / 2;
        backLens.position.set(0, 0.15, 0.35);
        gunGroup.add(backLens);
        
        // Scope crosshair reticle
        const reticleGeometry = new THREE.RingGeometry(0.01, 0.02, 8);
        const reticleMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
        const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
        reticle.rotation.z = Math.PI / 2;
        reticle.position.set(0, 0.15, 0.5);
        gunGroup.add(reticle);
        
        // Scope mount/rail
        const mountGeometry = new THREE.BoxGeometry(0.12, 0.05, 0.1);
        const mountMaterial = new THREE.MeshLambertMaterial({ color: 0x2C2C2C });
        const mount = new THREE.Mesh(mountGeometry, mountMaterial);
        mount.position.set(0, 0.1, 0.4);
        gunGroup.add(mount);
        
        // Position the gun more prominently in front of the camera
        gunGroup.position.set(0.4, -0.3, -0.8);
        gunGroup.rotation.y = Math.PI / 8; // Slight angle
        gunGroup.rotation.z = Math.PI / 24; // Slight tilt
        
        // Add gun to camera
        this.camera.add(gunGroup);
        this.gun = gunGroup;
        
        // Add gun recoil animation
        this.gunRecoil = 0;
    }

    createPlayerGun() {
        // Create AK47 model for other players
        const gunGroup = new THREE.Group();
        
        // AK47 main body (larger and more visible)
        const gunBodyGeometry = new THREE.BoxGeometry(0.15, 0.15, 1.5);
        const gunBodyMaterial = new THREE.MeshLambertMaterial({ color: 0x1A1A1A });
        const gunBody = new THREE.Mesh(gunBodyGeometry, gunBodyMaterial);
        gunGroup.add(gunBody);
        
        // AK47 distinctive curved magazine (larger)
        const magazineGeometry = new THREE.BoxGeometry(0.12, 0.5, 0.12);
        const magazineMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const magazine = new THREE.Mesh(magazineGeometry, magazineMaterial);
        magazine.position.set(0, -0.3, 0.3);
        magazine.rotation.x = Math.PI / 6; // Curved magazine angle
        gunGroup.add(magazine);
        
        // AK47 barrel (longer and more visible)
        const barrelGeometry = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
        const barrelMaterial = new THREE.MeshLambertMaterial({ color: 0x4A4A4A });
        const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        barrel.rotation.z = Math.PI / 2;
        barrel.position.set(0, 0, 1.3);
        gunGroup.add(barrel);
        
        // Gas tube (AK47 distinctive feature)
        const gasTubeGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.0, 8);
        const gasTubeMaterial = new THREE.MeshLambertMaterial({ color: 0x4A4A4A });
        const gasTube = new THREE.Mesh(gasTubeGeometry, gasTubeMaterial);
        gasTube.rotation.z = Math.PI / 2;
        gasTube.position.set(0, 0.1, 1.0);
        gunGroup.add(gasTube);
        
        // AK47 wooden stock (larger)
        const stockGeometry = new THREE.BoxGeometry(0.12, 0.2, 0.8);
        const stockMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const stock = new THREE.Mesh(stockGeometry, stockMaterial);
        stock.position.set(0, -0.15, -0.5);
        stock.rotation.x = Math.PI / 12; // Slight angle
        gunGroup.add(stock);
        
        // AK47 wooden handguard (larger)
        const handguardGeometry = new THREE.BoxGeometry(0.1, 0.15, 0.5);
        const handguardMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const handguard = new THREE.Mesh(handguardGeometry, handguardMaterial);
        handguard.position.set(0, 0, 0.4);
        gunGroup.add(handguard);
        
        // AK47 distinctive front sight (larger)
        const frontSightGeometry = new THREE.BoxGeometry(0.03, 0.12, 0.03);
        const frontSightMaterial = new THREE.MeshLambertMaterial({ color: 0x2C2C2C });
        const frontSight = new THREE.Mesh(frontSightGeometry, frontSightMaterial);
        frontSight.position.set(0, 0.08, 1.4);
        gunGroup.add(frontSight);
        
        // AK47 rear sight (larger)
        const rearSightGeometry = new THREE.BoxGeometry(0.03, 0.08, 0.03);
        const rearSightMaterial = new THREE.MeshLambertMaterial({ color: 0x2C2C2C });
        const rearSight = new THREE.Mesh(rearSightGeometry, rearSightMaterial);
        rearSight.position.set(0, 0.1, 0.3);
        gunGroup.add(rearSight);
        
        // AK47 trigger (larger and more visible)
        const triggerGeometry = new THREE.BoxGeometry(0.03, 0.08, 0.03);
        const triggerMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
        const trigger = new THREE.Mesh(triggerGeometry, triggerMaterial);
        trigger.position.set(0, -0.2, 0.5);
        gunGroup.add(trigger);
        
        // AK47 distinctive selector switch (larger)
        const selectorGeometry = new THREE.BoxGeometry(0.03, 0.06, 0.03);
        const selectorMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
        const selector = new THREE.Mesh(selectorGeometry, selectorMaterial);
        selector.position.set(0.1, 0.08, 0.4);
        gunGroup.add(selector);
        
        // Add a bright color accent to make it more visible
        const accentGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.3);
        const accentMaterial = new THREE.MeshBasicMaterial({ color: 0xFF4444 });
        const accent = new THREE.Mesh(accentGeometry, accentMaterial);
        accent.position.set(0.08, 0.08, 0.6);
        gunGroup.add(accent);
        
        // Make the gun bigger overall
        gunGroup.scale.set(0.8, 0.8, 0.8);
        
        return gunGroup;
    }

    addPlayer(playerData) {
        if (this.players.has(playerData.id)) return;

        console.log(`Adding player ${playerData.id} at position:`, playerData.position, 'team:', playerData.team);

        // Create a more detailed player model
        const playerGroup = new THREE.Group();
        
        // Body (torso)
        const bodyGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.4);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: playerData.team === 0 ? 0x0066FF : 0xFF4444 
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.6;
        body.castShadow = true;
        playerGroup.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const headMaterial = new THREE.MeshLambertMaterial({ 
            color: playerData.team === 0 ? 0x0066FF : 0xFF4444 
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.8;
        head.castShadow = true;
        playerGroup.add(head);
        
        // Arms
        const armGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
        const armMaterial = new THREE.MeshLambertMaterial({ 
            color: playerData.team === 0 ? 0x0066FF : 0xFF4444 
        });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.5, 0.6, 0);
        leftArm.castShadow = true;
        playerGroup.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.5, 0.6, 0);
        rightArm.castShadow = true;
        playerGroup.add(rightArm);
        
        // Legs
        const legGeometry = new THREE.BoxGeometry(0.25, 0.8, 0.25);
        const legMaterial = new THREE.MeshLambertMaterial({ 
            color: playerData.team === 0 ? 0x0066FF : 0xFF4444 
        });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.2, -0.4, 0);
        leftLeg.castShadow = true;
        playerGroup.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.2, -0.4, 0);
        rightLeg.castShadow = true;
        playerGroup.add(rightLeg);
        
        // Position the entire player group
        playerGroup.position.set(
            playerData.position.x,
            playerData.position.y,
            playerData.position.z
        );
        
        // Add team indicator above player
        const teamIndicatorGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const teamIndicatorMaterial = new THREE.MeshBasicMaterial({ 
            color: playerData.team === 0 ? 0x0066FF : 0xFF4444 
        });
        const teamIndicator = new THREE.Mesh(teamIndicatorGeometry, teamIndicatorMaterial);
        teamIndicator.position.y = 2.5;
        playerGroup.add(teamIndicator);
        
        // Add AK47 gun to player's right hand
        const playerGun = this.createPlayerGun();
        playerGun.position.set(0.8, 0.6, 0.2); // Better position in right hand
        playerGun.rotation.y = Math.PI / 3; // Better angle for visibility
        playerGun.rotation.z = Math.PI / 8; // Slight tilt
        playerGun.scale.set(1.2, 1.2, 1.2); // Make gun bigger and more visible
        
        // Add a bright outline to make the gun more visible
        const gunOutline = new THREE.LineSegments(
            new THREE.EdgesGeometry(playerGun.children[0].geometry),
            new THREE.LineBasicMaterial({ color: 0xFFFF00, linewidth: 2 })
        );
        playerGun.add(gunOutline);
        
        playerGroup.add(playerGun);
        console.log(`Added AK47 gun to player ${playerData.id}`);
        
        // Add player name display
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = playerData.team === 0 ? '#0066FF' : '#FF4444';
        context.font = 'bold 20px Arial';
        context.textAlign = 'center';
        context.fillText(playerData.name || 'Player', canvas.width / 2, 25);
        
        context.fillStyle = '#FFFFFF';
        context.font = '14px Arial';
        context.fillText(`Team ${playerData.team === 0 ? 'Blue' : 'Red'}`, canvas.width / 2, 45);
        
        const texture = new THREE.CanvasTexture(canvas);
        const nameMaterial = new THREE.SpriteMaterial({ map: texture });
        const nameSprite = new THREE.Sprite(nameMaterial);
        nameSprite.position.y = 3.0;
        nameSprite.scale.set(2, 0.5, 1);
        playerGroup.add(nameSprite);

        this.scene.add(playerGroup);
        this.players.set(playerData.id, {
            mesh: playerGroup,
            data: playerData
        });
        
        console.log(`Player ${playerData.id} added successfully with AK47`);
    }

    updatePlayerPosition(data) {
        const player = this.players.get(data.id);
        if (player) {
            // Update player position smoothly
            player.mesh.position.set(
                data.position.x,
                data.position.y,
                data.position.z
            );
            
            // Update player rotation
            if (data.rotation) {
                player.mesh.rotation.set(
                    data.rotation.x || 0,
                    data.rotation.y || 0,
                    data.rotation.z || 0
                );
            }
            
            // Update player data
            player.data.position = data.position;
            player.data.rotation = data.rotation;
            player.data.velocity = data.velocity;
            
            console.log(`Updated player ${data.id} position:`, data.position);
        }
    }

    removePlayer(playerId) {
        const player = this.players.get(playerId);
        if (player) {
            this.scene.remove(player.mesh);
            this.players.delete(playerId);
        }
    }

    addProjectile(projectileData) {
        // Bullet cap: If too many projectiles, ignore new ones
        if (this.projectiles.size > 100) return; // Reduced from 200 to 100
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
        const projectileMesh = new THREE.Mesh(geometry, material);
        projectileMesh.position.set(
            projectileData.position.x,
            projectileData.position.y,
            projectileData.position.z
        );
        this.scene.add(projectileMesh);
        this.projectiles.set(projectileData.id, {
            mesh: projectileMesh,
            data: projectileData
        });
        
        // Removed target board hit detection since target boards no longer exist
    }

    removeProjectile(projectileId) {
        const projectile = this.projectiles.get(projectileId);
        if (projectile) {
            this.scene.remove(projectile.mesh);
            this.projectiles.delete(projectileId);
        }
    }

    shoot() {
        if (this.gameState.ammo <= 0 || this.reloadState.isReloading) return;

        // Check autofire rate limit when shooting continuously
        const now = Date.now();
        if (this.autofire.isShooting && (now - this.autofire.lastFireTime) < this.autofire.fireRate) {
            return;
        }
        this.autofire.lastFireTime = now;

        this.gameState.ammo--;
        this.updateHUD();

        // Auto-reload when ammo is empty
        if (this.gameState.ammo <= 0) {
            this.startReload();
        }

        if (this.settings.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Add gun recoil
        if (this.gun) {
            this.gunRecoil = 0.1;
        }

        // Calculate shooting direction
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);

        const shootData = {
            position: {
                x: this.camera.position.x,
                y: this.camera.position.y,
                z: this.camera.position.z
            },
            direction: {
                x: direction.x,
                y: direction.y,
                z: direction.z
            },
            velocity: {
                x: direction.x * 200, // Increased from 50 to 200 (300% faster)
                y: direction.y * 200,
                z: direction.z * 200
            }
        };

        this.socket.emit('playerShoot', shootData);
    }

    // Add damage display
    addDamageDisplay(position, damage, isHeadshot = false) {
        const damageText = document.createElement('div');
        damageText.className = 'damage-display';
        damageText.textContent = damage.toString();
        damageText.style.position = 'absolute';
        damageText.style.color = isHeadshot ? '#FF0000' : '#FFFF00';
        damageText.style.fontSize = '24px';
        damageText.style.fontWeight = 'bold';
        damageText.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        damageText.style.pointerEvents = 'none';
        damageText.style.zIndex = '1000';
        damageText.style.transition = 'all 0.5s ease-out';
        
        // Convert 3D position to screen coordinates
        const vector = new THREE.Vector3(position.x, position.y, position.z);
        vector.project(this.camera);
        
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
        
        damageText.style.left = x + 'px';
        damageText.style.top = y + 'px';
        
        document.body.appendChild(damageText);
        
        // Animate the damage display
        setTimeout(() => {
            damageText.style.transform = 'translateY(-50px) scale(1.5)';
            damageText.style.opacity = '0';
        }, 100);
        
        // Remove after animation
        setTimeout(() => {
            if (damageText.parentNode) {
                damageText.parentNode.removeChild(damageText);
            }
        }, 1000);
        
        this.damageDisplays.push(damageText);
    }

    // Check target board hits
    checkTargetBoardHits(projectilePosition, projectileDirection) {
        this.targetBoards.forEach((targetGroup, index) => {
            const targetPosition = targetGroup.position;
            const distance = projectilePosition.distanceTo(targetPosition);
            
            // Check if projectile is close to target board (increased detection radius for larger targets)
            if (distance < 5) {
                // Calculate damage based on distance (closer = more damage)
                const damage = Math.max(10, Math.floor(50 - distance * 5));
                
                // Show damage on target board
                this.addDamageDisplay(targetPosition, damage);
                
                // Change target board color briefly
                const targetBoard = targetGroup.children[0]; // Main target board is first child
                if (targetBoard && targetBoard.material) {
                    const originalColor = targetBoard.material.color.getHex();
                    targetBoard.material.color.setHex(0xFF0000);
                    
                    setTimeout(() => {
                        targetBoard.material.color.setHex(originalColor);
                    }, 200);
                }
                
                console.log(`Target board ${index} hit! Damage: ${damage}`);
            }
        });
    }

    handlePlayerHit(data) {
        if (data.targetId === this.socket.id) {
            this.gameState.health = data.targetHealth;
            this.gameState.deaths++;
            this.updateHUD();
            
            // Show damage display for self
            this.addDamageDisplay(this.camera.position, data.damage);
            
            if (this.settings.vibrationEnabled && navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
        } else if (data.shooterId === this.socket.id) {
            this.gameState.score = data.shooterScore;
            this.gameState.kills++;
            this.updateHUD();
            
            // Show damage display for hit player
            const targetPlayer = this.players.get(data.targetId);
            if (targetPlayer) {
                this.addDamageDisplay(targetPlayer.mesh.position, data.damage);
            }
        }
    }

    updateHUD() {
        document.getElementById('healthFill').style.width = this.gameState.health + '%';
        
        // Update ammo counter with reload status
        const ammoCounter = document.getElementById('ammoCounter');
        if (this.reloadState.isReloading) {
            const reloadProgress = Math.min(1, (Date.now() - this.reloadState.reloadStartTime) / this.reloadState.reloadTime);
            ammoCounter.textContent = `RELOADING ${Math.round(reloadProgress * 100)}%`;
            ammoCounter.style.color = '#FFA500'; // Orange color for reloading
        } else {
            ammoCounter.textContent = `${this.gameState.ammo}/${this.gameState.maxAmmo}`;
            ammoCounter.style.color = 'white'; // Normal color
        }
        
        // Update autofire status
        const autofireStatus = document.getElementById('autofireStatus');
        if (autofireStatus) {
            if (this.autofire.isEnabled) {
                autofireStatus.textContent = 'AUTOFIRE: ON';
                autofireStatus.style.color = '#00FF00'; // Green for enabled
            } else {
                autofireStatus.textContent = 'AUTOFIRE: OFF';
                autofireStatus.style.color = '#FF0000'; // Red for disabled
            }
        }
        
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('kills').textContent = this.gameState.kills;
        document.getElementById('deaths').textContent = this.gameState.deaths;
        
        // Update FPS and latency
        document.getElementById('fps').textContent = this.fps.current;
        document.getElementById('latency').textContent = this.latency;
    }

    makeDraggable(element) {
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                element.style.left = currentX + 'px';
                element.style.top = currentY + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    applyHUDLayout() {
        const hud = document.getElementById('hud');
        
        switch (this.settings.hudLayout) {
            case 'minimal':
                hud.style.opacity = '0.7';
                document.getElementById('scoreBoard').style.display = 'none';
                break;
            case 'pro':
                hud.style.opacity = '1';
                document.getElementById('scoreBoard').style.display = 'block';
                // Add more professional HUD elements
                break;
            case 'custom':
                hud.style.opacity = '1';
                document.getElementById('scoreBoard').style.display = 'block';
                // Enable custom positioning
                break;
            default:
                hud.style.opacity = '1';
                document.getElementById('scoreBoard').style.display = 'block';
        }
    }

    resetHUDLayout() {
        const elements = document.querySelectorAll('.hud-element');
        elements.forEach(element => {
            element.style.left = '';
            element.style.top = '';
        });
        this.settings.hudLayout = 'default';
        this.applyHUDLayout();
    }

    toggleSettings() {
        const panel = document.getElementById('settingsPanel');
        const isVisible = panel.style.display === 'block';
        
        if (isVisible) {
            // Closing settings - re-enable pointer lock
            panel.style.display = 'none';
            if (!this.isMobile) {
                this.renderer.domElement.requestPointerLock();
            }
        } else {
            // Opening settings - exit pointer lock
            panel.style.display = 'block';
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }
        }
    }

    async loadSettings() {
        const saved = localStorage.getItem('krunkerSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        
        // Update settings panel with loaded values
        document.getElementById('sensitivity').value = this.settings.sensitivity;
        document.getElementById('sensitivityValue').textContent = this.settings.sensitivity;
        
        document.getElementById('sensitivityX').value = this.settings.sensitivityX;
        document.getElementById('sensitivityXValue').textContent = this.settings.sensitivityX;
        
        document.getElementById('sensitivityY').value = this.settings.sensitivityY;
        document.getElementById('sensitivityYValue').textContent = this.settings.sensitivityY;
        
        document.getElementById('mobileSensitivity').value = this.settings.mobileSensitivity;
        document.getElementById('mobileSensitivityValue').textContent = this.settings.mobileSensitivity;
        
        document.getElementById('mobileSensitivityX').value = this.settings.mobileSensitivityX;
        document.getElementById('mobileSensitivityXValue').textContent = this.settings.mobileSensitivityX;
        
        document.getElementById('mobileSensitivityY').value = this.settings.mobileSensitivityY;
        document.getElementById('mobileSensitivityYValue').textContent = this.settings.mobileSensitivityY;
        
        // Load invert axis settings
        document.getElementById('invertX').checked = this.settings.invertX;
        document.getElementById('invertY').checked = this.settings.invertY;
    }

    saveSettings() {
        localStorage.setItem('krunkerSettings', JSON.stringify(this.settings));
    }

    startLatencyMeasurement() {
        // Measure latency every second
        setInterval(() => {
            this.lastPingTime = Date.now();
            this.socket.emit('ping');
        }, 1000);
    }

    setupMainMenu() {
        // Main menu button event listeners
        document.getElementById('playButton').addEventListener('click', () => {
            this.startDeathmatch();
        });

        document.getElementById('createTeamButton').addEventListener('click', () => {
            this.createTeam();
        });

        document.getElementById('joinTeamButton').addEventListener('click', () => {
            this.joinTeam();
        });

        document.getElementById('startTeamDeathmatch').addEventListener('click', () => {
            this.startTeamDeathmatch();
        });

        document.getElementById('settingsMenuButton').addEventListener('click', () => {
            this.toggleSettings();
        });

        document.getElementById('copyTeamCode').addEventListener('click', () => {
            this.copyTeamCode();
        });
    }

    showMainMenu() {
        try {
            console.log('showMainMenu called');
            this.gameMode = 'menu';
            
            const mainMenu = document.getElementById('mainMenu');
            const loadingScreen = document.getElementById('loadingScreen');
            const gameContainer = document.getElementById('gameContainer');
            
            console.log('Main menu element:', mainMenu);
            console.log('Loading screen element:', loadingScreen);
            console.log('Game container element:', gameContainer);
            
            // Show the game container (it contains the main menu)
            if (gameContainer) {
                gameContainer.style.display = 'block';
                console.log('Game container displayed');
            }
            
            if (mainMenu) {
                mainMenu.style.display = 'flex';
                console.log('Main menu displayed');
            } else {
                console.error('Main menu element not found!');
            }
            
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
            
            // Hide the HUD when in menu
            const hud = document.getElementById('hud');
            if (hud) {
                hud.style.display = 'none';
            }
            
            // Hide mobile controls when in menu
            const mobileControls = document.getElementById('mobileControls');
            if (mobileControls) {
                mobileControls.style.display = 'none';
            }
            
            // Set camera to a good viewing position for the menu
            if (this.camera) {
                this.camera.position.set(0, 5, 10);
                this.camera.rotation.set(0, 0, 0);
                this.camera.lookAt(0, 0, 0);
                console.log('Camera positioned for menu view');
            }
        } catch (error) {
            console.error('Error in showMainMenu:', error);
        }
    }

    hideMainMenu() {
        try {
            const mainMenu = document.getElementById('mainMenu');
            const hud = document.getElementById('hud');
            const mobileControls = document.getElementById('mobileControls');
            
            if (mainMenu) {
                mainMenu.style.display = 'none';
            }
            
            // Show the HUD when leaving menu
            if (hud) {
                hud.style.display = 'block';
            }
            
            // Show mobile controls if on mobile
            if (mobileControls && this.isMobile) {
                mobileControls.style.display = 'block';
            }
        } catch (error) {
            console.error('Error in hideMainMenu:', error);
        }
    }

    startDeathmatch() {
        this.gameMode = 'loading';
        this.hideMainMenu();
        document.getElementById('loadingScreen').style.display = 'flex';
        document.getElementById('gameContainer').style.display = 'block';
        
        // Setup socket connection when starting game
        this.setupSocket();
        
        // Wait for socket to be connected before joining
        let connectionAttempts = 0;
        const maxAttempts = 50; // 5 seconds timeout
        
        const checkConnection = () => {
            connectionAttempts++;
            
            if (this.socket && this.socket.connected) {
                // Connect to server and start game
                this.socket.emit('playerJoin', { 
                    name: 'Player',
                    gameMode: 'deathmatch',
                    teamId: this.teamData.teamId 
                });
                
                // Hide loading screen after connection
                setTimeout(() => {
                    document.getElementById('loadingScreen').style.display = 'none';
                    this.gameMode = 'playing';
                }, 1000);
            } else if (connectionAttempts >= maxAttempts) {
                // Timeout - show error and return to menu
                alert('Failed to connect to server. Please try again.');
                this.showMainMenu();
            } else {
                // Check again in 100ms if not connected yet
                setTimeout(checkConnection, 100);
            }
        };
        
        // Start checking for connection
        checkConnection();
    }

    createTeam() {
        // Setup socket connection if not already connected
        if (!this.socket) {
            this.setupSocket();
        }
        
        const teamCode = this.generateTeamCode();
        this.teamData.teamId = teamCode;
        this.teamData.teamCode = teamCode;
        this.teamData.isLeader = true;
        this.teamData.leaderId = this.socket ? this.socket.id : 'You';
        this.teamData.members = [{ id: 'You', name: 'You' }];
        
        document.getElementById('teamCode').textContent = teamCode;
        document.getElementById('teamSection').style.display = 'block';
        
        // Show start deathmatch button only for leader
        const startDeathmatchBtn = document.getElementById('startTeamDeathmatch');
        if (startDeathmatchBtn) {
            startDeathmatchBtn.style.display = 'block';
        }
        
        this.updateTeamMembersList();
        
        // Send team creation to server after connection
        let connectionAttempts = 0;
        const maxAttempts = 50; // 5 seconds timeout
        
        const checkConnection = () => {
            connectionAttempts++;
            
            if (this.socket && this.socket.connected) {
                this.socket.emit('createTeam', { teamCode });
            } else if (connectionAttempts >= maxAttempts) {
                // Timeout - show error
                alert('Failed to connect to server. Please try again.');
            } else {
                // Check again in 100ms if not connected yet
                setTimeout(checkConnection, 100);
            }
        };
        
        // Start checking for connection
        checkConnection();
    }

    joinTeam() {
        const teamCode = prompt('Enter team code:');
        if (!teamCode) return;
        
        // Setup socket connection if not already connected
        if (!this.socket) {
            this.setupSocket();
        }
        
        this.teamData.teamId = teamCode;
        this.teamData.teamCode = teamCode;
        this.teamData.isLeader = false;
        this.teamData.leaderId = null;
        this.teamData.members = [];
        
        document.getElementById('teamCode').textContent = teamCode;
        document.getElementById('teamSection').style.display = 'block';
        
        // Hide start deathmatch button for non-leaders
        const startDeathmatchBtn = document.getElementById('startTeamDeathmatch');
        if (startDeathmatchBtn) {
            startDeathmatchBtn.style.display = 'none';
        }
        
        this.updateTeamMembersList();
        
        // Send team join request after connection
        let connectionAttempts = 0;
        const maxAttempts = 50; // 5 seconds timeout
        
        const checkConnection = () => {
            connectionAttempts++;
            
            if (this.socket && this.socket.connected) {
                this.socket.emit('joinTeam', { teamCode });
            } else if (connectionAttempts >= maxAttempts) {
                // Timeout - show error
                alert('Failed to connect to server. Please try again.');
            } else {
                // Check again in 100ms if not connected yet
                setTimeout(checkConnection, 100);
            }
        };
        
        // Start checking for connection
        checkConnection();
    }

    copyTeamCode() {
        const teamCode = document.getElementById('teamCode').textContent;
        navigator.clipboard.writeText(teamCode).then(() => {
            alert('Team code copied to clipboard!');
        });
    }

    generateTeamCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    updateTeamMembersList() {
        const list = document.getElementById('teamMembersList');
        list.innerHTML = '';
        this.teamData.members.forEach(member => {
            const li = document.createElement('li');
            li.textContent = member.name;
            list.appendChild(li);
        });
    }

    startReload() {
        if (this.reloadState.isReloading || this.gameState.ammo === this.gameState.maxAmmo) {
            return; // Already reloading or full ammo
        }
        
        this.reloadState.isReloading = true;
        this.reloadState.reloadStartTime = Date.now();
        
        // Update HUD to show reloading
        this.updateHUD();
        
        // Auto-reload after 2 seconds
        setTimeout(() => {
            this.completeReload();
        }, this.reloadState.reloadTime);
    }

    completeReload() {
        this.gameState.ammo = this.gameState.maxAmmo;
        this.reloadState.isReloading = false;
        this.updateHUD();
    }

    handleGameState(data) {
        try {
            console.log('Handling game state:', data);
            
            // Start the game if we're in loading mode
            if (this.gameMode === 'loading') {
                this.gameMode = 'playing';
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.style.display = 'none';
                }
                console.log('Game started, loading screen hidden');
                
                // Set initial camera position for game start
                if (this.camera) {
                    this.camera.position.set(0, 2, 0);
                    this.camera.rotation.set(0, 0, 0);
                    console.log('Initial camera position set for game start');
                }
            }
            
            // Only clear and update if we're actually in playing mode
            if (this.gameMode === 'playing') {
        // Clear existing players and projectiles
                this.players.forEach(player => {
                    if (player.mesh && this.scene) {
                        this.scene.remove(player.mesh);
                    }
                });
        this.players.clear();
                
                this.projectiles.forEach(projectile => {
                    if (projectile.mesh && this.scene) {
                        this.scene.remove(projectile.mesh);
                    }
                });
        this.projectiles.clear();

        // Add all players
                if (data.players) {
        data.players.forEach(player => this.addPlayer(player));
                }
        
        // Add all projectiles
                if (data.projectiles) {
        data.projectiles.forEach(projectile => this.addProjectile(projectile));
    }

                // Set player position based on team assignment
                const player = data.players ? data.players.find(p => p.id === this.socket.id) : null;
                if (player && this.camera) {
                    this.camera.position.set(player.position.x, player.position.y, player.position.z);
                    this.camera.rotation.set(player.rotation.x, player.rotation.y, player.rotation.z);
                    console.log('Camera position set to:', player.position);
                }
            }
        } catch (error) {
            console.error('Error in handleGameState:', error);
        }
    }

    updatePlayerMovement() {
        const moveSpeed = 4.0; // Increased from 2.0 to 4.0 for faster movement
        const velocity = new THREE.Vector3();
        // Get movement direction from keys (proper FPS camera-relative)
        let inputX = 0, inputZ = 0;
        if (this.keys['KeyW']) inputZ -= 1; // Forward
        if (this.keys['KeyS']) inputZ += 1; // Backward
        if (this.keys['KeyA']) inputX -= 1; // Left
        if (this.keys['KeyD']) inputX += 1; // Right

        // Normalize input
        let inputLength = Math.hypot(inputX, inputZ);
        if (inputLength > 0) {
            inputX /= inputLength;
            inputZ /= inputLength;
        }

        // Rotate input by camera yaw (Y axis)
        const yaw = this.camera.rotation.y;
        const moveX = inputX * Math.cos(yaw) - inputZ * Math.sin(yaw);
        const moveZ = inputX * Math.sin(yaw) + inputZ * Math.cos(yaw);
        velocity.x = moveX;
        velocity.z = moveZ;

        // Apply speed
        if (velocity.length() > 0) {
            velocity.normalize().multiplyScalar(moveSpeed);
        }

        // Jumping
        if (this.keys['Space']) {
            if (this.playerPosition.y <= 1.8) {
                this.physics.velocityY = this.physics.jumpForce;
            }
        }

        // Crouching
        if (this.keys['ShiftLeft']) {
            if (this.playerPosition.y > 1.8) {
                velocity.y -= moveSpeed;
            }
        }

        // Mobile movement
        if (this.isMobile) {
            velocity.x += this.controls.leftStick.x * moveSpeed;
            velocity.z -= this.controls.leftStick.y * moveSpeed;
        }

        // Apply gravity
        velocity.y += this.physics.velocityY;
        this.physics.velocityY -= this.physics.gravity;

        // Update player position with collision detection
        const newPosition = this.playerPosition.clone().add(velocity);

        // Map boundary collision detection (500x500 map, boundaries at ±250)
        const mapBoundary = 250;
        newPosition.x = Math.max(-mapBoundary, Math.min(mapBoundary, newPosition.x));
        newPosition.z = Math.max(-mapBoundary, Math.min(mapBoundary, newPosition.z));

        // Ground collision detection
        if (newPosition.y < 1.8) {
            newPosition.y = 1.8;
            this.physics.velocityY = 0;
        }

        // Apply the constrained position
        this.playerPosition.copy(newPosition);

        // Send movement to server every 2 frames (30 FPS)
        if (this.fps.frames % 2 === 0) {
        this.socket.emit('playerMove', {
                position: {
                    x: this.playerPosition.x,
                    y: this.playerPosition.y,
                    z: this.playerPosition.z
                },
            rotation: {
                x: this.camera.rotation.x,
                y: this.camera.rotation.y,
                z: this.camera.rotation.z
            },
                velocity: {
                    x: velocity.x,
                    y: velocity.y,
                    z: velocity.z
                }
            });
        }
    }

    // In animate(), update TPP camera logic to use this.playerPosition
    animate() {
        requestAnimationFrame(() => this.animate());

        // Calculate FPS
        this.fps.frames++;
        const currentTime = performance.now();
        if (currentTime - this.fps.lastTime >= 1000) {
            this.fps.current = this.fps.frames;
            this.fps.frames = 0;
            this.fps.lastTime = currentTime;
        }

        // Only update game logic if we have a valid scene and camera
        if (this.scene && this.camera && this.renderer) {
            // Handle autofire
            if (this.autofire.isShooting) {
                this.shoot();
            }

            // Update player movement at 60 FPS only when playing
            if (this.gameMode === 'playing') {
                this.updatePlayerMovement();
            }

            // Always update camera rotation (for menu navigation)
            this.updateCameraRotation();

            // FPP: Camera follows player position directly
            if (this.gameMode === 'playing') {
                this.camera.position.copy(this.playerPosition);
                
                // Make player model face the same direction as camera
                const localPlayer = this.players.get(this.socket.id);
                if (localPlayer && localPlayer.mesh) {
                    localPlayer.mesh.rotation.y = this.camera.rotation.y;
                }
            }

            // Only update game-specific elements when playing
            if (this.gameMode === 'playing') {
                this.updateProjectiles();
                this.updateGunRecoil();
                this.updateOtherPlayers();
            }

            // Always render the scene
            this.renderer.render(this.scene, this.camera);

            // Debug: Log scene info occasionally
            if (this.fps.frames % 60 === 0) { // Every 60 frames (about once per second)
                console.log('Scene info:', {
                    children: this.scene.children.length,
                    cameraPosition: this.camera.position.toArray(),
                    gameMode: this.gameMode
                });
            }
        } else {
            console.error('Missing required components for rendering:', {
                scene: !!this.scene,
                camera: !!this.camera,
                renderer: !!this.renderer
            });
        }
    }

    updateCameraRotation() {
        // PC: Direct mouse look, no smoothing, clamp pitch
        if (!this.isMobile) {
            const xMultiplier = this.settings.invertX ? 1 : -1;
            const yMultiplier = this.settings.invertY ? -1 : 1;
            this.camera.rotation.y += this.mouse.deltaX * xMultiplier;
            let targetX = this.camera.rotation.x + this.mouse.deltaY * yMultiplier;
            this.camera.rotation.x = Math.max(-Math.PI/2.2, Math.min(Math.PI/2.2, targetX));
        }
        // Mobile look (unchanged)
        if (this.isMobile) {
            const xMultiplier = this.settings.invertX ? -1 : 1;
            const yMultiplier = this.settings.invertY ? 1 : -1;
            this.camera.rotation.y += this.controls.rightStick.x * 0.05 * this.settings.mobileSensitivityX * xMultiplier;
            this.camera.rotation.x += this.controls.rightStick.y * 0.05 * this.settings.mobileSensitivityY * yMultiplier;
            this.camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.camera.rotation.x));
        }
        // Gyroscope look (unchanged)
        if (this.isGyroEnabled && this.settings.gyroEnabled) {
            const gyroSensitivity = this.settings.gyroSensitivity * 0.01;
            const xMultiplier = this.settings.invertX ? -1 : 1;
            const yMultiplier = this.settings.invertY ? 1 : -1;
            this.camera.rotation.y += this.gyroData.gamma * gyroSensitivity * xMultiplier;
            this.camera.rotation.x += this.gyroData.beta * gyroSensitivity * yMultiplier;
            this.camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.camera.rotation.x));
        }
        // Reset mouse delta
        this.mouse.deltaX = 0;
        this.mouse.deltaY = 0;
    }

    updateProjectiles() {
        this.projectiles.forEach((projectile, id) => {
            const velocity = new THREE.Vector3(
                projectile.data.velocity[0],
                projectile.data.velocity[1],
                projectile.data.velocity[2]
            );
            projectile.mesh.position.add(velocity.multiplyScalar(0.016));
        });
    }

    updateGunRecoil() {
        if (this.gun && this.gunRecoil > 0) {
            // Apply recoil effect
            this.gun.position.z += this.gunRecoil;
            this.gun.rotation.x -= this.gunRecoil * 2;
            
            // Additional recoil when scoped
            if (this.scope.isAiming) {
                this.gun.position.y -= this.gunRecoil * 0.5;
                this.gun.rotation.z += this.gunRecoil * 0.3;
            }
            
            // Reduce recoil over time
            this.gunRecoil *= 0.9;
            
            // Reset gun position when recoil is minimal
            if (this.gunRecoil < 0.001) {
                this.gunRecoil = 0;
                this.gun.position.z = -0.8;
                this.gun.position.y = -0.3;
                this.gun.rotation.x = 0;
                this.gun.rotation.z = 0;
            }
        }
        
        // Animate other players' guns (subtle sway)
        this.players.forEach((player, playerId) => {
            if (playerId !== this.socket.id && player.mesh) {
                const gun = player.mesh.children.find(child => child.type === 'Group');
                if (gun) {
                    // Add subtle breathing/sway animation
                    const time = Date.now() * 0.001;
                    gun.rotation.y = Math.sin(time * 2) * 0.05;
                    gun.rotation.z = Math.cos(time * 1.5) * 0.03;
                }
            }
        });
    }
    
    updateOtherPlayers() {
        // Update other players' positions smoothly at 60 FPS
        this.players.forEach((player, playerId) => {
            if (playerId !== this.socket.id && player.data.velocity) {
                // Apply velocity to position for smooth movement
                const velocity = new THREE.Vector3(
                    player.data.velocity[0] || 0,
                    player.data.velocity[1] || 0,
                    player.data.velocity[2] || 0
                );
                
                // Smooth interpolation
                const lerpFactor = 0.1;
                player.mesh.position.lerp(
                    new THREE.Vector3(
                        player.data.position.x + velocity.x * 0.016,
                        player.data.position.y + velocity.y * 0.016,
                        player.data.position.z + velocity.z * 0.016
                    ),
                    lerpFactor
                );
            }
        });
    }

    startTeamDeathmatch() {
        // Only leader can start deathmatch
        if (!this.teamData.isLeader) {
            alert('Only the team leader can start deathmatch!');
            return;
        }
        
        if (!this.socket || !this.socket.connected) {
            alert('Not connected to server!');
            return;
        }
        
        // Send team deathmatch start request
        this.socket.emit('startTeamDeathmatch', { 
            teamCode: this.teamData.teamCode 
        });
        
        // Show loading screen for leader too
        this.gameMode = 'loading';
        this.hideMainMenu();
        document.getElementById('loadingScreen').style.display = 'flex';
        document.getElementById('gameContainer').style.display = 'block';
        
        // Update loading message
        const loadingText = document.querySelector('#loadingScreen p');
        if (loadingText) {
            loadingText.textContent = 'Starting team deathmatch...';
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new KrunkerClone();
}); 