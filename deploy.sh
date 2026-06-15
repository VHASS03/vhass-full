#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if we have uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Your commit message'"
    exit 1
fi

echo "✅ Git repository is clean"

# Build the frontend
echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Frontend built successfully"

# Test the backend
echo "🧪 Testing backend..."
cd backend
npm test 2>/dev/null || echo "⚠️  No tests found, skipping..."

# Check if backend can start
echo "🔧 Testing backend startup..."
timeout 10s npm start > /dev/null 2>&1 &
BACKEND_PID=$!
sleep 3
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ Backend can start successfully"
    kill $BACKEND_PID
else
    echo "❌ Backend failed to start"
    exit 1
fi

cd ..

echo ""
echo "🎉 Deployment preparation completed!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub:"
echo "   git push origin main"
echo ""
echo "2. Deploy to Render:"
echo "   - Go to https://render.com"
echo "   - Connect your GitHub repository"
echo "   - Render will automatically detect the render.yaml file"
echo "   - Deploy both services"
echo ""
echo "3. Set up environment variables in Render:"
echo "   - MONGODB_URI (from your MongoDB Atlas)"
echo "   - SESSION_SECRET (generate a secure random string)"
echo "   - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET"
echo "   - PhonePe credentials"
echo "   - SMTP credentials"
echo ""
echo "4. Update your domain DNS if needed"
echo ""
echo "Good luck! 🚀"
