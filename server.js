const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});



// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Serve the main HTML file for all routes (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Game state
const gameState = {
  players: new Map(),
  projectiles: new Map(),
  teams: new Map(),
  targetBoards: [], // Removed all target boards
  world: {
    width: 1000,
    height: 1000,
    gravity: -9.8
  }
};

// Helper for random bot name
function randomBotName() {
  const names = ['BotA', 'BotB', 'BotC', 'BotD', 'BotE', 'BotF', 'BotG', 'BotH'];
  return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000);
}

// Helper for random position
function randomBotPosition() {
  return {
    x: Math.random() * 400 - 200,
    y: 1.8,
    z: Math.random() * 400 - 200
  };
}

// Helper for random direction
function randomDirection() {
  const angle = Math.random() * Math.PI * 2;
  return { x: Math.cos(angle), y: 0, z: Math.sin(angle) };
}

// Store bot intervals for cleanup
const botIntervals = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  // Player joins
  socket.on('playerJoin', (playerData) => {
    // Check if player is already in the game
    if (gameState.players.has(socket.id)) {
      return;
    }
    
    let team = Math.floor(Math.random() * 2); // 0 = Blue, 1 = Red
    let spawnPosition;
    let initialRotation;
    
    // Handle team deathmatch spawning
    if (playerData.gameMode === 'teamDeathmatch' && playerData.teamCode) {
      const teamData = gameState.teams.get(playerData.teamCode);
      if (teamData) {
        
        // Create a list of all team members including leader (remove duplicates)
        const allMembers = [teamData.leader];
        teamData.members.forEach(member => {
          if (!allMembers.includes(member.id)) {
            allMembers.push(member.id);
          }
        });
        
        const memberIndex = allMembers.indexOf(socket.id);
        
        // Assign team based on member index (even = team 0, odd = team 1)
        if (memberIndex % 2 === 0) {
          team = 0;
        } else {
          team = 1;
        }
      }
    }
    
    if (team === 0) {
      // Blue team spawns at blue base (north) - camera faces south towards enemy
      spawnPosition = { 
        x: Math.random() * 60 - 30, 
        y: 10, 
        z: Math.random() * 60 - 30 - 200 
      };
      initialRotation = { x: 0, y: Math.PI, z: 0 }; // Face south (towards red team)
    } else {
      // Red team spawns at red base (south) - camera faces north towards enemy
      spawnPosition = { 
        x: Math.random() * 60 - 30, 
        y: 10, 
        z: Math.random() * 60 - 30 + 200 
      };
      initialRotation = { x: 0, y: 0, z: 0 }; // Face north (towards blue team)
    }
    
    const player = {
      id: socket.id,
      name: playerData.name || `Player${socket.id.slice(0, 4)}`,
      position: spawnPosition,
      rotation: initialRotation,
      velocity: { x: 0, y: 0, z: 0 },
      health: 100,
      score: 0,
      team: team,
      lastUpdate: Date.now()
    };

    gameState.players.set(socket.id, player);
    
    // --- BOT LOGIC: Enable for all modes (including team deathmatch) ---
    // Spawn 3 bots (reduced from 5 for better performance)
    for (let i = 0; i < 3; i++) {
      const botId = `bot_${socket.id}_${i}`;
      const bot = {
        id: botId,
        name: randomBotName(),
        position: randomBotPosition(),
        rotation: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        health: 100,
        score: 0,
        team: 1, // All bots are on team 1 (enemy)
        isBot: true,
        lastUpdate: Date.now()
      };
      gameState.players.set(botId, bot);

      // Bot AI loop: move and shoot at player
      const interval = setInterval(() => {
        const player = gameState.players.get(socket.id);
        const bot = gameState.players.get(botId);
        if (!player || !bot) return;

        // Move bot randomly
        if (Math.random() < 0.1) {
          // Pick a new random direction
          bot._moveDir = randomDirection();
        }
        if (!bot._moveDir) bot._moveDir = randomDirection();
        
        // Calculate new position
        const newX = bot.position.x + bot._moveDir.x * 0.375; // 10% of previous speed (3.75 * 0.1)
        const newZ = bot.position.z + bot._moveDir.z * 0.375;
        
        // Map boundary collision detection (500x500 map, boundaries at ±250)
        const mapBoundary = 250;
        bot.position.x = Math.max(-mapBoundary, Math.min(mapBoundary, newX));
        bot.position.z = Math.max(-mapBoundary, Math.min(mapBoundary, newZ));

        // Aim at player
        const dx = player.position.x - bot.position.x;
        const dz = player.position.z - bot.position.z;
        bot.rotation.y = Math.atan2(dx, dz);

        // Shoot at player every 0.5s, but only if within 30 units
        const now = Date.now();
        if (!bot._lastShot || now - bot._lastShot > 500) {
          // Calculate distance to player
          const distanceToPlayer = Math.sqrt(dx*dx + dz*dz);
          
          // Only shoot if within 30 units
          if (distanceToPlayer <= 30) {
            bot._lastShot = now;
            // Shoot a bullet toward the player
            const dirLen = Math.sqrt(dx*dx + dz*dz);
            const dir = { x: dx/dirLen, y: 0, z: dz/dirLen };
            const projectileId = `${botId}-${Date.now()}`;
            const projectile = {
              id: projectileId,
              playerId: botId,
              position: { x: bot.position.x, y: bot.position.y, z: bot.position.z },
              direction: dir,
              velocity: { x: dir.x * 200, y: 0, z: dir.z * 200 },
              damage: 25,
              createdAt: Date.now()
            };
            gameState.projectiles.set(projectileId, projectile);
            io.emit('projectileCreated', projectile);
            setTimeout(() => {
              gameState.projectiles.delete(projectileId);
              io.emit('projectileDestroyed', projectileId);
            }, 5000);
          }
        }
      }, 100); // Reduced from 50ms to 100ms (10 FPS instead of 20 FPS)
      botIntervals.set(botId, interval);
    }
    // --- END BOT LOGIC ---
    
    // Send current game state to new player
    socket.emit('gameState', {
      players: Array.from(gameState.players.values()),
      projectiles: Array.from(gameState.projectiles.values()),
      targetBoards: Array.from(gameState.targetBoards.values()),
      world: gameState.world
    });

    // Notify other players
    socket.broadcast.emit('playerJoined', player);
  });

  // Player movement
  socket.on('playerMove', (movementData) => {
    const player = gameState.players.get(socket.id);
    if (player) {
      // Defensive: Convert array to object if needed, and validate
      function toVec3(obj) {
        if (Array.isArray(obj) && obj.length === 3) {
          // If any value is null or not a number, fallback to previous
          if (obj.some(v => v === null || typeof v !== 'number' || isNaN(v))) {
            return player.position; // fallback to previous
          }
          return { x: obj[0], y: obj[1], z: obj[2] };
        } else if (typeof obj === 'object' && obj !== null && 'x' in obj && 'y' in obj && 'z' in obj) {
          // If any value is null or not a number, fallback to previous
          if ([obj.x, obj.y, obj.z].some(v => v === null || typeof v !== 'number' || isNaN(v))) {
            return player.position; // fallback to previous
          }
          return { x: obj.x, y: obj.y, z: obj.z };
        } else {
          return player.position; // fallback to previous
        }
      }
      
      let newPosition = toVec3(movementData.position);
      
      // Server-side map boundary validation (500x500 map, boundaries at ±250)
      const mapBoundary = 250;
      newPosition.x = Math.max(-mapBoundary, Math.min(mapBoundary, newPosition.x));
      newPosition.z = Math.max(-mapBoundary, Math.min(mapBoundary, newPosition.z));
      
      // Ground level validation
      if (newPosition.y < 1.8) {
        newPosition.y = 1.8;
      }
      
      player.position = newPosition;
      player.rotation = movementData.rotation;
      player.velocity = toVec3(movementData.velocity);
      player.lastUpdate = Date.now();
      
      // Broadcast to all other players
      socket.broadcast.emit('playerMoved', {
        id: socket.id,
        position: player.position,
        rotation: player.rotation,
        velocity: player.velocity
      });
      
    }
  });

  // Player shoots
  socket.on('playerShoot', (shootData) => {
    const player = gameState.players.get(socket.id);
    if (player) {
      // Bullet cap: If too many projectiles, ignore new ones
      if (gameState.projectiles.size > 100) return; // Reduced from 200 to 100
      const projectileId = `${socket.id}-${Date.now()}`;
      const projectile = {
        id: projectileId,
        playerId: socket.id,
        position: shootData.position,
        direction: shootData.direction,
        velocity: shootData.velocity,
        damage: 25,
        createdAt: Date.now()
      };
      gameState.projectiles.set(projectileId, projectile);
      io.emit('projectileCreated', projectile);
      setTimeout(() => {
        gameState.projectiles.delete(projectileId);
        io.emit('projectileDestroyed', projectileId);
      }, 5000);
    }
  });

  // Player hit
  socket.on('playerHit', (hitData) => {
    const targetPlayer = gameState.players.get(hitData.targetId);
    const shooter = gameState.players.get(socket.id);
    
    if (targetPlayer && shooter) {
      targetPlayer.health -= hitData.damage;
      shooter.score += 10;
      
      if (targetPlayer.health <= 0) {
        if (targetPlayer.isBot) {
          // Respawn bot after 2s
          setTimeout(() => {
            targetPlayer.position = randomBotPosition();
            targetPlayer.health = 100;
          }, 2000);
        } else {
        targetPlayer.health = 100;
          // Respawn at team base
          if (targetPlayer.team === 0) {
            targetPlayer.position = { 
              x: Math.random() * 60 - 30, 
              y: 10, 
              z: Math.random() * 60 - 30 - 200 
            };
            targetPlayer.rotation = { x: 0, y: Math.PI, z: 0 }; // Face south (towards red team)
          } else {
            targetPlayer.position = { 
              x: Math.random() * 60 - 30, 
              y: 10, 
              z: Math.random() * 60 - 30 + 200 
            };
            targetPlayer.rotation = { x: 0, y: 0, z: 0 }; // Face north (towards blue team)
          }
        shooter.score += 50; // Kill bonus
        }
      }
      
      io.emit('playerHit', {
        targetId: hitData.targetId,
        shooterId: socket.id,
        damage: hitData.damage,
        targetHealth: targetPlayer.health,
        shooterScore: shooter.score
      });
    }
  });

  // Team management
  socket.on('createTeam', (data) => {
    const teamCode = data.teamCode;
    const team = {
      code: teamCode,
      leader: socket.id,
      members: [{
        id: socket.id,
        name: `Player${socket.id.slice(0, 4)}`
      }],
      createdAt: Date.now()
    };
    
    gameState.teams.set(teamCode, team);
    socket.emit('teamCreated', { teamCode });
  });

  socket.on('joinTeam', (data) => {
    const teamCode = data.teamCode;
    const team = gameState.teams.get(teamCode);
    
    if (!team) {
      socket.emit('teamError', { message: 'Team not found' });
      return;
    }
    
    if (team.members.length >= 5) {
      socket.emit('teamError', { message: 'Team is full' });
      return;
    }
    
    const newMember = {
      id: socket.id,
      name: `Player${socket.id.slice(0, 4)}`
    };
    
    team.members.push(newMember);
    
    // Notify all team members
    team.members.forEach(member => {
      const memberSocket = io.sockets.sockets.get(member.id);
      if (memberSocket) {
        memberSocket.emit('teamMemberJoined', { member: newMember });
      }
    });
    
    socket.emit('teamJoined', { 
      teamCode, 
      members: team.members,
      isLeader: false,
      leaderId: team.leader
    });
  });

  // Team deathmatch start
  socket.on('startTeamDeathmatch', (data) => {
    const teamCode = data.teamCode;
    const team = gameState.teams.get(teamCode);
    
    if (!team) {
      socket.emit('teamError', { message: 'Team not found' });
      return;
    }
    
    // Check if the requester is the team leader
    if (team.leader !== socket.id) {
      socket.emit('teamError', { message: 'Only team leader can start deathmatch' });
      return;
    }
    
    // Notify ALL team members (including leader) to start deathmatch
    const allMembers = [team.leader, ...team.members.map(m => m.id)];
    allMembers.forEach(memberId => {
      const memberSocket = io.sockets.sockets.get(memberId);
      if (memberSocket) {
        memberSocket.emit('teamDeathmatchStarted', { teamCode });
      }
    });
  });



  // Ping for latency measurement
  socket.on('ping', () => {
    socket.emit('pong');
  });

  // Player disconnects
  socket.on('disconnect', () => {
    gameState.players.delete(socket.id);
    
    // Remove from teams
    gameState.teams.forEach((team, teamCode) => {
      const memberIndex = team.members.findIndex(m => m.id === socket.id);
      if (memberIndex !== -1) {
        team.members.splice(memberIndex, 1);
        
        // Notify remaining team members
        team.members.forEach(member => {
          const memberSocket = io.sockets.sockets.get(member.id);
          if (memberSocket) {
            memberSocket.emit('teamMemberLeft', { memberId: socket.id });
          }
        });
        
        // Delete team if empty
        if (team.members.length === 0) {
          gameState.teams.delete(teamCode);
        }
      }
    });
    
    // Remove bots and intervals for this player
    for (let [botId, interval] of botIntervals.entries()) {
      if (botId.startsWith(`bot_${socket.id}_`)) {
        clearInterval(interval);
        botIntervals.delete(botId);
        gameState.players.delete(botId);
      }
    }

    socket.broadcast.emit('playerLeft', socket.id);
  });
});

