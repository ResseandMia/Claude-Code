# AntibodySystem Branded Document Generator - Distribution Package

**Version**: 1.0.0
**Release Date**: November 20, 2025
**License**: Proprietary - AntibodySystem SAS

## What's Included

This package contains a complete branded document generation system for AntibodySystem, featuring:

- ✅ **4 Professional Document Templates** (Letterhead, Report, Proposal, Presentation)
- ✅ **Command-Line Interface** for easy document generation
- ✅ **Claude AI Integration** via Model Context Protocol (MCP)
- ✅ **Node.js API** for programmatic usage
- ✅ **Brand Configuration System** for consistent styling
- ✅ **Example Documents** and data templates
- ✅ **Comprehensive Documentation**
- ✅ **Claude Code Skill** for AI-assisted document generation

## Quick Installation

### Prerequisites

- **Node.js** >= 16.0.0 ([Download](https://nodejs.org/))
- **npm** >= 7.0.0 (comes with Node.js)
- **Operating System**: Linux, macOS, or Windows

### Installation Steps

1. **Extract the package** to your desired location:
   ```bash
   unzip antibodysystem-branded-docs-v1.0.0.zip
   # or
   tar -xzf antibodysystem-branded-docs-v1.0.0.tar.gz
   ```

2. **Navigate to the directory**:
   ```bash
   cd branded-docs
   ```

3. **Run the installation script**:
   ```bash
   chmod +x INSTALL.sh
   ./INSTALL.sh
   ```

   Or install manually:
   ```bash
   npm install
   mkdir -p data output
   ```

4. **Verify installation**:
   ```bash
   node src/cli.js list
   ```

   You should see a list of available templates.

## Quick Start

### Generate Your First Document

```bash
# 1. Create a template file
node src/cli.js template letterhead data/my-first-letter.json

# 2. Edit the JSON file with your content
nano data/my-first-letter.json
# or use your favorite editor

# 3. Generate the PDF
node src/cli.js generate letterhead data/my-first-letter.json output/my-first-letter.pdf

# 4. View your PDF
open output/my-first-letter.pdf
# or: xdg-open output/my-first-letter.pdf (Linux)
```

### Generate All Examples

```bash
npm run examples:all
```

This will create 4 example PDFs in the `output/` directory:
- `letterhead-example.pdf`
- `report-example.pdf`
- `proposal-example.pdf`
- `presentation-example.pdf`

## Package Contents

```
branded-docs/
├── config/
│   └── brand.config.js          # Brand identity configuration
├── templates/
│   ├── letterhead/              # Letterhead template
│   ├── report/                  # Technical report template
│   ├── proposal/                # Business proposal template
│   └── slides/                  # Presentation template
├── src/
│   ├── generators/              # PDF generation engine
│   ├── utils/                   # Helper utilities
│   ├── cli.js                   # Command-line interface
│   └── mcp-server.js            # Claude MCP server
├── examples/
│   └── data/                    # Example data files
├── data/                        # Your data files (you create these)
├── output/                      # Generated PDFs (auto-created)
├── .claude-skill/
│   └── branded-docs.md          # Claude Code skill definition
├── INSTALL.sh                   # Automated installation script
├── README.md                    # Complete documentation
├── QUICK-START.md               # Quick start guide
├── USAGE-GUIDE.md               # Detailed usage guide
├── INSTALLATION.md              # Troubleshooting guide
├── PROJECT-SUMMARY.md           # Project overview
└── package.json                 # Node.js dependencies
```

## Usage Modes

### 1. Command-Line Interface (CLI)

Perfect for automation and scripting:

```bash
# List templates
node src/cli.js list

# Create data template
node src/cli.js template <type> <output-file>

# Generate PDF
node src/cli.js generate <type> <data-file> <output-file>

# Show help
node src/cli.js help
```

**Template Types**: `letterhead`, `report`, `proposal`, `presentation`

### 2. Claude AI Integration (MCP Server)

Use natural language to generate documents:

**Setup for Claude Desktop**:
1. Copy `src/mcp-server.js` configuration to Claude Desktop
2. Add to `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "branded-docs": {
         "command": "node",
         "args": ["/path/to/branded-docs/src/mcp-server.js"]
       }
     }
   }
   ```
3. Restart Claude Desktop

**Then ask Claude**:
> "Generate a professional quotation letter for Dr. Sarah Johnson at BioPharma Research regarding our recombinant antibody products. Make it from Dr. Marie Dupont in Sales."

Claude will create the data file and generate the PDF automatically.

### 3. Claude Code Skill

For Claude Code users (CLI or Web):

**Installation**:
```bash
# Copy the skill to your project
cp .claude-skill/branded-docs.md /path/to/your-project/.claude/skills/

# Or create a global skill (recommended)
mkdir -p ~/.claude/skills
cp .claude-skill/branded-docs.md ~/.claude/skills/
```

**Usage**:
Simply ask Claude Code to generate branded documents:
> "Create a technical report about Q4 antibody production using the branded-docs system"

Claude Code will use the skill to guide proper document generation.

### 4. Node.js API (Programmatic)

Integrate into your applications:

```javascript
const PDFGenerator = require('./src/generators/pdf-generator');

const generator = new PDFGenerator();
await generator.init();

// Generate letterhead
const data = {
  DATE: "November 20, 2025",
  RECIPIENT_NAME: "Dr. Sarah Johnson",
  SUBJECT: "Quotation Request",
  BODY_CONTENT: "Thank you for your inquiry...",
  SENDER_NAME: "Dr. Marie Dupont",
  SENDER_TITLE: "Sales Director"
};

await generator.generateLetterhead(data, 'output/letter.pdf');
await generator.close();
```

## Document Types

| Type | Use Case | Key Features |
|------|----------|--------------|
| **Letterhead** | Business correspondence | Professional header, contact info, formal layout |
| **Report** | Technical documentation | Cover page, TOC, sections, page numbers |
| **Proposal** | Business proposals | Diagonal design, benefits, timeline, pricing |
| **Presentation** | Slide decks | Title slides, content layouts, statistics |

## Brand Guidelines

All documents automatically include:

- **Company Logo**: Y-shaped antibody symbol
- **Color Scheme**: Red (#ED1C24), Blue (#5B8FCE), Cyan (#4FC3F7)
- **Typography**: Modern sans-serif (Segoe UI/Roboto)
- **Contact Info**: Paris office details
- **Professional Tone**: Scientific and courteous

Customization is available through `config/brand.config.js`.

## Documentation

| File | Description |
|------|-------------|
| `README.md` | Complete reference with all features and API |
| `QUICK-START.md` | 3-step getting started guide |
| `USAGE-GUIDE.md` | Detailed field descriptions for each template |
| `INSTALLATION.md` | Troubleshooting and platform-specific instructions |
| `PROJECT-SUMMARY.md` | High-level overview of the system |

## Examples

Example data files are provided in `examples/data/`:
- `letterhead-example.json` - Quotation letter
- `report-example.json` - Technical report
- `proposal-example.json` - Business proposal
- `presentation-example.json` - Presentation slides

Generate them all:
```bash
npm run examples:all
```

## Troubleshooting

### Common Issues

**"Puppeteer not found"**:
```bash
npm install puppeteer
```

**"Cannot find module"**:
```bash
npm install
```

**"Permission denied"**:
```bash
chmod +x INSTALL.sh
```

**PDF not generating**:
- Check Node.js version: `node -v` (must be >= 16)
- Check output directory exists: `mkdir -p output`
- Check data file is valid JSON: `node -e "require('./data/yourfile.json')"`

**Chromium issues on Linux**:
```bash
# Install dependencies
sudo apt-get install -y libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 \
  libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 \
  libpangocairo-1.0-0 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0
```

See `INSTALLATION.md` for detailed troubleshooting.

## System Requirements

### Minimum Requirements
- **CPU**: 1 GHz processor
- **RAM**: 512 MB available
- **Disk**: 500 MB free space
- **Node.js**: 16.0.0 or higher
- **Internet**: Required for initial installation (Puppeteer downloads Chromium)

### Recommended
- **CPU**: Dual-core 2 GHz+
- **RAM**: 2 GB available
- **Disk**: 1 GB free space
- **Node.js**: 18.0.0 or higher (LTS)

### Supported Platforms
- ✅ Linux (Ubuntu, Debian, CentOS, etc.)
- ✅ macOS (10.13+)
- ✅ Windows (10/11, with WSL2 or native)
- ✅ Docker containers
- ✅ Cloud platforms (Heroku, AWS Lambda, Google Cloud Functions, Render)

## Performance

- **Letterhead**: ~2-3 seconds per document
- **Report**: ~3-5 seconds per document
- **Proposal**: ~3-4 seconds per document
- **Presentation**: ~4-6 seconds per document
- **Batch Generation**: Parallel processing supported

## Security Notes

- No external API calls during PDF generation
- All processing happens locally
- No data is sent to external servers
- Safe for confidential business documents

## Updates and Support

This is version 1.0.0 of the branded document generator.

For issues, questions, or customization requests:
- **Email**: order@antibodysystem.com
- **Internal**: Contact the development team

## License

Proprietary software for AntibodySystem SAS.
All rights reserved. © 2025 AntibodySystem SAS

---

## Next Steps

1. ✅ **Run the installation**: `./INSTALL.sh`
2. ✅ **Generate examples**: `npm run examples:all`
3. ✅ **Review examples**: Check `output/` directory
4. ✅ **Read documentation**: Start with `QUICK-START.md`
5. ✅ **Create your first document**: Follow the Quick Start guide
6. ✅ **Set up Claude integration** (optional): Configure MCP server or Claude Code skill

**Ready to generate professional documents!** 🎉

For detailed instructions, see `README.md`.

---

*Thank you for using the AntibodySystem Branded Document Generator.*
