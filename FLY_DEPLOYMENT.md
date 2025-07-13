# Fly.io Deployment Guide (FREE - 160GB Bandwidth!)

Fly.io offers the best free hosting for multiplayer games with **160GB bandwidth/month** and unlimited hours!

## 🚀 Quick Deploy to Fly.io

### Step 1: Install Fly CLI

**Windows:**
```bash
# Download from https://fly.io/docs/hands-on/install-flyctl/
# Or use PowerShell:
iwr https://fly.io/install.ps1 -useb | iex
```

**Mac:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Sign Up and Login

1. Go to [fly.io](https://fly.io)
2. Sign up with your GitHub account
3. Login via CLI:
```bash
fly auth login
```

### Step 3: Deploy Your App

1. **Navigate to your project directory:**
```bash
cd /path/to/your/krunker-clone
```

2. **Launch your app:**
```bash
fly launch
```

3. **Follow the prompts:**
- **App name:** `krunker-clone` (or your preferred name)
- **Region:** Choose closest to your players
- **Deploy existing app:** Yes
- **Overwrite Dockerfile:** No (we'll create one)

### Step 4: Create Dockerfile

Create a `Dockerfile` in your project root:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
```

### Step 5: Deploy

```bash
fly deploy
```

### Step 6: Get Your URL

After deployment, get your URL:
```bash
fly open
# Or check with:
fly status
```

Your app will be available at: `https://krunker-clone.fly.dev`

## ✅ What Fly.io Provides (FREE)

- **160GB bandwidth/month** (MASSIVE for gaming!)
- **3 shared-cpu VMs** (unlimited hours)
- **3GB persistent volume storage**
- **Automatic deployments** from GitHub
- **Custom domains** support
- **SSL certificates** included
- **WebSocket support** (perfect for multiplayer)
- **No credit card required**

## 🔧 Fly.io Configuration

### fly.toml (Auto-generated)
Fly.io creates a `fly.toml` file. Make sure it looks like this:
```toml
app = "krunker-clone"
primary_region = "iad"  # Change to your preferred region

[build]

[env]
  PORT = "3000"
  NODE_ENV = "production"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[http_service.checks]]
  grace_period = "10s"
  interval = "30s"
  method = "GET"
  timeout = "5s"
  path = "/"
```

### Environment Variables
Set in Fly.io dashboard or via CLI:
```bash
fly secrets set NODE_ENV=production
fly secrets set PORT=3000
```

## 📊 Performance

**Free Plan Limits:**
- **160GB bandwidth/month** (excellent for multiplayer)
- **3 shared-cpu VMs** (unlimited hours)
- **3GB persistent volume storage**
- **Global edge locations** for low latency

**Performance Tips:**
- Choose region closest to your players
- Use CDN for static assets if needed
- Monitor bandwidth usage in dashboard

## 🎮 After Deployment

1. **Test your game** on the Fly.io URL
2. **Share with friends** - they can join from anywhere!
3. **Monitor usage** in Fly.io dashboard
4. **Set up custom domain** if needed

## 🔍 Troubleshooting

**Deployment fails:**
```bash
# Check logs
fly logs

# Check status
fly status

# Common fixes:
# 1. Ensure Dockerfile is correct
# 2. Check if all dependencies are in package.json
# 3. Verify build script works locally
```

**Game doesn't work:**
- Fly.io supports WebSockets
- Check if port configuration is correct
- Verify all files are committed to GitHub

**High latency:**
- Choose region closer to players
- Use Fly.io's global edge network
- Monitor performance in dashboard

## 💡 Pro Tips

1. **Auto-deploy:** Connect GitHub for automatic deployments
2. **Custom domains:** Add your own domain in Fly.io settings
3. **Monitoring:** View logs and metrics in Fly.io dashboard
4. **Scaling:** Upgrade to paid plan for more resources

## 🚀 GitHub Integration

For automatic deployments:

1. **Connect GitHub:**
```bash
fly deploy --remote-only
```

2. **Set up GitHub Actions** (optional):
Create `.github/workflows/fly.yml`:
```yaml
name: Deploy to Fly.io
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

## 📊 Fly.io vs Other Options

| Platform | Free Bandwidth | Free Hours | WebSockets | Setup Time |
|----------|----------------|------------|------------|------------|
| Fly.io   | 160GB/month | Unlimited | ✅ Full | 5 min |
| Railway  | 100GB/month | 500/month | ✅ Full | 2 min |
| Render   | 100GB/month | 750/month | ✅ Full | 3 min |
| Vercel   | 100GB/month | Unlimited | ❌ Limited | 2 min |

## 🆘 Need Help?

- **Fly.io Docs:** https://fly.io/docs/
- **Fly.io Discord:** https://discord.gg/flyio
- **Community:** https://community.fly.io/

## 🎯 Why Fly.io is Best for Multiplayer

1. **160GB bandwidth/month** - Perfect for multiplayer games
2. **Unlimited hours** - No sleep/wake issues
3. **Global edge network** - Low latency worldwide
4. **Full WebSocket support** - Real-time multiplayer works perfectly
5. **No credit card required** - Completely free

## 🚀 Ready to Deploy?

Your Krunker clone will have:
- **160GB bandwidth** for unlimited multiplayer sessions
- **Global edge locations** for low latency
- **Full WebSocket support** for real-time gameplay
- **Automatic deployments** from GitHub

Happy gaming on Fly.io! 🎮 