# VHASS Backend Deployment Guide for Hostinger

## Prerequisites

1. **Hostinger VPS or Cloud Hosting** with Node.js support
2. **Domain name** pointing to your Hostinger hosting
3. **MongoDB Atlas** database (or any MongoDB instance)
4. **Google OAuth** credentials
5. **PhonePe** merchant credentials (if using payment gateway)

## Step 1: Prepare Your Hostinger Environment

### 1.1 Access Your Hostinger Control Panel
- Log in to your Hostinger account
- Navigate to your hosting control panel
- Access SSH/Terminal if using VPS, or use File Manager for shared hosting

### 1.2 Install Node.js and PM2
```bash
# For VPS users
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# For shared hosting users
# Node.js should already be available
npm install -g pm2
```

## Step 2: Upload Your Backend Code

### 2.1 Upload Files
- Upload all backend files to your Hostinger hosting
- Ensure the file structure is maintained:
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

### 2.2 Set File Permissions
```bash
chmod +x deploy-hostinger.sh
chmod 755 uploads
chmod 644 .htaccess
```

## Step 3: Configure Environment Variables

### 3.1 Update config.env.hostinger
Edit `config.env.hostinger` with your actual values:

```env
# Replace with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vhass?retryWrites=true&w=majority

# Replace with your domain
FRONTEND_URL=https://yourdomain.com

# Replace with your Google OAuth credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Replace with your session secret
SESSION_SECRET=your_secure_session_secret

# Replace with your JWT secret
JWT_SECRET=your_secure_jwt_secret

# Replace with your PhonePe credentials
PHONEPE_MERCHANT_ID=your_phonepe_merchant_id
PHONEPE_MERCHANT_KEY=your_phonepe_merchant_key
PHONEPE_REDIRECT_URL=https://yourdomain.com/api/payment/callback
```

### 3.2 Rename Environment File
```bash
mv config.env.hostinger config.env.production
```

## Step 4: Install Dependencies and Deploy

### 4.1 Install Dependencies
```bash
cd backend
npm install --production
```

### 4.2 Run Deployment Script
```bash
./deploy-hostinger.sh
```

### 4.3 Manual PM2 Start (Alternative)
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## Step 5: Configure Domain and SSL

### 5.1 Domain Configuration
1. In Hostinger control panel, go to "Domains"
2. Add your domain or subdomain (e.g., `api.yourdomain.com`)
3. Point it to your hosting directory

### 5.2 SSL Certificate
1. In Hostinger control panel, go to "SSL"
2. Install SSL certificate for your domain
3. Enable "Force HTTPS" if available

### 5.3 DNS Configuration
Add these DNS records:
```
Type: A
Name: api (or @ for root domain)
Value: Your hosting IP address
TTL: 300
```

## Step 6: Update Frontend Configuration

### 6.1 Update API Base URL
In your frontend `env.production`:
```env
VITE_API_URL=https://api.yourdomain.com
```

### 6.2 Update CORS Settings
In your backend `index.js`, add your domain to allowed origins:
```javascript
const allowedOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  'https://api.yourdomain.com',
  // ... other origins
];
```

## Step 7: Test Your Deployment

### 7.1 Check Application Status
```bash
pm2 status
pm2 logs vhass-backend
```

### 7.2 Test API Endpoints
```bash
# Health check
curl https://api.yourdomain.com/api/health

# Test authentication
curl https://api.yourdomain.com/api/auth/google
```

### 7.3 Monitor Logs
```bash
# View real-time logs
pm2 logs vhass-backend --lines 100

# View error logs
tail -f logs/err.log
```

## Step 8: Maintenance Commands

### 8.1 Application Management
```bash
# Restart application
pm2 restart vhass-backend

# Stop application
pm2 stop vhass-backend

# Delete application
pm2 delete vhass-backend

# Update application
pm2 reload vhass-backend
```

### 8.2 Log Management
```bash
# Clear logs
pm2 flush

# View specific log file
cat logs/out.log
cat logs/err.log
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   # Kill the process
   kill -9 <PID>
   ```

2. **Permission Denied**
   ```bash
   # Fix permissions
   chmod 755 uploads
   chmod 644 .htaccess
   ```

3. **MongoDB Connection Failed**
   - Check your MongoDB connection string
   - Ensure IP whitelist includes your Hostinger IP
   - Verify database credentials

4. **SSL Certificate Issues**
   - Wait for SSL propagation (up to 24 hours)
   - Check DNS propagation
   - Verify domain configuration

### Performance Optimization

1. **Enable Compression**
   ```javascript
   // Add to index.js
   import compression from 'compression';
   app.use(compression());
   ```

2. **Set Cache Headers**
   ```javascript
   // Add to index.js
   app.use('/uploads', express.static('uploads', {
     maxAge: '1d',
     etag: true
   }));
   ```

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to git
2. **Firewall**: Configure firewall rules in Hostinger
3. **Regular Updates**: Keep Node.js and dependencies updated
4. **Backup**: Regular database and file backups
5. **Monitoring**: Set up monitoring and alerting

## Support

If you encounter issues:
1. Check Hostinger's Node.js hosting documentation
2. Review PM2 logs for error messages
3. Verify all environment variables are set correctly
4. Test API endpoints individually
5. Contact Hostinger support for hosting-specific issues
