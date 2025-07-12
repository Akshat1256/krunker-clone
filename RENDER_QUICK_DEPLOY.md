# Render Deployment - Complete Guide

Deploy your Krunker Clone to Render in 10 minutes!

## 🚀 Step-by-Step Process

### Step 1: Install Git (if not installed)

**Windows:**
1. Download Git from: https://git-scm.com/download/win
2. Run the installer (use default settings)
3. Restart your command prompt

**Mac:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git
```

### Step 2: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Sign up/Login to your account
3. Click "New repository"
4. Name it: `krunker-clone`
5. Make it **Public** (required for free Render)
6. Click "Create repository"

### Step 3: Upload Your Code to GitHub

**Option A: Using GitHub Desktop (Easiest)**
1. Download GitHub Desktop: https://desktop.github.com/
2. Install and login
3. Click "Clone a repository from the Internet"
4. Select your `krunker-clone` repository
5. Choose a local path (e.g., `C:\Users\Akshat\Desktop\krunker-clone`)
6. Click "Clone"
7. Copy all your project files to this folder
8. In GitHub Desktop, commit and push your changes

**Option B: Using Command Line**
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Krunker Clone"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/krunker-clone.git

# Push to GitHub
git push -u origin main
```

### Step 4: Deploy to Render

1. **Go to Render:**
   - Visit [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create New Web Service:**
   - Click "New" → "Web Service"
   - Click "Connect" next to your `krunker-clone` repository

3. **Configure the Service:**
   - **Name:** `krunker-clone` (or your preferred name)
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** `Free`

4. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Wait 2-3 minutes for deployment to complete

### Step 5: Get Your Public URL

After deployment, Render will give you a URL like:
```
https://krunker-clone.onrender.com
```

**Share this URL with anyone in the world!** 🌍

## ✅ What You Get (FREE)

- **750 hours/month** (enough for 24/7 hosting)
- **Full WebSocket support** (perfect for multiplayer)
- **Automatic deployments** (updates when you push to GitHub)
- **Custom domain** support
- **SSL certificate** included
- **No credit card required**

## 🎮 After Deployment

1. **Test your game** on the Render URL
2. **Share with friends** - they can join from anywhere!
3. **Monitor usage** in Render dashboard
4. **Set up custom domain** if needed

## 🔧 Troubleshooting

**Deployment fails:**
- Check Render logs in dashboard
- Ensure all dependencies are in `package.json`
- Verify build script works locally

**Game doesn't work:**
- Render supports WebSockets
- Check if port configuration is correct
- Verify all files are committed to GitHub

**App sleeps:**
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

## 🎯 Quick Commands (After Git Setup)

```bash
# Initialize and push to GitHub
git init
git add .
git commit -m "Deploy to Render"
git remote add origin https://github.com/YOUR_USERNAME/krunker-clone.git
git push -u origin main

# Then deploy to Render using the web interface
```

Happy gaming on Render! 🎨 