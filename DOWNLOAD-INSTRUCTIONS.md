# 📦 AntibodySystem Branded Document Generator - Download & Install

**Version**: 1.0.0
**Release Date**: November 20, 2025

## 🎉 What You Get

A complete AI-powered branded document generation system featuring:

- ✅ **4 Professional Templates**: Letterhead, Reports, Proposals, Presentations
- ✅ **Claude AI Integration**: Generate documents with natural language
- ✅ **Command-Line Interface**: Easy automation
- ✅ **Brand Consistency**: Automatic AntibodySystem styling
- ✅ **High-Quality PDFs**: Print-ready output

---

## 📥 Download Options

### Option 1: Direct Download from Repository

```bash
# Clone the repository (if you have git access)
git clone <repository-url>
cd Claude-Code

# The distribution files are in the root directory:
# - antibodysystem-branded-docs-v1.0.0.tar.gz (Linux/macOS)
# - antibodysystem-branded-docs-v1.0.0.zip (Windows)
```

### Option 2: Download Distribution Files

The distribution packages are located in the repository root:

**For Linux/macOS**:
- File: `antibodysystem-branded-docs-v1.0.0.tar.gz`
- Size: 42 KB
- SHA256: `a4e926d03106567223e901a1e36cd70dccb074d908d13edc45676dbead08aa37`

**For Windows**:
- File: `antibodysystem-branded-docs-v1.0.0.zip`
- Size: 59 KB
- SHA256: `de1ae0c9e449e5b709be2673d64c6ee93cae67b491e5cb620914e6a9d375e31b`

### Option 3: Use the Source Directly

```bash
# Navigate to the branded-docs directory
cd branded-docs

# Install dependencies
npm install

# Start using it!
node src/cli.js list
```

---

## 🚀 Quick Installation

### Step 1: Extract the Package

**Linux/macOS**:
```bash
tar -xzf antibodysystem-branded-docs-v1.0.0.tar.gz
cd antibodysystem-branded-docs-v1.0.0
```

**Windows**:
```bash
unzip antibodysystem-branded-docs-v1.0.0.zip
cd antibodysystem-branded-docs-v1.0.0
```

Or right-click → "Extract All" in Windows Explorer.

### Step 2: Run the Installer

**Automatic (Recommended)**:
```bash
chmod +x INSTALL.sh
./INSTALL.sh
```

**Manual**:
```bash
npm install
mkdir -p data output
```

### Step 3: Verify Installation

```bash
node src/cli.js list
```

You should see:
```
Available templates:
  - letterhead
  - report
  - proposal
  - presentation
```

---

## 🎯 Quick Start Guide

### Generate Your First Document in 3 Steps

```bash
# 1. Create a data template
node src/cli.js template letterhead data/my-letter.json

# 2. Edit the JSON file with your content
nano data/my-letter.json

# 3. Generate the PDF
node src/cli.js generate letterhead data/my-letter.json output/my-letter.pdf
```

### Or Generate All Examples

```bash
npm run examples:all
```

Check the `output/` directory for generated PDFs!

---

## 🤖 Claude AI Integration

### For Claude Code Users

**Install the Skill**:
```bash
# Copy the skill to your project
cp .claude-skill/branded-docs.md /your/project/.claude/skills/

# Or install globally
mkdir -p ~/.claude/skills
cp .claude-skill/branded-docs.md ~/.claude/skills/
```

**Then ask Claude Code**:
> "Generate a professional quotation letter for Dr. Sarah Johnson using the branded-docs system"

### For Claude Desktop Users

