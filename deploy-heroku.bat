@echo off
echo ========================================
echo    Heroku Deployment Script
echo ========================================
echo.

echo Step 1: Building the project...
npm run build

echo.
echo Step 2: Adding files to git...
git add .

echo.
echo Step 3: Committing changes...
git commit -m "Deploy to Heroku - %date% %time%"

echo.
echo Step 4: Deploying to Heroku...
echo If this is your first time, you'll need to:
echo 1. Install Heroku CLI from: https://devcenter.heroku.com/articles/heroku-cli
echo 2. Run: heroku login
echo 3. Run: heroku create your-app-name
echo.
echo Press any key to continue with deployment...
pause

git push heroku main

echo.
echo ========================================
echo Deployment complete!
echo.
echo To open your app:
echo heroku open
echo.
echo To view logs:
echo heroku logs --tail
echo ======================================== 