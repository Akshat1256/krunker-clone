# Heroku Deployment Guide

Deploy your Krunker Clone to Heroku for online multiplayer gaming!

## 🚀 Step-by-Step Deployment

### Step 1: Install Heroku CLI

**Windows:**
1. Download from: https://devcenter.heroku.com/articles/heroku-cli
2. Run the installer
3. Restart your command prompt

**Mac:**
```bash
brew tap heroku/brew && brew install heroku
```

**Linux:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

### Step 2: Login to Heroku

```bash
heroku login
```
This will open your browser to log in to your Heroku account.

### Step 3: Create Heroku App

```bash
# Create a new Heroku app
heroku create your-krunker-clone-name

# Or let Heroku generate a name
heroku create
```

### Step 4: Deploy to Heroku

```bash
# Add all files to git
git add .

# Commit changes
git commit -m "Deploy to Heroku"

# Push to Heroku
git push heroku main
```

### Step 5: Open Your App

```bash
# Open the app in your browser
heroku open

# Or get the URL
heroku info
```

## 📁 Required Files (Already Created)

Your project now has all the required files:

- ✅ `Procfile` - Tells Heroku how to start the app
- ✅ `app.json` - App configuration for Heroku
- ✅ `package.json` - Dependencies and scripts
- ✅ `.gitignore` - Excludes unnecessary files
- ✅ `server.js` - Updated for Heroku compatibility

## 🔧 Manual Deployment (Alternative)

If you prefer not to use Heroku CLI:

### Option A: GitHub Integration
1. Push your code to GitHub
2. Go to [Heroku Dashboard](https://dashboard.heroku.com/)
3. Click "New" → "Create new app"
4. Choose "Deploy from GitHub"
5. Connect your repository
6. Click "Deploy Branch"

### Option B: Heroku Button
Add this to your README.md:
```markdown
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/yourusername/krunker-clone)
```

## 🌐 After Deployment

### Get Your Public URL
Your app will be available at:
```
https://your-app-name.herokuapp.com
```

### Share with Friends
- Share the URL with anyone
- They can join from anywhere in the world
- No need for port forwarding or ngrok

## 🔍 Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Check build logs
heroku logs --tail

# Common fixes:
# 1. Make sure all dependencies are in package.json
# 2. Check if build script works locally
# 3. Verify Node.js version compatibility
```

**App Won't Start:**
```bash
# Check runtime logs
heroku logs --tail

# Common issues:
# 1. Port configuration (Heroku sets PORT automatically)
# 2. Missing dependencies
# 3. Build errors
```

**WebSocket Issues:**
- Heroku supports WebSockets
- Make sure you're using the correct port: `process.env.PORT`

### Performance Issues

**App Sleeps:**
- Free Heroku apps sleep after 30 minutes of inactivity
- First request after sleep takes 10-30 seconds
- Consider upgrading to paid plan for always-on

**High Latency:**
- Choose a region closer to your players
- Consider using a CDN for static assets

## 💰 Heroku Plans

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | Sleeps after 30min, limited dynos |
| Basic | $7/month | Always on, 1 dyno |
| Standard | $25/month | Multiple dynos, better performance |
| Performance | $250/month | Dedicated resources |

## 🔒 Security Notes

- Your app will be public on the internet
- Anyone with the URL can join
- Consider adding authentication for private games
- Monitor logs for unusual activity

## 📊 Monitoring

```bash
# View real-time logs
heroku logs --tail

# Check app status
heroku ps

# Monitor performance
heroku addons:open papertrail
```

## 🎮 Testing Your Deployment

1. **Test locally first:**
   ```bash
   npm start
   # Open http://localhost:3000
   ```

2. **Deploy to Heroku:**
   ```bash
   git push heroku main
   ```

3. **Test online:**
   ```bash
   heroku open
   ```

4. **Share with friends:**
   - Send them the Heroku URL
   - They can join immediately!

## 🆘 Need Help?

- **Heroku Documentation:** https://devcenter.heroku.com/
- **Heroku Support:** https://help.heroku.com/
- **Community:** https://stackoverflow.com/questions/tagged/heroku

Happy gaming online! 🎯 