# AntibodySystem Branded Document Generator

🎨 **Professional document generation system** for creating branded PDFs, reports, proposals, and presentations that perfectly align with AntibodySystem's corporate identity.

![AntibodySystem](https://img.shields.io/badge/AntibodySystem-Branded%20Docs-ED1C24?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-green?style=for-the-badge)

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Usage](#-usage)
  - [Command Line Interface](#command-line-interface)
  - [Claude AI Integration](#claude-ai-integration)
  - [Programmatic Usage](#programmatic-usage)
- [Document Types](#-document-types)
- [Customization](#-customization)
- [Examples](#-examples)
- [Brand Guidelines](#-brand-guidelines)
- [API Reference](#-api-reference)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

- 🎨 **Professional Templates** - Letterhead, technical reports, business proposals, and presentation slides
- 🎯 **Brand Consistency** - All documents automatically use AntibodySystem's official colors, fonts, and logo
- 🚀 **Easy to Use** - Simple CLI, Claude AI integration, or Node.js API
- 📝 **Template-Based** - JSON data files make it easy to generate multiple documents
- 🔧 **Customizable** - Easily modify brand configuration and templates
- 📄 **High-Quality PDFs** - Production-ready documents with perfect formatting
- 🤖 **AI-Powered** - Integrate with Claude Code for intelligent document generation

---

## 🚀 Quick Start

### Generate your first document in 3 steps:

```bash
# 1. Install dependencies
cd branded-docs
npm install

# 2. Create a data template
node src/cli.js template letterhead data/my-letter.json

# 3. Generate PDF
node src/cli.js generate letterhead data/my-letter.json output/my-letter.pdf
```

**That's it!** Your professionally branded PDF is ready. ✅

---

## 📦 Installation

### Prerequisites

- **Node.js** 16.0.0 or higher
- **npm** 7.0.0 or higher

### Install Dependencies

```bash
cd branded-docs
npm install
```

This will install Puppeteer (for PDF generation) and other required dependencies.

---

## 🎯 Usage

### Command Line Interface

The CLI provides simple commands for document generation:

#### List Available Templates

```bash
node src/cli.js list
```

#### Create a Data Template

```bash
node src/cli.js template <type> <output-file>

# Examples:
node src/cli.js template letterhead data/my-letter.json
node src/cli.js template report data/my-report.json
node src/cli.js template proposal data/my-proposal.json
node src/cli.js template presentation data/my-slides.json
```

#### Generate a PDF

```bash
node src/cli.js generate <type> <data-file> <output-pdf>

# Examples:
node src/cli.js generate letterhead data/my-letter.json output/letter.pdf
node src/cli.js generate report data/my-report.json output/report.pdf
node src/cli.js generate proposal data/my-proposal.json output/proposal.pdf
node src/cli.js generate presentation data/my-slides.json output/slides.pdf
```

### Claude AI Integration

You can use Claude Code to generate documents with natural language:

#### Setup MCP Server (One-time)

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "antibodysystem-docs": {
      "command": "node",
      "args": ["/path/to/branded-docs/src/mcp-server.js"]
    }
  }
}
```

#### Using with Claude

Then ask Claude naturally:

```
"Generate a letterhead for Dr. Sarah Johnson at Global BioPharma
regarding our Q4 antibody products. The letter should be from
Dr. Marie Dupont and mention our new monoclonal antibody series."
```

Claude will use the `generate_letterhead` tool automatically!

### Programmatic Usage

```javascript
const PDFGenerator = require('./src/generators/pdf-generator');
const TemplateHelper = require('./src/utils/template-helper');

async function generateLetter() {
  const generator = new PDFGenerator();

  const data = {
    RECIPIENT_NAME: 'Dr. John Smith',
    SUBJECT: 'Product Inquiry',
    BODY_CONTENT: 'Thank you for your interest...',
    SENDER_NAME: 'Marie Dupont'
  };

  await generator.generateLetterhead(
    data,
    'output/letter.pdf'
  );

  await generator.close();
}

generateLetter();
```

---

## 📄 Document Types

### 1. Letterhead

**Use Cases:** Official correspondence, quotations, certificates, formal letters

**Key Features:**
- Red header with company branding
- Contact information prominently displayed
- Professional footer
- A4/Letter size compatible

**Required Fields:**
- `RECIPIENT_NAME`
- `SUBJECT`
- `BODY_CONTENT`
- `SENDER_NAME`

### 2. Technical Report

**Use Cases:** Research reports, analysis documents, white papers, technical documentation

**Key Features:**
- Professional cover page
- Table of contents
- Section headers with branding
- Data tables and info boxes
- Page numbering

**Required Fields:**
- `REPORT_TITLE`
- `AUTHOR`
- `EXECUTIVE_SUMMARY`

### 3. Business Proposal

**Use Cases:** Project proposals, RFP responses, partnership proposals, quotations

**Key Features:**
- Eye-catching cover with diagonal design
- Benefits sections
- Pricing tables
- Timeline visualization
- Call-to-action section

**Required Fields:**
- `PROPOSAL_TITLE`
- `CLIENT_NAME`
- `EXECUTIVE_SUMMARY`

### 4. Presentation Slides

**Use Cases:** Conference presentations, sales pitches, company overview, product showcases

**Key Features:**
- Title slide with branding
- Content slides with headers
- Two-column layouts
- Statistics/metrics display
- Quote slides
- Thank you slide

**Required Fields:**
- `PRESENTATION_TITLE`
- `PRESENTER_NAME`

---

## 🎨 Customization

### Brand Configuration

Edit `config/brand.config.js` to customize:

- **Colors** - Primary, secondary, accent colors
- **Typography** - Fonts, sizes, weights
- **Contact Info** - Phone, email, address
- **Logo** - SVG logo markup
- **Voice & Tone** - Brand personality guidelines

```javascript
// Example: Change primary color
colors: {
  primary: {
    red: '#ED1C24',  // ← Edit this
    redRGB: '237, 28, 36'
  }
}
```

### Template Modification

Templates are located in `templates/`:

- `templates/letterhead/letterhead.html`
- `templates/report/report.html`
- `templates/proposal/proposal.html`
- `templates/slides/presentation.html`

Edit the HTML/CSS to customize layouts, styles, and structure.

### Adding Custom Fields

1. Add placeholder to template: `{{CUSTOM_FIELD}}`
2. Add field to data JSON: `"CUSTOM_FIELD": "value"`
3. Generate PDF normally

---

## 📚 Examples

### Run Example Documents

```bash
# Generate all example documents
npm run examples:all

# Or generate individually
npm run example:letterhead
npm run example:report
npm run example:proposal
npm run example:presentation
```

Example data files are located in `examples/data/`:

- `letterhead-example.json`
- `report-example.json`
- `proposal-example.json`
- `presentation-example.json`

---

## 🎯 Brand Guidelines

### Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Red | `#ED1C24` | Headers, accents, CTAs |
| Secondary Blue | `#5B8FCE` | Supporting elements, gradients |
| Accent Cyan | `#4FC3F7` | Highlights, decorative elements |
| Dark Gray | `#3E3E3E` | Body text |
| Light Gray | `#E0E0E0` | Borders, backgrounds |

### Typography

- **Headings:** Segoe UI / Roboto (Bold, 700 weight)
- **Body Text:** Segoe UI / Roboto (Regular, 400 weight)
- **Accent:** Eurostile / Bank Gothic (for special headings)

### Logo Usage

- Minimum width: 120px
- Clear space: 20px around logo
- Always on white or red background

### Tone of Voice

- ✅ Professional and scientific
- ✅ Approachable and helpful
- ✅ Precise and accurate
- ✅ Innovation-focused

---

## 🔧 API Reference

### PDFGenerator Class

```javascript
const generator = new PDFGenerator();

// Initialize browser
await generator.init();

// Generate documents
await generator.generateLetterhead(data, outputPath);
await generator.generateReport(data, outputPath);
await generator.generateProposal(data, outputPath);
await generator.generatePresentation(data, outputPath);

// Batch generation
await generator.generateBatch([
  { type: 'letterhead', data: {...}, outputPath: '...' },
  { type: 'report', data: {...}, outputPath: '...' }
]);

// Clean up
await generator.close();
```

### TemplateHelper Class

```javascript
// Get default data structure
const data = TemplateHelper.getDefaultData('letterhead');

// Load from JSON
const data = await TemplateHelper.loadDataFromJSON('data.json');

// Save to JSON
await TemplateHelper.saveDataToJSON('data.json', data);

// Generate reference numbers
const ref = TemplateHelper.generateReference('PROP'); // PROP-2025-1234

// Format currency
const formatted = TemplateHelper.formatCurrency(1234.56); // € 1,234.56
```

---

## 🐛 Troubleshooting

### Puppeteer Installation Issues

If Puppeteer fails to install:

```bash
# Install with --ignore-scripts flag
npm install --ignore-scripts

# Then download Chromium manually
node node_modules/puppeteer/install.js
```

### PDF Generation Fails

- **Check file paths:** Ensure input JSON and output paths are correct
- **Validate JSON:** Use `jsonlint` to check JSON syntax
- **Check permissions:** Ensure write permissions for output directory

### Fonts Not Displaying Correctly

- Templates use web-safe fonts (Segoe UI, Roboto, Arial)
- If custom fonts needed, add `@font-face` to template CSS

### MCP Server Not Connecting

- Verify Node.js path in Claude configuration
- Check that `mcp-server.js` path is absolute
- Restart Claude Desktop after config changes

---

## 📞 Support

**AntibodySystem**
📧 Email: order@antibodysystem.com
📞 Phone: +33 1 75 44 64 23
🌐 Web: www.antibodysystem.com
📍 Address: 10 Avenue Kl ber, 75116 Paris, FRANCE

---

## 📝 License

MIT License - feel free to use and modify for your organization.

---

## 🙏 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 🗺️ Project Structure

```
branded-docs/
├── config/
│   └── brand.config.js          # Brand configuration
├── templates/
│   ├── letterhead/
│   │   └── letterhead.html      # Letterhead template
│   ├── report/
│   │   └── report.html          # Report template
│   ├── proposal/
│   │   └── proposal.html        # Proposal template
│   └── slides/
│       └── presentation.html    # Presentation template
├── src/
│   ├── generators/
│   │   └── pdf-generator.js     # PDF generation engine
│   ├── utils/
│   │   └── template-helper.js   # Helper utilities
│   ├── cli.js                   # Command-line interface
│   └── mcp-server.js            # Claude MCP server
├── examples/
│   └── data/                    # Example data files
├── output/                      # Generated PDFs
├── package.json
└── README.md
```

---

<div align="center">

**Made with ❤️ by AntibodySystem**

*Excellence in Recombinant Proteins & Antibodies*

</div>
