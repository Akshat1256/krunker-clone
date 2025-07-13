# Render Deployment Guide (FREE)

Render offers 750 free hours/month - perfect for hosting your Krunker clone!

## 🚀 Quick Deploy to Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Verify your email

### Step 2: Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Select your `krunker-clone` repo

### Step 3: Configure Service
- **Name:** `krunker-clone` (or your preferred name)
- **Environment:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Plan:** `Free`

### Step 4: Deploy
1. Click "Create Web Service"
2. Render will build and deploy automatically
3. Get your URL: `https://krunker-clone.onrender.com`

## ✅ What Render Provides (FREE)

- **750 hours/month** (more than enough for 24/7)
- **100GB bandwidth/month** (generous for multiplayer)
- **Automatic deployments** from GitHub
- **Custom domains** support
- **SSL certificates** included
- **WebSocket support** (perfect for multiplayer)
- **No credit card required**

## 🔧 Render Configuration

### Environment Variables (Optional)
In Render dashboard:
```
NODE_ENV=production
PORT=3000
```

### Auto-Deploy Settings
- **Auto-Deploy:** Enabled (deploys on every GitHub push)
- **Branch:** `main` (or your default branch)

## 📊 Performance

**Free Plan Limits:**
- **750 hours/month** (31 days × 24 hours = 744 hours)
- **512 MB RAM**
- **Shared CPU**
- **Sleep after 15 minutes** of inactivity

**Performance Tips:**
- First request after sleep takes 10-30 seconds
- Consider upgrading to paid plan for always-on

## 🎮 After Deployment

1. **Test your game** on the Render URL
2. **Share with friends** - they can join from anywhere!
3. **Monitor usage** in Render dashboard
4. **Set up custom domain** if needed

## 🔍 Troubleshooting

**Deployment fails:**
- Check Render logs in dashboard
- Ensure all dependencies are in `package.json`
- Verify build script works locally

**Game doesn't work:**
- Render supports WebSockets
- Check if port configuration is correct
- Verify all files are committed to GitHub

**App sleeps too much:**
- Free plan sleeps after 15 minutes of inactivity
- First request after sleep takes 10-30 seconds
- Consider upgrading to paid plan for always-on

## 💡 Pro Tips

1. **Auto-deploy:** Every push to GitHub triggers a new deployment
2. **Custom domains:** Add your own domain in Render settings
3. **Monitoring:** View logs and metrics in Render dashboard
4. **Scaling:** Upgrade to paid plan for better performance

## 🆘 Need Help?

- **Render Docs:** https://render.com/docs
- **Render Support:** https://render.com/support
- **Community:** https://community.render.com

Happy gaming on Render! 🎨 