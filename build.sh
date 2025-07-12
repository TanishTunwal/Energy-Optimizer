#!/bin/bash

# Renewable Energy Optimizer - Production Build Script
# This script builds and tests the complete application

set -e

echo "🚀 Starting Production Build Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "client" ] || [ ! -d "server" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install server dependencies
print_status "Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
print_status "Installing client dependencies..."
cd client
npm install
cd ..

echo "🔧 Building client application..."
cd client
npm run build
print_status "Client build completed"
cd ..

echo "🧪 Running basic tests..."

# Test if server can start
print_status "Testing server startup..."
cd server
timeout 10s npm start > /dev/null 2>&1 &
SERVER_PID=$!
sleep 5

# Test health endpoint
if curl -f -s http://localhost:5000/api/health > /dev/null; then
    print_status "Server health check passed"
else
    print_error "Server health check failed"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# Clean up
kill $SERVER_PID 2>/dev/null || true
cd ..

print_status "Production build completed successfully!"

echo ""
echo "🎉 Your Renewable Energy Optimizer is ready for production!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your production environment variables"
echo "2. Set up your production MongoDB database"
echo "3. Deploy the server to your hosting platform"
echo "4. Deploy the client build files to your web server"
echo ""
echo "📖 For detailed deployment instructions, see README_PRODUCTION.md"
