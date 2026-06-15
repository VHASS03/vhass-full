#!/bin/bash

# VHASS Academy Backend Deployment Script for Hostinger
# Domain: vhassacademy.com
# Backend URL: https://api.vhassacademy.com

echo "🚀 Starting VHASS Academy Backend deployment..."
echo "📍 Domain: vhassacademy.com"
echo "🔗 Backend URL: https://api.vhassacademy.com"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p uploads

# Set proper permissions
echo "🔐 Setting permissions..."
chmod 755 uploads
chmod 644 .htaccess

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 not found. Installing PM2..."
    npm install -g pm2
fi

# Stop existing process if running
echo "🔄 Stopping existing processes..."
pm2 stop vhass-backend 2>/dev/null || true
pm2 delete vhass-backend 2>/dev/null || true

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Setup PM2 to start on system reboot
echo "⚙️  Setting up PM2 startup..."
pm2 startup

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Application Status:"
pm2 status
echo ""
echo "🔗 Your backend will be available at: https://api.vhassacademy.com"
echo "🔗 Health check: https://api.vhassacademy.com/api/health"
echo ""
echo "📋 Useful commands:"
echo "   Check status: pm2 status"
echo "   View logs: pm2 logs vhass-backend"
echo "   Restart: pm2 restart vhass-backend"
echo "   Monitor: pm2 monit"
echo ""
echo "🌐 Frontend should be configured to use: https://api.vhassacademy.com"
