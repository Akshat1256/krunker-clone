# Vercel Deployment Guide (FREE)

Vercel offers unlimited free hosting, but has WebSocket limitations for multiplayer games.

## ⚠️ Important Note

**Vercel has limited WebSocket support** which may affect multiplayer functionality. Consider Railway or Render for better multiplayer experience.

## 🚀 Quick Deploy to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Verify your email

### Step 2: Import Project
1. Click "New Project"
2. Import your GitHub repository
3. Select your `krunker-clone` repo

### Step 3: Configure Project
- **Framework Preset:** `Node.js`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Deploy
1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Get your URL: `https://krunker-clone.vercel.app`

## ✅ What Vercel Provides (FREE)

- **Unlimited deployments**
- **Automatic deployments** from GitHub
- **Custom domains** support
- **SSL certificates** included
- **Global CDN** for fast loading
- **No credit card required**

## ❌ Vercel Limitations

- **Limited WebSocket support** (may affect multiplayer)
- **Serverless functions** have timeout limits
- **No persistent server** for real-time games

## 🔧 Alternative: Vercel + External WebSocket

For better multiplayer support, you can:
1. Deploy frontend to Vercel
2. Use external WebSocket service (like Socket.io Cloud)
3. Or use Railway/Render for the full stack

## 📊 Vercel vs Other Options

| Platform | Free Tier | WebSockets | Multiplayer | Best For |
|----------|-----------|------------|-------------|----------|
| Vercel   | Unlimited | ❌ Limited | ⚠️ Limited  | Static sites |
| Railway  | 500h/month| ✅ Full    | ✅ Full     | Full-stack apps |
| Render   | 750h/month| ✅ Full    | ✅ Full     | Full-stack apps |

## 🎮 After Deployment

1. **Test your game** on the Vercel URL
2. **Check multiplayer functionality**
3. **Consider migrating** to Railway/Render if WebSockets don't work

## 🔍 Troubleshooting

**WebSocket issues:**
- Vercel has limited WebSocket support
- Consider Railway or Render for multiplayer games
- Test multiplayer functionality thoroughly

**Deployment fails:**
- Check Vercel logs in dashboard
- Ensure all dependencies are in `package.json`
- Verify build script works locally

## 💡 Pro Tips

1. **Auto-deploy:** Every push to GitHub triggers a new deployment
2. **Custom domains:** Add your own domain in Vercel settings
3. **Performance:** Vercel's global CDN provides fast loading
4. **Consider alternatives:** Railway/Render for multiplayer games

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **Community:** https://github.com/vercel/vercel/discussions

## 🚀 Recommended Alternative

For multiplayer games, we recommend:
- **Railway** (500h/month free)
- **Render** (750h/month free)

Both provide full WebSocket support perfect for multiplayer gaming!

Happy gaming! 🎯 