# 📖 Usage Guide

Complete guide to using the AntibodySystem Branded Document Generator.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Data File Format](#data-file-format)
3. [Document Types](#document-types)
4. [Advanced Usage](#advanced-usage)
5. [Claude AI Integration](#claude-ai-integration)
6. [Best Practices](#best-practices)

---

## Basic Usage

### Creating Your First Document

#### Step 1: Create a data template

```bash
node src/cli.js template letterhead data/my-letter.json
```

This creates a JSON file with all the placeholder fields you need to fill in.

#### Step 2: Edit the data file

Open `data/my-letter.json` and replace placeholders with your actual content:

```json
{
  "DATE": "November 20, 2025",
  "RECIPIENT_NAME": "Dr. John Smith",
  "RECIPIENT_TITLE": "Research Director",
  "RECIPIENT_COMPANY": "BioPharma Inc.",
  "RECIPIENT_ADDRESS": "123 Science Park, Boston, MA",
  "SUBJECT": "Quotation for Antibody Products",
  "BODY_CONTENT": "Thank you for your inquiry...",
  "SENDER_NAME": "Marie Dupont",
  "SENDER_TITLE": "Sales Director"
}
```

#### Step 3: Generate the PDF

```bash
node src/cli.js generate letterhead data/my-letter.json output/my-letter.pdf
```

Your PDF is ready in the `output/` folder!

---

## Data File Format

All documents use JSON format for data. Each document type has specific required and optional fields.

### Common Fields (All Documents)

```json
{
  "DATE": "November 20, 2025"  // Auto-generated if omitted
}
```

### Letterhead Fields

**Required:**
- `RECIPIENT_NAME` - Name of recipient
- `SUBJECT` - Letter subject line
- `BODY_CONTENT` - Main letter content
- `SENDER_NAME` - Name of sender

**Optional:**
- `RECIPIENT_TITLE` - Job title
- `RECIPIENT_COMPANY` - Company name
- `RECIPIENT_ADDRESS` - Full address
- `SENDER_TITLE` - Sender's job title
- `DATE` - Letter date (auto-generated if omitted)

### Report Fields

**Required:**
- `REPORT_TITLE` - Main title
- `AUTHOR` - Report author
- `EXECUTIVE_SUMMARY` - Summary text

**Optional:**
- `REPORT_TYPE` - Type of report (default: "Technical Report")
- `REPORT_SUBTITLE` - Subtitle
- `REFERENCE` - Reference number (auto-generated if omitted)
- `INTRODUCTION` - Introduction section
- `BACKGROUND` - Background information
- `OBJECTIVE_1/2/3` - List of objectives
- `METHODOLOGY` - Methodology description
- `RESULTS_ANALYSIS` - Results section
- `CONCLUSION` - Conclusion
- Plus fields for tables, parameters, etc.

### Proposal Fields

**Required:**
- `PROPOSAL_TITLE` - Main title
- `CLIENT_NAME` - Client contact name
- `EXECUTIVE_SUMMARY` - Summary

**Optional:**
- `PROPOSAL_SUBTITLE` - Subtitle
- `CLIENT_COMPANY` - Client company
- `REFERENCE` - Reference number (auto-generated)
- `VALID_UNTIL` - Validity date (auto: +30 days)
- `WHY_CHOOSE` - Why choose us section
- `SOLUTION_OVERVIEW` - Solution description
- `BENEFIT_1/2/3_TITLE` - Benefit titles
- `BENEFIT_1/2/3_DESC` - Benefit descriptions
- `PHASE_1/2/3_NAME` - Timeline phases
- `PHASE_1/2/3_DESC` - Phase descriptions
- `PHASE_1/2/3_DURATION` - Phase durations
- Pricing table fields (ITEM, QTY, PRICE, etc.)

### Presentation Fields

**Required:**
- `PRESENTATION_TITLE` - Main title
- `PRESENTER_NAME` - Presenter name

**Optional:**
- `PRESENTATION_SUBTITLE` - Subtitle
- `AGENDA_ITEM_1/2/3/4/5` - Agenda items
- `SECTION_1/2_TITLE` - Section titles
- `SECTION_1_HEADING/CONTENT` - Content
- `COLUMN_1/2_TITLE/CONTENT` - Two-column layouts
- `STAT_1/2/3_NUMBER/LABEL` - Statistics
- `QUOTE_TEXT/AUTHOR` - Quote slides

---

## Document Types

### 1. Letterhead

**Best for:**
- Official correspondence
- Quotations
- Certificates
- Formal letters

**Example command:**
```bash
node src/cli.js generate letterhead data/letter.json output/letter.pdf
```

**Tips:**
- Keep body content concise (1-2 pages)
- Use proper salutations
- Include clear subject line
- Professional closing

### 2. Technical Report

**Best for:**
- Research reports
- Analysis documents
- White papers
- Technical documentation

**Example command:**
```bash
node src/cli.js generate report data/report.json output/report.pdf
```

**Tips:**
- Start with strong executive summary
- Use clear section headings
- Include data tables where relevant
- Provide comprehensive conclusion

### 3. Business Proposal

**Best for:**
- Project proposals
- RFP responses
- Partnership proposals
- Service quotations

**Example command:**
```bash
node src/cli.js generate proposal data/proposal.json output/proposal.pdf
```

**Tips:**
- Lead with benefits, not features
- Include clear pricing
- Show timeline/milestones
- Add compelling call-to-action

### 4. Presentation Slides

**Best for:**
- Conference presentations
- Sales pitches
- Company overview
- Product showcases

**Example command:**
```bash
node src/cli.js generate presentation data/slides.json output/slides.pdf
```

**Tips:**
- One main idea per slide
- Use visuals over text
- Include compelling statistics
- End with clear contact info

---

## Advanced Usage

### Batch Document Generation

Generate multiple documents at once:

```javascript
const PDFGenerator = require('./src/generators/pdf-generator');
const TemplateHelper = require('./src/utils/template-helper');

async function generateBatch() {
  const generator = new PDFGenerator();

  const documents = [
    {
      type: 'letterhead',
      data: await TemplateHelper.loadDataFromJSON('data/letter1.json'),
      outputPath: 'output/letter1.pdf'
    },
    {
      type: 'letterhead',
      data: await TemplateHelper.loadDataFromJSON('data/letter2.json'),
      outputPath: 'output/letter2.pdf'
    },
    {
      type: 'proposal',
      data: await TemplateHelper.loadDataFromJSON('data/proposal.json'),
      outputPath: 'output/proposal.pdf'
    }
  ];

  const results = await generator.generateBatch(documents);
  await generator.close();

  console.log('Generated:', results);
}

generateBatch();
```

### Custom Data Processing

```javascript
const TemplateHelper = require('./src/utils/template-helper');

// Load and modify data
const data = await TemplateHelper.loadDataFromJSON('data/template.json');

// Add computed fields
data.REFERENCE = TemplateHelper.generateReference('PROP');
data.TOTAL_PRICE = TemplateHelper.formatCurrency(15000);
data.VALID_UNTIL = TemplateHelper.getFutureDate(30);

// Save modified data
await TemplateHelper.saveDataToJSON('data/modified.json', data);
```

### Using npm Scripts

Add custom scripts to `package.json`:

```json
{
  "scripts": {
    "gen:letter": "node src/cli.js generate letterhead data/letter.json output/letter.pdf",
    "gen:monthly-report": "node src/cli.js generate report data/monthly.json output/monthly-report.pdf"
  }
}
```

Run with:
```bash
npm run gen:letter
npm run gen:monthly-report
```

---

## Claude AI Integration

### Setup

1. **Install MCP Server**

Add to `~/.config/claude/claude_desktop_config.json`:

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

2. **Restart Claude Desktop**

### Using with Claude

#### Natural Language Commands

Just ask Claude naturally:

```
"Generate a letterhead for Dr. Sarah Johnson at Global BioPharma
regarding our new monoclonal antibody series. The letter should be
from Dr. Marie Dupont and mention our Q4 products."
```

Claude will:
1. Extract the information
2. Format it correctly
3. Generate the PDF
4. Tell you where it's saved

#### Available Tools

Claude has access to these tools:

- `generate_letterhead` - Create letterhead
- `generate_report` - Create technical report
- `generate_proposal` - Create business proposal
- `generate_presentation` - Create slides
- `list_templates` - Show available templates
- `get_template_data` - Show data structure for a template

#### Example Prompts

```
"Create a technical report titled 'Q4 Quality Control Analysis'
authored by Dr. Jean-Pierre Martin about protein batch AB-2025-Q4"

"Generate a business proposal for Precision Therapeutics about
custom antibody development. Make it comprehensive with timeline
and pricing."

"Make presentation slides about AntibodySystem for a conference.
Title: 'Innovation in Recombinant Proteins'. Presenter: Marie Dupont"

"Show me what fields I need for a proposal template"
```

---

## Best Practices

### 1. Organize Your Data

```
data/
├── clients/
│   ├── client1-letter.json
│   ├── client1-proposal.json
│   └── client2-quote.json
├── reports/
│   ├── monthly-qc.json
│   └── annual-summary.json
└── presentations/
    └── conference-2025.json
```

### 2. Use Consistent Naming

```
YYYY-MM-DD-type-description.json
2025-11-20-letter-biopharm.json
2025-11-20-proposal-therapeutics.json
```

### 3. Version Control Your Data

```bash
git add data/important-proposal.json
git commit -m "Add proposal for BioPharma project"
```

### 4. Template Reuse

Save commonly-used configurations:

```bash
# Save as template
cp data/standard-quote.json data/templates/quote-template.json

# Use template
cp data/templates/quote-template.json data/new-quote.json
# Edit new-quote.json
```

### 5. Automate Recurring Documents

Create scripts for regular documents:

```bash
#!/bin/bash
# monthly-report.sh

DATE=$(date +%Y-%m-%d)
node src/cli.js generate report \
  data/monthly-qc.json \
  "output/qc-report-$DATE.pdf"
```

### 6. Quality Check

Always review generated PDFs:
- Check all data populated correctly
- Verify formatting looks professional
- Test print preview
- Ensure contact info is correct

---

## Troubleshooting

### Issue: PDF appears blank

**Solution:** Check that all required fields have values (not empty strings)

### Issue: Formatting looks wrong

**Solution:**
- Ensure JSON is valid (use jsonlint)
- Check for special characters (escape quotes: `\"`)
- Verify line breaks are `\n` in JSON

### Issue: Images not showing

**Solution:** This template uses inline SVG for logos (always works)

### Issue: Long text overflows

**Solution:**
- Keep body content under 1000 words for letterhead
- Break long reports into sections
- Use concise bullet points

---

## Next Steps

- 📖 Read the [README.md](./README.md) for complete reference
- 🎨 Customize [brand.config.js](./config/brand.config.js) for your brand
- 🔧 Modify [templates](./templates/) for custom layouts
- 🚀 Explore [examples](./examples/data/) for inspiration

---

**Need help?** Contact order@antibodysystem.com
