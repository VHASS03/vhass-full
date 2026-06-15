# 🚀 Deployment Guide for VHASS Academy

This guide will help you deploy your VHASS Academy application to production.

## 📋 Prerequisites

- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [GitHub](https://github.com/) account
- A [Render](https://render.com/) account (free tier available)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account

## 🎯 Deployment Options

### Option 1: Render (Recommended)
- **Frontend**: Static site hosting
- **Backend**: Node.js service
- **Database**: MongoDB Atlas
- **Cost**: Free tier available

### Option 2: Vercel + Railway
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: MongoDB Atlas

### Option 3: Netlify + Railway
- **Frontend**: Netlify
- **Backend**: Railway
- **Database**: MongoDB Atlas

## 🚀 Quick Deployment (Render)

### Step 1: Prepare Your Code

1. **Run the deployment script**:
   ```bash
   # On Windows
   deploy.bat
   
   # On Mac/Linux
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Create GitHub repository**:
   - Go to [GitHub](https://github.com)
   - Create a new repository
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/vhass-academy.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Render

1. **Sign up/Login to Render**:
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create New Web Service**:
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

3. **Configure Backend Service**:
   - **Name**: `vhass-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vhass
   SESSION_SECRET=your-super-secret-session-key
   FRONTEND_URL=https://vhass-frontend.onrender.com
   NODE_ENV=production
   PORT=10000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   PHONEPE_MERCHANT_ID=your-phonepe-merchant-id
   PHONEPE_SALT_KEY=your-phonepe-salt-key
   PHONEPE_SALT_INDEX=1
   PHONEPE_ENVIRONMENT=PRODUCTION
   PHONEPE_REDIRECT_URL=https://vhass-frontend.onrender.com
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_USER=info@vhassacademy.com
   SMTP_PASS=your-smtp-password
   ```

5. **Create Static Site**:
   - Click "New +"
   - Select "Static Site"
   - Connect the same GitHub repository
   - **Name**: `vhass-frontend`
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

6. **Set Frontend Environment Variables**:
   ```
   VITE_API_URL=https://vhass-backend.onrender.com
   ```

### Step 3: Configure Database

1. **MongoDB Atlas Setup**:
   - Create a cluster in MongoDB Atlas
   - Create a database user
   - Get your connection string
   - Add it to Render environment variables

2. **Update CORS Settings**:
   - Add your Render URLs to the allowed origins in `backend/index.js`

### Step 4: Test Deployment

1. **Check Backend Health**:
   ```
   https://vhass-backend.onrender.com/health
   ```

2. **Test Frontend**:
   ```
   https://vhass-frontend.onrender.com
   ```

## 🔧 Advanced Configuration

### Custom Domain Setup

1. **Add Custom Domain in Render**:
   - Go to your service settings
   - Add custom domain
   - Update DNS records

2. **Update Environment Variables**:
   ```
   FRONTEND_URL=https://yourdomain.com
   PHONEPE_REDIRECT_URL=https://yourdomain.com
   ```

### SSL/HTTPS

- Render automatically provides SSL certificates
- No additional configuration needed

### Environment Variables

#### Required Variables:
- `MONGODB_URI`: MongoDB connection string
- `SESSION_SECRET`: Random string for session encryption
- `FRONTEND_URL`: Your frontend URL
- `NODE_ENV`: Set to `production`

#### Optional Variables:
- `PORT`: Server port (default: 10000)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `PHONEPE_*`: PhonePe payment gateway credentials
- `SMTP_*`: Email service credentials

## 🐛 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for syntax errors

2. **Database Connection Issues**:
   - Verify MongoDB Atlas network access
   - Check connection string format
   - Ensure database user has proper permissions

3. **CORS Errors**:
   - Update allowed origins in backend
   - Check frontend URL configuration

4. **Image Loading Issues**:
   - Verify uploads directory exists
   - Check file permissions
   - Ensure proper URL construction

### Debug Commands:

```bash
# Check backend logs
curl https://vhass-backend.onrender.com/health

# Test database connection
curl https://vhass-backend.onrender.com/api/course/all

# Check frontend build
npm run build
```

## 📊 Monitoring

### Render Dashboard:
- Monitor service health
- View logs
- Check resource usage

### MongoDB Atlas:
- Monitor database performance
- Check connection metrics
- Review query performance

## 🔄 Continuous Deployment

Render automatically deploys when you push to your main branch. To disable:

1. Go to service settings
2. Disable "Auto-Deploy"

## 🆘 Support

If you encounter issues:

1. Check Render logs
2. Verify environment variables
3. Test locally first
4. Check this guide for common solutions

## 📝 Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Database connection works
- [ ] User registration/login works
- [ ] Course creation works
- [ ] Image uploads work
- [ ] Payment integration works
- [ ] Email notifications work
- [ ] Google OAuth works
- [ ] Custom domain configured (if applicable)

---

**Happy Deploying! 🚀**
