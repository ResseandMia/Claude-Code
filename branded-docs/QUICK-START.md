# 🚀 Quick Start Guide

Get up and running with AntibodySystem Branded Document Generator in minutes!

## Step 1: Install Dependencies

```bash
cd branded-docs
npm install
```

This installs Puppeteer and other required packages.

## Step 2: Choose Your Method

### Method A: Use Pre-made Examples (Fastest!)

Generate example documents to see what's possible:

```bash
# Generate a letterhead example
npm run example:letterhead

# Generate all examples at once
npm run examples:all
```

Check `output/` folder for your PDFs!

### Method B: Create Your Own Document

#### Create a data template:

```bash
node src/cli.js template letterhead data/my-first-letter.json
```

#### Edit the JSON file:

Open `data/my-first-letter.json` and fill in your details:

```json
{
  "RECIPIENT_NAME": "Dr. John Smith",
  "SUBJECT": "Welcome to AntibodySystem",
  "BODY_CONTENT": "We are pleased to introduce...",
  "SENDER_NAME": "Marie Dupont"
}
```

#### Generate your PDF:

```bash
node src/cli.js generate letterhead data/my-first-letter.json output/my-letter.pdf
```

Done! Check `output/my-letter.pdf`

## Step 3: Explore More

### List all available templates:

```bash
node src/cli.js list
```

### Try other document types:

```bash
# Technical Report
node src/cli.js template report data/my-report.json
node src/cli.js generate report data/my-report.json output/report.pdf

# Business Proposal
node src/cli.js template proposal data/my-proposal.json
node src/cli.js generate proposal data/my-proposal.json output/proposal.pdf

# Presentation Slides
node src/cli.js template presentation data/my-slides.json
node src/cli.js generate presentation data/my-slides.json output/slides.pdf
```

## 🤖 Bonus: Claude AI Integration

### Install as MCP Server

1. Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "antibodysystem-docs": {
      "command": "node",
      "args": ["/absolute/path/to/branded-docs/src/mcp-server.js"]
    }
  }
}
```

2. Restart Claude Desktop

3. Ask Claude to generate documents:

```
"Generate a professional letterhead for Dr. Sarah Johnson
at Global BioPharma about our new antibody products"
```

Claude will create the document automatically!

## 📁 File Structure

```
branded-docs/
├── data/              ← Your data files (JSON)
├── output/            ← Generated PDFs appear here
├── examples/          ← Example data files
│   └── data/
└── templates/         ← HTML templates
```

## 💡 Pro Tips

1. **Batch Generation**: Create multiple JSON files and generate all at once
2. **Reusable Templates**: Save commonly-used data as templates
3. **Version Control**: Keep your JSON data files in git
4. **Automation**: Use npm scripts for frequently-generated documents

## 🆘 Need Help?

- 📖 Read the full [README.md](./README.md)
- 📧 Email: order@antibodysystem.com
- 🌐 Visit: www.antibodysystem.com

---

**Happy document generating!** 🎉
