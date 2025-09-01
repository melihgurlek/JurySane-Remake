#!/bin/bash
# Unix setup script for JurySane

set -e

echo "Setting up JurySane development environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

# Setup backend
echo "Setting up backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -e .[dev]
cd ..

# Setup frontend
echo "Setting up frontend..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development servers:"
echo "  Backend:  python scripts/dev.py backend"
echo "  Frontend: python scripts/dev.py frontend"
echo "  Both:     python scripts/dev.py full"
echo ""
echo "Don't forget to set up your .env file in the backend directory!"
