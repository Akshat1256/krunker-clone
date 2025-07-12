# Krunker Clone - FPS Game

A modern browser-based first-person shooter game inspired by Krunker.io, built with Three.js and Socket.IO. Features cross-platform support with mobile gyroscope controls, customizable HUD, and real-time multiplayer gameplay.

## 🎮 Features

### Core Gameplay
- **Real-time multiplayer FPS combat**
- **3D graphics powered by Three.js**
- **Physics-based projectile system**
- **Team-based gameplay (Red vs Blue)**
- **Health and ammo management**
- **Score tracking and statistics**

### Cross-Platform Support
- **Desktop**: Full mouse and keyboard controls
- **Mobile**: Touch controls with virtual joysticks
- **Responsive design** that adapts to any screen size
- **Progressive Web App** capabilities

### Mobile Features
- **Gyroscope motion controls** for precise aiming
- **Customizable gyroscope sensitivity**
- **Touch-optimized virtual joysticks**
- **Haptic feedback** (vibration) on mobile devices
- **Mobile-specific HUD layouts**

### Customization
- **Adjustable mouse sensitivity**
- **Customizable gyroscope sensitivity**
- **Field of View (FOV) settings**
- **Draggable and resizable HUD elements**
- **Multiple HUD layout presets**:
  - Default
  - Minimal
  - Professional
  - Custom

### Technical Features
- **WebRTC-based multiplayer** with Socket.IO
- **Client-side prediction** for smooth gameplay
- **Optimized rendering** for 60 FPS performance
- **Local storage** for settings persistence
- **Real-time collision detection**

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd krunker-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Quick Multiplayer Setup

**For same network (LAN):**
```bash
npm run ip          # Get your local IP address
npm start           # Start the server
# Share the URL with friends on same network
```

**For different networks:**
- **Windows:** Run `start-multiplayer.bat`
- **Mac/Linux:** Run `./start-multiplayer.sh`
- **Manual:** See [MULTIPLAYER_SETUP.md](MULTIPLAYER_SETUP.md) for detailed instructions

**Easy options for external access:**
- Use ngrok: `npm install -g ngrok && ngrok http 3000`
- Deploy to cloud: Heroku, Railway, or Render

### Development Mode
For development with hot reloading:
```bash
npm run dev
```

## 🎯 How to Play

### Desktop Controls
- **WASD**: Move
- **Mouse**: Look around
- **Left Click**: Shoot
- **Space**: Jump
- **Shift**: Crouch
- **Escape**: Open settings

### Mobile Controls
- **Left Virtual Stick**: Movement
- **Right Virtual Stick**: Look/Aim
- **Fire Button**: Shoot
- **Gyroscope**: Enable in settings for motion controls

### Game Objectives
- **Eliminate enemy players** to score points
- **Survive** as long as possible
- **Work with your team** (Red vs Blue)
- **Achieve the highest score**

## ⚙️ Settings & Customization

### Accessing Settings
- Press **Escape** on desktop
- Tap the settings icon on mobile

### Available Settings
- **Mouse Sensitivity**: Adjust mouse look sensitivity
- **Gyroscope Sensitivity**: Fine-tune motion controls
- **Field of View**: Change camera FOV (60°-120°)
- **HUD Layout**: Choose from preset layouts
- **Gyroscope Enable**: Toggle motion controls
- **Vibration**: Enable haptic feedback

### HUD Customization
- **Drag HUD elements** to reposition them
- **Choose preset layouts** for different playstyles
- **Reset layout** to default positions
- **Custom positioning** for advanced users

## 🏗️ Project Structure

```
krunker-clone/
├── src/
│   └── client/
│       ├── index.html          # Main HTML file
│       └── index.js            # Game engine and client logic
├── server.js                   # Express server and Socket.IO
├── webpack.config.js           # Webpack configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🛠️ Technology Stack

- **Frontend**:
  - Three.js (3D graphics)
  - Socket.IO Client (real-time communication)
  - HTML5 Canvas (rendering)
  - CSS3 (responsive design)

- **Backend**:
  - Node.js (server runtime)
  - Express.js (web server)
  - Socket.IO (real-time multiplayer)
  - JavaScript ES6+ (game logic)

- **Build Tools**:
  - Webpack (bundling)
  - npm (package management)

## 🌐 Browser Support

### Desktop Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Mobile Browsers
- iOS Safari 13+
- Chrome Mobile 80+
- Samsung Internet 10+
- Firefox Mobile 75+

## 📱 Mobile Features

### Gyroscope Controls
The game supports device gyroscope for precise aiming on mobile devices:

1. **Enable gyroscope** in settings
2. **Grant permission** when prompted
3. **Adjust sensitivity** to your preference
4. **Tilt device** to aim

### Touch Controls
- **Virtual joysticks** for movement and aiming
- **Touch-optimized buttons** for shooting
- **Responsive design** for all screen sizes
- **Haptic feedback** for enhanced experience

## 🔧 Development

### Adding New Features
1. **Client-side**: Modify `src/client/index.js`
2. **Server-side**: Update `server.js`
3. **UI changes**: Edit `src/client/index.html`

### Building for Production
```bash
npm run build
```

### Running Tests
```bash
npm test
```

## 🐛 Troubleshooting

### Common Issues

**Game won't start**
- Check if Node.js is installed
- Ensure all dependencies are installed (`npm install`)
- Verify port 3000 is available

**Mobile controls not working**
- Ensure HTTPS is enabled (required for gyroscope)
- Check device permissions
- Try refreshing the page

**Performance issues**
- Lower FOV setting
- Reduce graphics quality
- Close other browser tabs
- Check internet connection

**Multiplayer not working**
- Verify server is running
- Check firewall settings
- Ensure Socket.IO is properly loaded

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🎮 Future Features

- [ ] More weapon types
- [ ] Different game modes
- [ ] Custom maps
- [ ] Player skins
- [ ] Sound effects
- [ ] Particle effects
- [ ] Leaderboards
- [ ] Chat system

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

---

**Enjoy playing Krunker Clone!** 🎯 