# 🚀 Netlify Deployment Guide

This guide will help you deploy your Electricity Tracker webapp to Netlify.

## 📋 Prerequisites

- GitHub account
- Netlify account (free at [netlify.com](https://netlify.com))
- Backend deployed separately (Railway, Heroku, etc.)

## 🎯 Step-by-Step Deployment

### 1. **Prepare Your Repository**

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 2. **Deploy Backend First** (Important!)

Your backend needs to be deployed separately. Recommended platforms:

#### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Create new project from GitHub
4. Select your `server` folder
5. Railway will auto-detect Node.js and deploy
6. Note the deployed URL (e.g., `https://your-app.railway.app`)

#### Option B: Heroku
1. Go to [heroku.com](https://heroku.com)
2. Create new app
3. Connect GitHub repository
4. Deploy from `server` folder
5. Note the deployed URL (e.g., `https://your-app.herokuapp.com`)

### 3. **Deploy Frontend to Netlify**

1. **Go to Netlify**: Visit [app.netlify.com](https://app.netlify.com)

2. **Create New Site**: Click "New site from Git"

3. **Connect GitHub**: 
   - Choose GitHub as your Git provider
   - Authorize Netlify to access your repositories
   - Select your `electricity-tracker` repository

4. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: Leave empty (root)

5. **Add Environment Variables**:
   - Go to Site settings > Environment variables
   - Add: `VITE_SERVER_URL` = `https://your-backend-url.railway.app` (or your backend URL)

6. **Deploy**: Click "Deploy site"

### 4. **Update API Configuration**

After deployment, update your `netlify.toml` file with your actual backend URL:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-actual-backend-url.railway.app/api/:splat"
  status = 200
  force = true
```

### 5. **Configure Custom Domain** (Optional)

1. In Netlify dashboard, go to Domain settings
2. Add your custom domain
3. Configure DNS settings as instructed

## 🔧 Environment Variables

Set these in Netlify's Environment Variables section:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_SERVER_URL` | `https://your-backend-url.railway.app` | Backend API URL |
| `NODE_VERSION` | `18` | Node.js version |

## 🐛 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure build command is correct: `npm run build`
- Check Netlify build logs for specific errors

### API Calls Fail
- Verify `VITE_SERVER_URL` environment variable is set correctly
- Check that backend is deployed and accessible
- Ensure CORS is configured on backend for your Netlify domain

### 404 Errors on Refresh
- The `_redirects` file should handle SPA routing
- Check that `netlify.toml` redirect rules are correct

## 📊 Monitoring

- **Netlify Analytics**: Available in Netlify dashboard
- **Build Logs**: Check build logs for deployment issues
- **Function Logs**: If using Netlify Functions

## 🔄 Continuous Deployment

Once set up, Netlify will automatically deploy when you push to your main branch.

## 🆘 Support

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Railway Documentation](https://docs.railway.app/)

---

**Note**: This is a full-stack application. The frontend (React) goes to Netlify, while the backend (Node.js/Express) needs to be deployed separately to a platform that supports Node.js applications.
