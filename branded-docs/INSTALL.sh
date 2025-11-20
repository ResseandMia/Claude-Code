#!/bin/bash

# AntibodySystem Branded Document Generator - Installation Script
# This script sets up the branded-docs system for use

set -e

echo "=================================================="
echo "  AntibodySystem Branded Document Generator"
echo "  Installation Script"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for Node.js
echo "Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "  Please install Node.js >= 16.0.0 from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo -e "${RED}✗ Node.js version is too old (requires >= 16.0.0)${NC}"
    echo "  Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) found${NC}"

# Check for npm
echo "Checking for npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v) found${NC}"

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi

# Create required directories
echo ""
echo "Creating required directories..."
mkdir -p data output
echo -e "${GREEN}✓ Directories created${NC}"

# Test the installation
echo ""
echo "Testing installation..."
if node src/cli.js list &> /dev/null; then
    echo -e "${GREEN}✓ CLI is working${NC}"
else
    echo -e "${RED}✗ CLI test failed${NC}"
    exit 1
fi

# Generate example documents
echo ""
echo "Do you want to generate example documents? (y/n)"
read -r GENERATE_EXAMPLES

if [ "$GENERATE_EXAMPLES" = "y" ] || [ "$GENERATE_EXAMPLES" = "Y" ]; then
    echo "Generating example documents..."
    npm run examples:all

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Example documents generated in output/ directory${NC}"
    else
        echo -e "${YELLOW}⚠ Some examples may have failed${NC}"
    fi
fi

# Installation complete
echo ""
echo "=================================================="
echo -e "${GREEN}✓ Installation Complete!${NC}"
echo "=================================================="
echo ""
echo "Quick Start:"
echo "  1. List available templates:"
echo "     node src/cli.js list"
echo ""
echo "  2. Create a data template:"
echo "     node src/cli.js template letterhead data/my-letter.json"
echo ""
echo "  3. Generate a PDF:"
echo "     node src/cli.js generate letterhead data/my-letter.json output/my-letter.pdf"
echo ""
echo "Documentation:"
echo "  - README.md          - Complete documentation"
echo "  - QUICK-START.md     - Quick start guide"
echo "  - USAGE-GUIDE.md     - Detailed usage instructions"
echo ""
echo "Example files are in: examples/data/"
echo "Your data files go in: data/"
echo "Generated PDFs go in: output/"
echo ""
echo "For Claude Code users:"
echo "  The skill file is in: .claude-skill/branded-docs.md"
echo "  Copy it to your project's .claude/skills/ directory"
echo ""
echo "Happy document generating!"
echo ""
