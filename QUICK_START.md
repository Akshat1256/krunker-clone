# Quick Start - Multiplayer Setup

## 🚀 Get Playing in 3 Steps

### Step 1: Start the Server
```bash
# Windows
start-multiplayer.bat

# Mac/Linux
./start-multiplayer.sh

# Or manually
npm run ip
npm start
```

### Step 2: Share Your URL
The server will show you a URL like:
- **Same network:** `http://192.168.1.100:3000`
- **Different networks:** You'll need to set up port forwarding or use ngrok

### Step 3: Friends Join
Friends open the URL in their browser and can start playing immediately!

## 🌐 For Different Internet Connections

### Option A: ngrok (Easiest)
```bash
npm install -g ngrok
npm start
# In another terminal:
ngrok http 3000
# Share the ngrok URL (e.g., https://abc123.ngrok.io)
```

### Option B: Port Forwarding
1. Find your router's admin panel (usually `192.168.1.1`)
2. Set up port forwarding: External Port 3000 → Internal Port 3000
3. Find your public IP at `whatismyipaddress.com`
4. Share: `http://YOUR_PUBLIC_IP:3000`

### Option C: Cloud Deployment
- **Heroku:** `heroku create && git push heroku main`
- **Railway:** Connect GitHub repo, auto-deploys
- **Render:** Connect GitHub repo, auto-deploys

## 🎮 Game Controls

### Desktop
- **WASD:** Move
- **Mouse:** Look
- **Left Click:** Shoot
- **Space:** Jump
- **Escape:** Settings

### Mobile
- **Left Stick:** Move
- **Right Stick:** Look
- **Fire Button:** Shoot
- **Gyroscope:** Enable in settings

## 🔧 Troubleshooting

**Can't connect?**
- Check if server is running
- Verify the URL is correct
- Try ngrok for testing

**High latency?**
- Use a server closer to players
- Check internet connection
- Consider cloud deployment

**Firewall issues?**
- Allow Node.js through firewall
- Check port 3000 is open

## 📞 Need Help?

See [MULTIPLAYER_SETUP.md](MULTIPLAYER_SETUP.md) for detailed instructions.

Happy gaming! 🎯 