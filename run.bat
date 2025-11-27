@echo off
echo ==========================================
echo      Starting Tracker Application
echo ==========================================
echo.
echo Ensuring dependencies are installed...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing dependencies. Please check your Node.js installation.
    pause
    exit /b
)

echo.
echo Starting Development Server...
echo The application will open in your default browser shortly.
echo.

start http://localhost:5173
call npm run dev
