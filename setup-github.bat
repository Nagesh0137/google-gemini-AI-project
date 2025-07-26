@echo off
echo =========================================
echo     GitHub Repository Setup Guide
echo =========================================
echo.

echo 1. First, create a new repository on GitHub:
echo    - Go to https://github.com/new
echo    - Repository name: gemini-ai-clone
echo    - Description: A clean, user-friendly Gemini AI clone with API integration
echo    - Make it Public (recommended)
echo    - DO NOT initialize with README, .gitignore, or license (we already have these)
echo    - Click 'Create repository'
echo.

echo 2. Copy the repository URL from GitHub (it will look like):
echo    https://github.com/YOUR_USERNAME/gemini-ai-clone.git
echo.

echo 3. Replace YOUR_USERNAME below and run these commands:
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/gemini-ai-clone.git
echo    git branch -M main
echo    git push -u origin main
echo.

echo 4. If you get authentication issues, you may need to:
echo    - Generate a Personal Access Token on GitHub
echo    - Use: git config --global credential.helper manager
echo    - Or use GitHub Desktop for easier authentication
echo.

echo =========================================
echo Your local repository is ready to push!
echo Total files: 10
echo Total lines of code: 2,696
echo =========================================
echo.

set /p username="Enter your GitHub username: "
if "%username%"=="" (
    echo Please enter a valid username.
    pause
    exit /b
)

echo.
echo Setting up remote repository with username: %username%
git remote add origin https://github.com/%username%/gemini-ai-clone.git
git branch -M main

echo.
echo Ready to push! Run this command when your GitHub repo is created:
echo git push -u origin main
echo.
pause
