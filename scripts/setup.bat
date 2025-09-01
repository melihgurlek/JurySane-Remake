@echo off
REM Windows setup script for JurySane

echo Setting up JurySane development environment...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    exit /b 1
)

REM Setup backend
echo Setting up backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -e .[dev]
cd ..

REM Setup frontend
echo Setting up frontend...
cd frontend
npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo To start development servers:
echo   Backend:  python scripts/dev.py backend
echo   Frontend: python scripts/dev.py frontend
echo   Both:     python scripts/dev.py full
echo.
echo Don't forget to set up your .env file in the backend directory!

pause
