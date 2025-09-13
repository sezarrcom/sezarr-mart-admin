@echo off
echo 🚀 Deploying Sezarr Mart Admin Dashboard...

REM Check if git is initialized
if not exist ".git" (
    echo 📝 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit: Sezarr Mart Admin Dashboard"
    git branch -M main
    echo ✅ Git repository initialized
) else (
    echo 📝 Updating Git repository...
    git add .
    git commit -m "Update: Sezarr Mart Admin Dashboard - %date%"
    echo ✅ Git repository updated
)

echo.
echo 🎯 Next Steps:
echo 1. Create a new repository on GitHub
echo 2. Add remote origin: git remote add origin https://github.com/yourusername/sezarr-mart-admin.git
echo 3. Push code: git push -u origin main
echo 4. Deploy to Vercel: https://vercel.com
echo.
echo 📋 Environment Variables for Vercel:
echo DATABASE_URL=file:./production.db
echo NEXTAUTH_SECRET=sezarr-mart-admin-secret-2025
echo NEXTAUTH_URL=https://your-app-name.vercel.app
echo.
echo 🌟 Your team will access the dashboard at: https://your-app-name.vercel.app
echo ✅ Deployment preparation complete!
pause