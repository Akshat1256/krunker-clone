# Multiplayer Setup Guide

This guide will help you set up the Krunker Clone for multiplayer gameplay across different internet connections.

## Quick Start (Same Network)

If you're on the same WiFi/LAN network:

1. **Host Setup:**
   ```bash
   npm install
   npm run ip          # Get your local IP address
   npm start           # Start the server
   ```

2. **Share the URL:**
   - The `npm run ip` command will show you a URL like `http://192.168.1.100:3000`
   - Share this URL with your friends on the same network

3. **Friends Connect:**
   - Friends open the shared URL in their browser
   - They can now join and play together!

## External Network Setup (Different Internet Connections)

### Option 1: Port Forwarding (Recommended)

1. **Find Your Router's Admin Panel:**
   - Usually `http://192.168.1.1` or `http://192.168.0.1`
   - Check your router's manual for the correct address

2. **Set Up Port Forwarding:**
   - Go to "Port Forwarding" or "Virtual Server" section
   - Add a new rule:
     - **External Port:** 3000
     - **Internal Port:** 3000
     - **Protocol:** TCP
     - **Internal IP:** Your computer's local IP (from `npm run ip`)
     - **Description:** Krunker Clone

3. **Find Your Public IP:**
   - Visit `https://whatismyipaddress.com/`
   - Note your public IP address

4. **Start the Server:**
   ```bash
   npm start
   ```

5. **Share the Public URL:**
   - Share `http://YOUR_PUBLIC_IP:3000` with friends
   - Example: `http://203.45.67.89:3000`

### Option 2: Using ngrok (Easy Alternative)

1. **Install ngrok:**
   - Download from https://ngrok.com/
   - Or install via npm: `npm install -g ngrok`

2. **Start the Game Server:**
   ```bash
   npm start
   ```

3. **Create ngrok Tunnel:**
   ```bash
   ngrok http 3000
   ```

4. **Share the ngrok URL:**
   - ngrok will give you a URL like `https://abc123.ngrok.io`
   - Share this URL with your friends

### Option 3: Using a Cloud Service

1. **Deploy to Heroku:**
   ```bash
   # Install Heroku CLI
   heroku create your-krunker-clone
   git add .
   git commit -m "Deploy multiplayer game"
   git push heroku main
   ```

2. **Deploy to Railway:**
   - Connect your GitHub repo to Railway
   - Railway will automatically deploy and give you a public URL

3. **Deploy to Render:**
   - Connect your GitHub repo to Render
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`

## Troubleshooting

### Firewall Issues
- **Windows:** Allow Node.js through Windows Firewall
- **Mac:** Allow incoming connections in System Preferences > Security & Privacy
- **Linux:** Use `sudo ufw allow 3000`

### Connection Refused
- Make sure the server is running (`npm start`)
- Check if port 3000 is available
- Try a different port: `PORT=3001 npm start`

### High Latency
- Use a server closer to all players
- Consider using a cloud service for better global performance
- Check your internet connection speed

### Players Can't Join
- Verify the URL is correct
- Check if port forwarding is set up correctly
- Try using ngrok for testing

## Security Considerations

⚠️ **Important:** When exposing your server to the internet:

1. **Use HTTPS** when possible (especially with ngrok)
2. **Limit access** to trusted friends only
3. **Monitor connections** for suspicious activity
4. **Consider rate limiting** for public servers
5. **Keep your system updated**

## Advanced Configuration

### Custom Port
```bash
PORT=8080 npm start
```

### Environment Variables
Create a `.env` file:
```
PORT=3000
NODE_ENV=production
MAX_PLAYERS=20
```

### Load Balancing
For multiple servers, use a load balancer like nginx:
```nginx
upstream krunker_servers {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    location / {
        proxy_pass http://krunker_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all dependencies are installed (`npm install`)
3. Ensure the server is running without errors
4. Test with a simple ping to verify connectivity

Happy gaming! 🎮 