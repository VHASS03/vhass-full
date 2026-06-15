@echo off
echo 🚀 Starting deployment process...

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install git first.
    pause
    exit /b 1
)

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ❌ Not in a git repository. Please initialize git first:
    echo    git init
    echo    git add .
    echo    git commit -m "Initial commit"
    pause
    exit /b 1
)

REM Check if we have uncommitted changes
git diff-index --quiet HEAD -- >nul 2>&1
if errorlevel 1 (
    echo ⚠️  You have uncommitted changes. Please commit them first:
    echo    git add .
    echo    git commit -m "Your commit message"
    pause
    exit /b 1
)

echo ✅ Git repository is clean

REM Build the frontend
echo 📦 Building frontend...
call npm run build

if errorlevel 1 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)

echo ✅ Frontend built successfully

REM Test the backend
echo 🧪 Testing backend...
cd backend

REM Check if backend can start
echo 🔧 Testing backend startup...
start /B npm start >nul 2>&1
timeout /t 3 /nobreak >nul

REM Check if the process is still running
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ Backend can start successfully
    taskkill /F /IM node.exe >nul 2>&1
) else (
    echo ❌ Backend failed to start
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo 🎉 Deployment preparation completed!
echo.
echo Next steps:
echo 1. Push your code to GitHub:
echo    git push origin main
echo.
echo 2. Deploy to Render:
echo    - Go to https://render.com
echo    - Connect your GitHub repository
echo    - Render will automatically detect the render.yaml file
echo    - Deploy both services
echo.
echo 3. Set up environment variables in Render:
echo    - MONGODB_URI (from your MongoDB Atlas)
echo    - SESSION_SECRET (generate a secure random string)
echo    - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
echo    - PhonePe credentials
echo    - SMTP credentials
echo.
echo 4. Update your domain DNS if needed
echo.
echo Good luck! 🚀
pause
