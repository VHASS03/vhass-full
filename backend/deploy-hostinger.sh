#!/bin/bash

# VHASS Backend Deployment Script for Hostinger
echo "🚀 Starting VHASS Backend deployment on Hostinger..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create uploads directory if it doesn't exist
mkdir -p uploads

# Set proper permissions
chmod 755 uploads
chmod 644 .htaccess

# Start the application with PM2
echo "🔄 Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system reboot
pm2 startup

echo "✅ Deployment completed successfully!"
echo "📊 Check application status with: pm2 status"
echo "📋 View logs with: pm2 logs vhass-backend"
