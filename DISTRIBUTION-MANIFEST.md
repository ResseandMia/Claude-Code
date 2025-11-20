# AntibodySystem Branded Document Generator - Distribution Manifest

**Version**: 1.0.0
**Build Date**: November 20, 2025
**Package Name**: antibodysystem-branded-docs-v1.0.0

## Distribution Files

This release includes two distribution formats:

1. **antibodysystem-branded-docs-v1.0.0.tar.gz** (42 KB)
   - For Linux/macOS users
   - Preserves file permissions and symlinks
   - Standard UNIX archive format

2. **antibodysystem-branded-docs-v1.0.0.zip** (59 KB)
   - For Windows users
   - Cross-platform compatibility
   - Easier extraction on Windows

Both archives contain identical content.

## Package Contents

### Core System

**Configuration**:
- `config/brand.config.js` - Brand identity, colors, fonts, company info

**Templates** (HTML + CSS):
- `templates/letterhead/letterhead.html` - Professional letterhead
- `templates/report/report.html` - Technical report with TOC
- `templates/proposal/proposal.html` - Business proposal with pricing
- `templates/slides/presentation.html` - Presentation slides

**Source Code**:
- `src/cli.js` - Command-line interface (206 lines)
- `src/generators/pdf-generator.js` - PDF generation engine (342 lines)
- `src/mcp-server.js` - Claude MCP server integration (415 lines)
- `src/utils/template-helper.js` - Template utilities (188 lines)

**Example Data**:
- `examples/data/letterhead-example.json` - Sample letterhead data
- `examples/data/report-example.json` - Sample report data
- `examples/data/proposal-example.json` - Sample proposal data
- `examples/data/presentation-example.json` - Sample presentation data

### Documentation

**User Documentation**:
- `DISTRIBUTION-README.md` - Primary distribution guide (quick start, installation)
- `README.md` - Complete system reference (487 lines)
- `QUICK-START.md` - 3-step getting started guide
- `USAGE-GUIDE.md` - Detailed field descriptions for each template
- `INSTALLATION.md` - Troubleshooting and platform-specific instructions
- `PROJECT-SUMMARY.md` - High-level overview and architecture

### Installation & Setup

**Installation Tools**:
- `INSTALL.sh` - Automated installation script (interactive)
- `package.json` - npm configuration and dependencies
- `.gitignore` - Git ignore rules (for version control integration)

**Configuration Examples**:
- `claude-mcp-config-example.json` - Claude Desktop MCP server config

### Claude Integration

**Claude Code Skill**:
- `.claude-skill/branded-docs.md` - Claude Code skill definition (440 lines)
  - Complete usage instructions for Claude AI
  - Document type guidelines
  - Best practices and patterns
  - Troubleshooting guide

### Directory Structure

The package creates the following directory structure after extraction:

```
antibodysystem-branded-docs-v1.0.0/
├── .claude-skill/           # Claude Code skill
├── assets/                  # Asset directory (currently empty)
│   └── images/
├── config/                  # Brand configuration
├── examples/                # Example data files
│   └── data/
├── src/                     # Source code
│   ├── generators/
│   └── utils/
├── templates/               # HTML templates
│   ├── letterhead/
│   ├── report/
│   ├── proposal/
│   └── slides/
├── data/                    # User data (created by install)
├── output/                  # Generated PDFs (created by install)
└── [documentation files]
```

## Installation Process

1. **Extract** the archive to desired location
2. **Run** `./INSTALL.sh` or `npm install`
3. **Verify** with `node src/cli.js list`
4. **Optional**: Generate examples with `npm run examples:all`

## Dependencies

**Runtime Dependencies**:
- **puppeteer** (^21.5.0) - PDF generation via headless Chrome
  - Automatically downloads Chromium (~200 MB) during installation

**System Requirements**:
- Node.js >= 16.0.0
- npm >= 7.0.0
- 500 MB disk space (includes Chromium)

**No other external dependencies** - fully self-contained system.

## Features Included

✅ **4 Professional Document Templates**
✅ **Command-Line Interface** (CLI)
✅ **Claude AI Integration** (MCP Server)
✅ **Claude Code Skill** (for AI-assisted generation)
✅ **Node.js API** (programmatic usage)
✅ **Brand Configuration System**
✅ **Example Documents & Data**
✅ **Comprehensive Documentation**
✅ **Automated Installation Script**
✅ **Cross-Platform Support** (Linux, macOS, Windows)

## Usage Modes

1. **CLI**: `node src/cli.js generate letterhead data/file.json output/file.pdf`
2. **Claude Desktop**: Natural language document requests via MCP
3. **Claude Code**: AI-assisted generation using the included skill
4. **Node.js**: `const generator = require('./src/generators/pdf-generator')`

## File Statistics

| Category | Files | Lines of Code |
|----------|-------|---------------|
| Source Code | 4 | ~1,150 |
| Templates | 4 | ~2,500 |
| Documentation | 7 | ~2,000 |
| Configuration | 2 | ~200 |
| Examples | 4 | ~300 |
| **Total** | **21** | **~6,150** |

## Package Integrity

**Checksum (SHA256)**:
```bash
# Verify with:
sha256sum antibodysystem-branded-docs-v1.0.0.tar.gz
# or
sha256sum antibodysystem-branded-docs-v1.0.0.zip
```

## What's NOT Included

The following are excluded from the distribution (for size and security):
- ❌ `node_modules/` - Install with `npm install`
- ❌ `.git/` - Version control history
- ❌ `output/*` - Generated PDFs (created during usage)
- ❌ `data/*` - User data files (created by user)

These will be created/installed automatically.

## License

Proprietary software for AntibodySystem SAS.
All rights reserved. © 2025 AntibodySystem SAS

**Restricted Distribution**: This package is for internal use and authorized clients only.

## Version History

### v1.0.0 (November 20, 2025)
- ✨ Initial release
- 4 document templates (letterhead, report, proposal, presentation)
- CLI interface
- Claude AI integration (MCP + Code skill)
- Complete documentation
- Example documents
- Automated installation

## Support

For issues, questions, or customization requests:
- **Email**: order@antibodysystem.com
- **Internal**: Development team

## Next Steps After Installation

1. ✅ Read `DISTRIBUTION-README.md` for quick start
2. ✅ Generate examples: `npm run examples:all`
3. ✅ Review examples in `output/` directory
4. ✅ Create your first document following `QUICK-START.md`
5. ✅ Install Claude Code skill (optional): Copy `.claude-skill/branded-docs.md` to your project
6. ✅ Configure Claude Desktop MCP (optional): Use `claude-mcp-config-example.json`

## Distribution Notes

**Archive Size**:
- Compressed: ~42-59 KB
- Extracted: ~200 KB (without node_modules)
- Full installation: ~250 MB (includes Chromium for Puppeteer)

**Extraction**:
```bash
# Linux/macOS (tar.gz)
tar -xzf antibodysystem-branded-docs-v1.0.0.tar.gz
cd antibodysystem-branded-docs-v1.0.0

# Windows (zip)
# Right-click → Extract All
# Or: unzip antibodysystem-branded-docs-v1.0.0.zip
# cd antibodysystem-branded-docs-v1.0.0
```

---

**Thank you for using AntibodySystem Branded Document Generator!**

For complete documentation, see `DISTRIBUTION-README.md` and `README.md` inside the package.