// Game loop for physics and cleanup
setInterval(() => {
  // Broadcast game state to all players every 100ms (10 FPS for state updates)
  io.emit('gameState', {
    players: Array.from(gameState.players.values()),
    projectiles: Array.from(gameState.projectiles.values()),
    targetBoards: Array.from(gameState.targetBoards.values())
  });
  
  // Update projectile positions
  gameState.projectiles.forEach((projectile, id) => {
    // Increased velocity multiplier for faster bullet travel (adjusted for 30 FPS)
    projectile.position.x += projectile.velocity.x * 0.033 * 3; // 300% faster, 30 FPS
    projectile.position.y += projectile.velocity.y * 0.033 * 3;
    projectile.position.z += projectile.velocity.z * 0.033 * 3;
    
    // Check for collisions with players
    gameState.players.forEach((player, playerId) => {
      if (playerId !== projectile.playerId) {
        const distance = Math.sqrt(
          Math.pow(projectile.position.x - player.position.x, 2) +
          Math.pow(projectile.position.y - player.position.y, 2) +
          Math.pow(projectile.position.z - player.position.z, 2)
        );
        
        if (distance < 5) { // Increased hit detection radius from 2 to 5
          gameState.projectiles.delete(id);
          io.emit('projectileDestroyed', id);
          
          // Handle hit
          player.health -= projectile.damage;
          const shooter = gameState.players.get(projectile.playerId);
          if (shooter) shooter.score += 10;
          
          if (player.health <= 0) {
            player.health = 100;
            // Respawn at team base
            if (player.team === 0) {
              player.position = { 
                x: Math.random() * 60 - 30, 
                y: 10, 
                z: Math.random() * 60 - 30 - 200 
              };
            } else {
              player.position = { 
                x: Math.random() * 60 - 30, 
                y: 10, 
                z: Math.random() * 60 - 30 + 200 
              };
            }
            if (shooter) shooter.score += 50;
          }
          
          io.emit('playerHit', {
            targetId: playerId,
            shooterId: projectile.playerId,
            damage: projectile.damage,
            targetHealth: player.health,
            shooterScore: shooter ? shooter.score : 0
          });
        }
      }
    });
    
    // Remove projectiles that are too old or out of bounds
    // Extended bullet travel distance to map boundaries (500/2 = 250 each direction)
    if (Date.now() - projectile.createdAt > 5000 || // Changed back to 5 seconds
        Math.abs(projectile.position.x) > 250 || // Updated to match map boundaries
        Math.abs(projectile.position.z) > 250 || // Updated to match map boundaries
        projectile.position.y > 100 || // Max height
        projectile.position.y < -50) { // Min height (underground)
      gameState.projectiles.delete(id);
      io.emit('projectileDestroyed', id);
    }
  });
}, 100); // Reduced from 50ms to 100ms (10 FPS instead of 20 FPS)

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Krunker Clone server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Network: http://0.0.0.0:${PORT}`);
  console.log(`To play with others, share your IP address and port ${PORT}`);
}); 