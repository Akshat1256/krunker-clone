# Vercel Deployment Guide (FREE - 100GB Bandwidth!)

Vercel offers unlimited free hosting with 100GB bandwidth/month, but has WebSocket limitations for multiplayer games.

## ⚠️ Important Note

**Vercel has limited WebSocket support** which may affect multiplayer functionality. The game will work, but multiplayer might have issues. Consider Railway or Render for better multiplayer experience.

## 🚀 Quick Deploy to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Continue with GitHub"
3. Sign up with your GitHub account
4. Verify your email

### Step 2: Import Project
1. Click "New Project" in your Vercel dashboard
2. Click "Import Git Repository"
3. Select your `krunker-clone` repository
4. Click "Import"

### Step 3: Configure Project Settings
Vercel will auto-detect your project, but verify these settings:

- **Framework Preset:** `Node.js`
- **Root Directory:** `./` (leave empty)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

### Step 4: Environment Variables (Optional)
Add these in the Vercel dashboard:
```
NODE_ENV=production
PORT=3000
```

### Step 5: Deploy
1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Wait 2-3 minutes for deployment to complete
4. Get your URL: `https://krunker-clone.vercel.app`

## ✅ What Vercel Provides (FREE)

- **100GB bandwidth/month** (generous for gaming)
- **Unlimited deployments**
- **Automatic deployments** from GitHub
- **Custom domains** support
- **SSL certificates** included
- **Global CDN** for fast loading
- **No credit card required**

## ❌ Vercel Limitations

- **Limited WebSocket support** (may affect multiplayer)
- **Serverless functions** have timeout limits (30 seconds)
- **No persistent server** for real-time games
- **Cold starts** may cause delays

## 🔧 Vercel Configuration

### vercel.json (Already Created)
Your project now has a `vercel.json` file that optimizes the deployment:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "server.js": {
      "maxDuration": 30
    }
  }
}
```

## 🎮 After Deployment

### Test Your Game
1. **Open the Vercel URL** in your browser
2. **Test single-player mode** - should work perfectly
3. **Test multiplayer mode** - may have WebSocket issues
4. **Share URL with friends** for testing

### If Multiplayer Doesn't Work
If WebSockets don't work properly on Vercel:
1. **Deploy to Railway** (500h/month free, full WebSocket support)
2. **Deploy to Render** (750h/month free, full WebSocket support)
3. **Both have 100GB bandwidth** and no credit card required

## 🔍 Troubleshooting

### Deployment Fails
```bash
# Check Vercel logs in dashboard
# Common fixes:
1. Ensure all dependencies are in package.json
2. Verify build script works locally: npm run build
3. Check if server.js exists and is correct
4. Make sure vercel.json is in project root
```

### WebSocket Issues
- **Vercel limitation:** Serverless functions don't support persistent WebSocket connections
- **Solution:** Deploy to Railway or Render for full WebSocket support
- **Alternative:** Use Vercel for frontend + external WebSocket service

### Game Doesn't Load
- Check browser console for errors
- Verify all static files are being served
- Check Vercel function logs in dashboard

## 💡 Pro Tips

1. **Auto-deploy:** Every push to GitHub triggers a new deployment
2. **Custom domains:** Add your own domain in Vercel settings
3. **Performance:** Vercel's global CDN provides fast loading
4. **Monitoring:** Check Vercel dashboard for usage and performance
5. **Rollback:** Easy to rollback to previous deployments

## 📊 Vercel vs Other Options

| Platform | Free Bandwidth | WebSockets | Multiplayer | Setup Time | Credit Card |
|----------|----------------|------------|-------------|------------|-------------|
| Vercel   | 100GB/month | ❌ Limited | ⚠️ Limited  | 2 min | ❌ No |
| Railway  | 100GB/month | ✅ Full    | ✅ Full     | 2 min | ❌ No |
| Render   | 100GB/month | ✅ Full    | ✅ Full     | 3 min | ❌ No |

## 🚀 Alternative Deployment Options

If Vercel doesn't work well for multiplayer:

### Railway (Recommended)
- **100GB bandwidth/month**
- **Full WebSocket support**
- **500 hours/month free**
- **No credit card required**

### Render (Alternative)
- **100GB bandwidth/month**
- **Full WebSocket support**
- **750 hours/month free**
- **No credit card required**

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **Community:** https://github.com/vercel/vercel/discussions
- **Discord:** https://discord.gg/vercel

## 🎯 Final Recommendation

**For your Krunker clone:**

1. **Try Vercel first** - 100GB bandwidth, easy setup, no credit card
2. **Test multiplayer functionality** thoroughly
3. **If WebSockets don't work** - migrate to Railway or Render
4. **Both alternatives** offer full WebSocket support and 100GB bandwidth

## 🚀 Ready to Deploy?

Your game will have:
- **100GB bandwidth/month** for gaming sessions
- **Global CDN** for fast loading worldwide
- **Automatic deployments** from GitHub
- **SSL certificate** included
- **No credit card required**

Happy gaming on Vercel! 🎮 