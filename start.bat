@echo off
echo ========================================
echo    Gemini AI Clone Development Server
echo ========================================
echo.

REM Check if Node.js is available
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starting server with Node.js...
    npx http-server -p 8000 -c-1 -o
    goto :eof
)

REM Check if Python is available
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starting server with Python...
    python -m http.server 8000
    goto :eof
)

REM Check if Python3 is available
where python3 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starting server with Python3...
    python3 -m http.server 8000
    goto :eof
)

echo ========================================
echo ERROR: No suitable server found!
echo.
echo Please install one of the following:
echo   - Node.js (recommended)
echo   - Python 3.x
echo.
echo Or manually open index.html in your browser
echo ========================================
pause
