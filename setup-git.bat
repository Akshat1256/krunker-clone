@echo off
echo ========================================
echo    Git Setup for Render Deployment
echo ========================================
echo.

echo Step 1: Checking if Git is installed...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Go to: https://git-scm.com/download/win
    echo 2. Download and install Git
    echo 3. Restart this script
    echo.
    pause
    exit /b 1
) else (
    echo Git is installed! ✓
)

echo.
echo Step 2: Initializing Git repository...
git init

echo.
echo Step 3: Adding all files to Git...
git add .

echo.
echo Step 4: Making initial commit...
git commit -m "Initial commit - Krunker Clone ready for Render deployment"

echo.
echo ========================================
echo Git setup complete! ✓
echo.
echo Next steps:
echo 1. Create a GitHub repository at github.com
echo 2. Run the following commands (replace YOUR_USERNAME):
echo    git remote add origin https://github.com/YOUR_USERNAME/krunker-clone.git
echo    git push -u origin main
echo 3. Deploy to Render at render.com
echo.
echo See RENDER_QUICK_DEPLOY.md for detailed instructions
echo ========================================
pause 