**Configure MCP Server**:

Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "branded-docs": {
      "command": "node",
      "args": ["/absolute/path/to/branded-docs/src/mcp-server.js"]
    }
  }
}
```

**Then ask Claude**:
> "Create a technical report about Q4 antibody production for AntibodySystem"

---

## 📚 Documentation

Inside the package you'll find:

| File | Description |
|------|-------------|
| `DISTRIBUTION-README.md` | **START HERE** - Quick installation and overview |
| `README.md` | Complete reference with all features |
| `QUICK-START.md` | 3-step getting started guide |
| `USAGE-GUIDE.md` | Detailed field descriptions |
| `INSTALLATION.md` | Troubleshooting guide |
| `PROJECT-SUMMARY.md` | Architecture overview |
| `DISTRIBUTION-MANIFEST.md` | Package contents and checksums |

---

## 🔧 System Requirements

**Minimum**:
- Node.js >= 16.0.0
- npm >= 7.0.0
- 500 MB disk space

**Recommended**:
- Node.js 18+ (LTS)
- 2 GB RAM
- 1 GB disk space

**Supported Platforms**:
- ✅ Linux (Ubuntu, Debian, CentOS, etc.)
- ✅ macOS (10.13+)
- ✅ Windows (10/11)
- ✅ Docker
- ✅ Cloud platforms

---

## 📝 Document Types

| Type | Purpose | Generation Time |
|------|---------|----------------|
| **Letterhead** | Business correspondence, quotations | ~2-3 seconds |
| **Report** | Technical documentation, research reports | ~3-5 seconds |
| **Proposal** | Business proposals, project bids | ~3-4 seconds |
| **Presentation** | Slide decks, client presentations | ~4-6 seconds |

All documents feature:
- 🎨 Automatic AntibodySystem branding
- 🌈 Consistent color scheme (Red, Blue, Cyan)
- 📱 Professional typography
- 📧 Contact information
- 🖼️ Company logo

---

## 🔒 Security & Privacy

- ✅ **All processing is local** - No external API calls
- ✅ **No data transmission** - Everything stays on your machine
- ✅ **Safe for confidential documents** - Enterprise-ready
- ✅ **No telemetry** - Your data is private

---

## 📊 Package Contents Summary

- **21 files** total
- **~6,150 lines** of code and documentation
- **4 HTML templates** with embedded CSS
- **4 example documents** with sample data
- **1 Claude Code skill** for AI integration
- **1 MCP server** for Claude Desktop
- **7 documentation files**
- **1 automated installer**

---

## 🆘 Troubleshooting

**"Command not found: node"**
- Install Node.js from https://nodejs.org/

**"Cannot find module 'puppeteer'"**
```bash
npm install
```

**"Permission denied" (Linux/macOS)**
```bash
chmod +x INSTALL.sh
./INSTALL.sh
```

**PDF not generating**
- Check Node version: `node -v` (must be >= 16)
- Verify installation: `node src/cli.js list`
- Check output directory: `ls -la output/`

For more help, see `INSTALLATION.md` in the package.

---

## 🎓 Learning Path

1. **Day 1**: Install and generate examples
2. **Day 2**: Create your first custom letterhead
3. **Day 3**: Generate a technical report
4. **Day 4**: Try the Claude AI integration
5. **Day 5**: Automate document generation with scripts

---

## 📞 Support

**Questions or Issues?**
- Email: order@antibodysystem.com
- Internal: Contact the development team

**Found a bug?**
- Include: Error message, Node.js version, platform
- Attach: The data file causing the issue (if applicable)

---

## 📦 File Verification

Verify package integrity:

```bash
# Check SHA256 checksums
sha256sum antibodysystem-branded-docs-v1.0.0.tar.gz
# Should output: a4e926d03106567223e901a1e36cd70dccb074d908d13edc45676dbead08aa37

sha256sum antibodysystem-branded-docs-v1.0.0.zip
# Should output: de1ae0c9e449e5b709be2673d64c6ee93cae67b491e5cb620914e6a9d375e31b
```

---

## 🚀 Next Steps

After installation:

1. ✅ Generate examples: `npm run examples:all`
2. ✅ Review output PDFs in `output/` directory
3. ✅ Read `QUICK-START.md`
4. ✅ Create your first document
5. ✅ Install Claude Code skill (optional)
6. ✅ Set up Claude Desktop MCP (optional)
7. ✅ Integrate into your workflow

---

## 📜 License

Proprietary software for AntibodySystem SAS.
All rights reserved. © 2025 AntibodySystem SAS

**For internal use and authorized clients only.**

---

## 🎉 Ready to Go!

You now have everything you need to generate professional, branded documents for AntibodySystem.

**Start with**:
```bash
./INSTALL.sh
npm run examples:all
```

**Happy document generating!** 📄✨

---

*For detailed instructions, see `DISTRIBUTION-README.md` inside the package.*
