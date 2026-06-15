# Complete Guide: Adding Custom Domain to Render

## Overview
This guide will help you add your custom domain `vhassacademy.com` to your Render deployment.

## Prerequisites
- Your domain `vhassacademy.com` registered with a domain registrar
- Access to your domain registrar's DNS settings
- Your Render service already deployed

## Step 1: Access Your Render Dashboard

1. **Login to Render**
   - Go to [https://dashboard.render.com](https://dashboard.render.com)
   - Sign in with your account

2. **Navigate to Your Service**
   - Click on your service (frontend or backend)
   - Go to the **Settings** tab

## Step 2: Add Custom Domain in Render

### For Frontend Service:
1. **Go to Settings Tab**
   - Click on your frontend service
   - Navigate to **Settings** → **Custom Domains**

2. **Add Domain**
   - Click **Add Custom Domain**
   - Enter your domain: `www.vhassacademy.com`
   - Click **Add Domain**

3. **Verify Domain**
   - Render will show you DNS records to add
   - Note down the CNAME record provided

### For Backend Service (if hosting backend on Render):
1. **Go to Settings Tab**
   - Click on your backend service
   - Navigate to **Settings** → **Custom Domains**

2. **Add Domain**
   - Click **Add Custom Domain**
   - Enter your domain: `api.vhassacademy.com`
   - Click **Add Domain**

## Step 3: Configure DNS Records

### Option A: Using Your Domain Registrar's DNS

1. **Access Your Domain Registrar**
   - Log in to your domain registrar (GoDaddy, Namecheap, etc.)
   - Go to DNS Management or DNS Settings

2. **Add CNAME Record for Frontend**
   ```
   Type: CNAME
   Name: www
   Value: [Your Render Service URL].onrender.com
   TTL: 300 (or default)
   ```

3. **Add CNAME Record for Backend (if applicable)**
   ```
   Type: CNAME
   Name: api
   Value: [Your Backend Render Service URL].onrender.com
   TTL: 300 (or default)
   ```

4. **Add A Record for Root Domain (Optional)**
   ```
   Type: A
   Name: @
   Value: 76.76.19.19
   TTL: 300
   ```

### Option B: Using Render's DNS (Recommended)

1. **In Render Dashboard**
   - Go to **Settings** → **Custom Domains**
   - Click **Manage DNS** next to your domain

2. **Add DNS Records**
   - Add the CNAME records as shown in Render
   - Add A record for root domain if needed

## Step 4: SSL Certificate Setup

### Automatic SSL (Recommended)
1. **Enable SSL**
   - In Render, go to **Settings** → **Custom Domains**
   - Toggle **Force HTTPS** to ON
   - Render will automatically provision SSL certificates

2. **Wait for SSL Propagation**
   - SSL certificates take 5-15 minutes to provision
   - You'll see a green checkmark when ready

### Manual SSL (If needed)
1. **Upload Certificate**
   - Go to **Settings** → **SSL**
   - Upload your SSL certificate and private key
   - Add intermediate certificates if required

## Step 5: Verify Domain Setup

### Check DNS Propagation
```bash
# Check CNAME record
nslookup www.vhassacademy.com

# Check A record (if added)
nslookup vhassacademy.com

# Check SSL certificate
curl -I https://www.vhassacademy.com
```

### Test Your Domain
1. **Visit your domain**
   - Go to `https://www.vhassacademy.com`
   - Ensure it loads your application

2. **Check SSL**
   - Verify the padlock icon in browser
   - Test HTTPS redirect

3. **Test API endpoints** (if backend on Render)
   - Visit `https://api.vhassacademy.com/api/health`
   - Should return health status

## Step 6: Environment Configuration

### Update Frontend Environment
In your frontend's environment variables:
```env
VITE_API_URL=https://api.vhassacademy.com
```

### Update Backend Environment
In your backend's environment variables:
```env
FRONTEND_URL=https://www.vhassacademy.com
```

## Step 7: Common Issues and Solutions

### Issue 1: Domain Not Resolving
**Symptoms**: Domain shows "Site not found" or doesn't load
**Solutions**:
- Check DNS propagation: `nslookup www.vhassacademy.com`
- Verify CNAME record is correct
- Wait 24-48 hours for full DNS propagation

### Issue 2: SSL Certificate Not Working
**Symptoms**: Browser shows "Not Secure" or SSL errors
**Solutions**:
- Enable "Force HTTPS" in Render
- Wait 15-30 minutes for SSL provisioning
- Check if certificate is valid: `curl -I https://www.vhassacademy.com`

### Issue 3: Mixed Content Errors
**Symptoms**: Browser console shows mixed content warnings
**Solutions**:
- Ensure all resources use HTTPS
- Update API URLs to use HTTPS
- Check for hardcoded HTTP URLs

### Issue 4: CORS Errors
**Symptoms**: API calls fail with CORS errors
**Solutions**:
- Update backend CORS settings to include your domain
- Ensure frontend and backend URLs are correct
- Check if SSL certificates are properly configured

## Step 8: Performance Optimization

### Enable CDN
1. **In Render Dashboard**
   - Go to **Settings** → **Custom Domains**
   - Enable **CDN** for better performance

### Configure Caching
1. **Add Cache Headers**
   ```javascript
   // In your application
   app.use('/static', express.static('public', {
     maxAge: '1d',
     etag: true
   }));
   ```

## Step 9: Monitoring and Maintenance

### Monitor Domain Health
1. **Set up monitoring**
   - Use Render's built-in monitoring
   - Set up uptime monitoring with external services

2. **Regular checks**
   - Monitor SSL certificate expiration
   - Check DNS propagation
   - Verify domain redirects

### SSL Certificate Renewal
- Render automatically renews SSL certificates
- Monitor certificate expiration dates
- Set up alerts for certificate issues

## Step 10: Security Best Practices

### Enable Security Headers
```javascript
// Add security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### Configure CSP
1. **Add Content Security Policy**
   - Set up CSP headers
   - Configure allowed sources
   - Monitor CSP violations

## Troubleshooting Commands

### DNS Troubleshooting
```bash
# Check DNS records
dig www.vhassacademy.com
nslookup www.vhassacademy.com

# Check specific record types
dig CNAME www.vhassacademy.com
dig A vhassacademy.com
```

### SSL Troubleshooting
```bash
# Check SSL certificate
openssl s_client -connect www.vhassacademy.com:443 -servername www.vhassacademy.com

# Test HTTPS
curl -I https://www.vhassacademy.com
```

### Performance Testing
```bash
# Test response time
curl -w "@curl-format.txt" -o /dev/null -s https://www.vhassacademy.com

# Check headers
curl -I https://www.vhassacademy.com
```

## Support Resources

- **Render Documentation**: [https://render.com/docs](https://render.com/docs)
- **Render Support**: [https://render.com/support](https://render.com/support)
- **DNS Propagation Checker**: [https://www.whatsmydns.net](https://www.whatsmydns.net)
- **SSL Checker**: [https://www.ssllabs.com/ssltest](https://www.ssllabs.com/ssltest)

## Expected Timeline

- **DNS Setup**: 5-10 minutes
- **DNS Propagation**: 24-48 hours (usually much faster)
- **SSL Certificate**: 5-15 minutes
- **Full Setup**: 30-60 minutes

## Final Checklist

- [ ] Domain added to Render
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] HTTPS redirect working
- [ ] Frontend loading correctly
- [ ] API endpoints working (if applicable)
- [ ] Environment variables updated
- [ ] CORS settings configured
- [ ] Monitoring set up
- [ ] Security headers configured
