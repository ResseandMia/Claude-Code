# 📦 Installation Guide

## Prerequisites

- **Node.js** 16.0.0 or higher
- **npm** 7.0.0 or higher

## Standard Installation

### Step 1: Install Dependencies

```bash
cd branded-docs
npm install
```

If Puppeteer downloads successfully, you're all set! Skip to [Quick Start](./QUICK-START.md).

## Alternative Installation (If Puppeteer Fails)

If you encounter Puppeteer/Chromium download errors, use one of these methods:

### Method 1: Skip Chromium Download (Use System Chrome)

```bash
# Set environment variable to skip download
export PUPPETEER_SKIP_DOWNLOAD=true

# Install dependencies
npm install

# Install puppeteer-core instead
npm uninstall puppeteer
npm install puppeteer-core
```

Then modify `src/generators/pdf-generator.js` to use your system Chrome:

```javascript
this.browser = await puppeteer.launch({
  headless: 'new',
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // Mac
  // executablePath: '/usr/bin/google-chrome', // Linux
  // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Windows
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

### Method 2: Use Docker

```bash
# Create Dockerfile in branded-docs/
cat > Dockerfile << 'EOF'
FROM node:18

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "src/cli.js", "help"]
EOF

# Build and run
docker build -t antibodysystem-docs .
docker run -v $(pwd)/output:/app/output antibodysystem-docs \
  node src/cli.js generate letterhead examples/data/letterhead-example.json output/letter.pdf
```

### Method 3: Use Cloud Environment

Deploy to platforms with pre-installed Chrome:

- **Heroku** - Use buildpacks for Puppeteer
- **AWS Lambda** - Use lambda-chrome layer
- **Google Cloud Functions** - Use Puppeteer in Cloud Functions
- **Render** - Supports Puppeteer out of the box

## Verification

Test your installation:

```bash
# Check Node.js version
node --version  # Should be >= 16.0.0

# Check npm version
npm --version   # Should be >= 7.0.0

# List available templates
node src/cli.js list

# Generate a test document (if Puppeteer installed correctly)
npm run example:letterhead
```

## Troubleshooting

### Error: "Chrome failed to start"

**Solution:** Use system Chrome or Docker (see methods above)

### Error: "Cannot find module 'puppeteer'"

**Solution:**
```bash
npm install
```

### Error: "EACCES: permission denied"

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### Error: "Download failed: 403"

**Solution:** Use `PUPPETEER_SKIP_DOWNLOAD=true` and system Chrome

## Platform-Specific Notes

### macOS

```bash
# Install Chrome if needed
brew install --cask google-chrome

# Use this path in pdf-generator.js:
executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```

### Linux (Ubuntu/Debian)

```bash
# Install Chrome
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Use this path:
executablePath: '/usr/bin/google-chrome'
```

### Windows

```bash
# Download Chrome from google.com/chrome

# Use this path:
executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
```

## Development Environment

For development or restricted networks:

```bash
# Install without downloading Chromium
PUPPETEER_SKIP_DOWNLOAD=true npm install

# Use local Chrome
export CHROME_PATH="/path/to/chrome"
```

## Need Help?

- 📖 Check [README.md](./README.md)
- 🚀 See [QUICK-START.md](./QUICK-START.md)
- 📧 Email: order@antibodysystem.com

---

Once installed, proceed to the [Quick Start Guide](./QUICK-START.md)!
