# Railway Deployment Guide (FREE)

Railway offers a generous free tier with 500 hours/month and automatic deployments!

## 🚀 Quick Deploy to Railway

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Verify your email

### Step 2: Deploy from GitHub
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `krunker-clone` repository
4. Railway will auto-detect Node.js and deploy!

### Step 3: Get Your URL
- Railway gives you a URL like: `https://krunker-clone-production.up.railway.app`
- Share this URL with anyone!

## ✅ What Railway Provides (FREE)

- **500 hours/month** (enough for 24/7 hosting)
- **Automatic deployments** from GitHub
- **Custom domains** support
- **SSL certificates** included
- **WebSocket support** (perfect for multiplayer)
- **No credit card required**

## 🔧 Railway Configuration

Railway automatically detects your setup, but you can customize:

### Environment Variables (Optional)
In Railway dashboard:
```
NODE_ENV=production
PORT=3000
```

### Build Settings
Railway uses your `package.json` scripts:
- **Build Command:** `npm run build`
- **Start Command:** `npm start`

## 📊 Railway vs Other Free Options

| Platform | Free Hours | Auto-Deploy | Custom Domain | WebSockets |
|----------|------------|-------------|---------------|------------|
| Railway  | 500/month  | ✅ Yes      | ✅ Yes        | ✅ Yes     |
| Render   | 750/month  | ✅ Yes      | ✅ Yes        | ✅ Yes     |
| Vercel   | Unlimited  | ✅ Yes      | ✅ Yes        | ❌ No      |
| Heroku   | ❌ None    | ✅ Yes      | ✅ Yes        | ✅ Yes     |

## 🎮 After Deployment

1. **Test your game** on the Railway URL
2. **Share with friends** - they can join from anywhere!
3. **Monitor usage** in Railway dashboard
4. **Set up custom domain** if needed

## 🔍 Troubleshooting

**Deployment fails:**
- Check Railway logs in dashboard
- Ensure all dependencies are in `package.json`
- Verify build script works locally

**Game doesn't work:**
- Railway supports WebSockets
- Check if port configuration is correct
- Verify all files are committed to GitHub

## 💡 Pro Tips

1. **Auto-deploy:** Every push to GitHub triggers a new deployment
2. **Custom domains:** Add your own domain in Railway settings
3. **Monitoring:** View logs and metrics in Railway dashboard
4. **Scaling:** Upgrade to paid plan for more resources

## 🆘 Need Help?

- **Railway Docs:** https://docs.railway.app/
- **Railway Discord:** https://discord.gg/railway
- **Community Support:** https://github.com/railwayapp/railway

Happy gaming on Railway! 🚂 