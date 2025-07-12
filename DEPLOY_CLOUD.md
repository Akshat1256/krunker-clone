# Cloud Deployment Guide

Deploy your Krunker Clone to the cloud for public multiplayer access!

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended - Free)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   ```bash
   # Push your code to GitHub first
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Connect to Railway**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your krunker-clone repository
   - Railway will auto-detect Node.js and deploy

4. **Get Public URL**
   - Railway gives you a public URL like `https://krunker-clone-production.up.railway.app`
   - Share this URL with anyone!

### Option 2: Render (Free Tier)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`
   - Choose free plan

3. **Deploy**
   - Render will build and deploy automatically
   - Get public URL like `https://krunker-clone.onrender.com`

### Option 3: Heroku (Free Tier Discontinued)

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy**
   ```bash
   heroku login
   heroku create your-krunker-clone
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

3. **Get URL**
   - Heroku gives you `https://your-krunker-clone.herokuapp.com`

### Option 4: Vercel (Free)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy**
   - Import your GitHub repository
   - Vercel will auto-detect and deploy
   - Get URL like `https://krunker-clone.vercel.app`

## 🔧 Required Files for Deployment

Make sure these files exist in your project:

### package.json (Already exists)
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "webpack --mode production"
  }
}
```

### Procfile (for Heroku)
Create `Procfile` in your project root:
```
web: npm start
```

### Environment Variables
Some platforms may need:
```
PORT=3000
NODE_ENV=production
```

## 📊 Platform Comparison

| Platform | Free Tier | Auto-Deploy | Custom Domain | SSL |
|----------|-----------|-------------|---------------|-----|
| Railway  | ✅ Yes    | ✅ Yes      | ✅ Yes        | ✅  |
| Render   | ✅ Yes    | ✅ Yes      | ✅ Yes        | ✅  |
| Vercel   | ✅ Yes    | ✅ Yes      | ✅ Yes        | ✅  |
| Heroku   | ❌ No     | ✅ Yes      | ✅ Yes        | ✅  |

## 🎮 After Deployment

1. **Test the game** on the public URL
2. **Share the URL** with friends
3. **Monitor performance** in the platform dashboard
4. **Set up custom domain** if needed

## 🔒 Security Notes

- Cloud deployments are public - anyone can join
- Consider adding basic authentication for private games
- Monitor server logs for unusual activity
- Keep dependencies updated

## 💰 Cost Considerations

- **Free tiers** are usually sufficient for small groups
- **Paid plans** offer better performance and features
- **Traffic limits** may apply on free tiers

## 🆘 Troubleshooting

**Deployment fails:**
- Check build logs in platform dashboard
- Ensure all dependencies are in package.json
- Verify start script works locally

**Game doesn't work:**
- Check if WebSocket connections are allowed
- Verify port configuration
- Test locally first

**High latency:**
- Choose server location closer to players
- Consider paid plans for better performance

Happy deploying! 🚀 