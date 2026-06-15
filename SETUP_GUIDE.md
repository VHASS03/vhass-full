# VHASS Platform Setup Guide

## 🚀 Quick Start

### Option 1: Using the Script (Recommended)
```bash
# Windows Batch
start-dev.bat

# PowerShell
.\start-dev.ps1
```

### Option 2: Using npm scripts
```bash
# Install all dependencies
npm install
npm run backend:install

# Start both frontend and backend
npm run dev:full
```

### Option 3: Manual Setup
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

## 📋 Prerequisites

Before starting, make sure you have:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (local or cloud) - [Download here](https://www.mongodb.com/try/download/community)
3. **Google OAuth credentials** (for Google login)
4. **PhonePe merchant credentials** (for payments)

## ⚙️ Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/vhass_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development

# PhonePe Configuration (if needed)
PHONEPE_MERCHANT_ID=your-phonepe-merchant-id
PHONEPE_MERCHANT_KEY=your-phonepe-merchant-key
PHONEPE_REDIRECT_URL=http://localhost:5173

# Email Configuration (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password

# Server Configuration
PORT=5001
```

### Frontend Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5001/api
```

## 🔧 Getting Credentials

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - `http://localhost:5001/auth/google/callback` (development)
   - `https://your-domain.com/auth/google/callback` (production)
6. Copy Client ID and Client Secret to your `.env` file

### PhonePe Setup
1. Sign up for PhonePe Business account
2. Get your Merchant ID and Merchant Key
3. Add them to your `.env` file

### Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in your `.env` file

## 🗄️ Database Setup

### Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create database: `vhass_db`

### Cloud MongoDB (MongoDB Atlas)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Replace `MONGODB_URI` in your `.env` file

## 🚀 Running the Application

### Development Mode
```bash
# Start both servers
npm run dev:full

# Or start individually
npm run dev          # Frontend only
npm run backend      # Backend only
```

### Production Mode
```bash
# Build frontend
npm run build

# Start backend in production
cd backend
NODE_ENV=production npm start
```

## 📱 Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001/api
- **Health Check**: http://localhost:5001/health

## 🔍 Testing the Setup

1. **Backend Health Check**
   ```bash
   curl http://localhost:5001/health
   ```

2. **Frontend Load Test**
   - Open http://localhost:5173 in your browser
   - Check if the page loads without errors

3. **API Test**
   ```bash
   curl http://localhost:5001/api/course/all
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 5001
   netstat -ano | findstr :5001
   
   # Kill process
   taskkill /PID <process_id> /F
   ```

2. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check network connectivity

3. **CORS Errors**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check CORS configuration in `backend/index.js`

4. **Google OAuth Not Working**
   - Verify redirect URIs in Google Cloud Console
   - Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### Logs and Debugging

- **Frontend**: Check browser console (F12)
- **Backend**: Check terminal output
- **Database**: Check MongoDB logs

## 📁 Project Structure

```
Vhass-Frontend-main/
├── src/                    # Frontend React application
│   ├── Components/         # Reusable UI components
│   ├── Pages/             # Page components
│   ├── services/          # API services
│   └── ...
├── backend/               # Backend Node.js server
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── ...
├── start-dev.bat         # Windows batch script
├── start-dev.ps1         # PowerShell script
└── README.md
```

## 🔐 Security Notes

1. **Never commit `.env` files** to version control
2. **Use strong secrets** for JWT and session keys
3. **Enable HTTPS** in production
4. **Regularly update dependencies**
5. **Monitor logs** for suspicious activity

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the logs for error messages
3. Verify all environment variables are set correctly
4. Ensure all prerequisites are installed

For additional support, contact the VHASS development team.

## 🎉 Success!

Once everything is running, you should see:
- Frontend at http://localhost:5173
- Backend API responding at http://localhost:5001/health
- No console errors in browser
- Successful database connection

You can now start developing and testing your VHASS platform!

