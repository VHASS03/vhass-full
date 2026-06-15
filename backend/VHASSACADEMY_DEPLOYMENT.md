# VHASS Academy Backend Deployment Guide for Hostinger

## Domain Configuration: vhassacademy.com

### Backend URL: `https://api.vhassacademy.com`
### Frontend URL: `https://www.vhassacademy.com`

## Quick Setup Checklist

### ✅ **1. Hostinger Hosting Setup**
- [ ] Purchase Hostinger VPS or Cloud hosting with Node.js support
- [ ] Access your Hostinger control panel
- [ ] Note your hosting IP address

### ✅ **2. Domain Configuration**
- [ ] In Hostinger control panel, go to "Domains"
- [ ] Add subdomain: `api.vhassacademy.com`
- [ ] Point it to your hosting directory
- [ ] Install SSL certificate for `api.vhassacademy.com`

### ✅ **3. DNS Records**
Add these DNS records in your domain registrar:
```
Type: A
Name: api
Value: [Your Hostinger IP Address]
TTL: 300
```

### ✅ **4. Environment Variables**
Update `config.env.hostinger` with your actual values:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vhass?retryWrites=true&w=majority

# Session Configuration
SESSION_SECRET=your_secure_session_secret_here

# Frontend URL
FRONTEND_URL=https://vhassacademy.com

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Configuration
EMAIL_HOST=your_email_host
EMAIL_PORT=587
EMAIL_USER=your_email@vhassacademy.com
EMAIL_PASS=your_email_password

# PhonePe Configuration
PHONEPE_MERCHANT_ID=your_phonepe_merchant_id
PHONEPE_MERCHANT_KEY=your_phonepe_merchant_key
PHONEPE_REDIRECT_URL=https://vhassacademy.com/api/payment/callback

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d
```

## Deployment Steps

### Step 1: Upload Backend Files
1. Upload the entire `backend/` folder to your Hostinger hosting
2. Maintain the file structure:
```
backend/
├── index.js
├── package.json
├── ecosystem.config.js
├── .htaccess
├── config.env.hostinger
├── deploy-hostinger.sh
├── routes/
├── controllers/
├── models/
├── middlewares/
└── uploads/
```

### Step 2: SSH into Hostinger (VPS)
```bash
# Connect to your Hostinger VPS
ssh root@your_hostinger_ip

# Navigate to backend directory
cd backend

# Set permissions
chmod +x deploy-hostinger.sh
chmod 755 uploads
chmod 644 .htaccess

# Rename environment file
mv config.env.hostinger config.env.production
```

### Step 3: Install Dependencies
```bash
# Install Node.js dependencies
npm install --production

# Install PM2 globally
npm install -g pm2
```

### Step 4: Deploy Application
```bash
# Run deployment script
./deploy-hostinger.sh

# Or manually start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## Testing Your Deployment

### Test API Endpoints
```bash
# Health check
curl https://api.vhassacademy.com/api/health

# Should return:
# {"status":"OK","timestamp":"2024-01-XX...","environment":"production"}
```

### Check Application Status
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs vhass-backend
```

### Test Frontend Integration
1. Visit `https://www.vhassacademy.com`
2. Try to log in or register
3. Check browser console for API calls to `api.vhassacademy.com`

## Frontend Configuration

Your frontend at `www.vhassacademy.com` should already be configured with:
```env
VITE_API_URL=https://api.vhassacademy.com
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check that `https://vhassacademy.com` is in allowed origins
   - Verify SSL certificates are properly installed

2. **Database Connection Failed**
   - Check MongoDB connection string
   - Ensure MongoDB Atlas IP whitelist includes your Hostinger IP

3. **SSL Certificate Issues**
   - Wait for SSL propagation (up to 24 hours)
   - Check DNS propagation with: `nslookup api.vhassacademy.com`

4. **Port Already in Use**
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   # Kill the process
   kill -9 <PID>
   ```

### Performance Monitoring
```bash
# Monitor application
pm2 monit

# View real-time logs
pm2 logs vhass-backend --lines 100

# Check system resources
htop
```

## Maintenance Commands

```bash
# Restart application
pm2 restart vhass-backend

# Update application
pm2 reload vhass-backend

# Stop application
pm2 stop vhass-backend

# View logs
pm2 logs vhass-backend

# Clear logs
pm2 flush
```

## Security Checklist

- [ ] SSL certificate installed for `api.vhassacademy.com`
- [ ] Environment variables are secure and not committed to git
- [ ] MongoDB connection uses SSL
- [ ] JWT secrets are strong and unique
- [ ] Session secrets are secure
- [ ] CORS is properly configured
- [ ] File upload limits are set

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs vhass-backend`
2. Verify DNS propagation: `nslookup api.vhassacademy.com`
3. Test SSL: `curl -I https://api.vhassacademy.com/api/health`
4. Contact Hostinger support for hosting-specific issues

## Expected URLs After Deployment

- **Frontend**: `https://www.vhassacademy.com`
- **Backend API**: `https://api.vhassacademy.com`
- **Health Check**: `https://api.vhassacademy.com/api/health`
- **Uploads**: `https://api.vhassacademy.com/uploads/`
