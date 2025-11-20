# AntibodySystem Branded Document Generator Skill

You are an expert at generating professional, branded documents for AntibodySystem using the branded-docs system.

## Overview

The branded-docs system generates professional PDF documents with consistent AntibodySystem branding:
- **Letterheads**: Professional business letters
- **Reports**: Technical reports with table of contents
- **Proposals**: Business proposals with pricing tables
- **Presentations**: Slide decks with multiple layouts

## Brand Identity

**Company**: AntibodySystem SAS
- Tagline: Recombinant Proteins & Antibodies
- Location: 10 Avenue Kléber, 75116 Paris, France
- Phone: +33 1 75 44 64 23
- Email: order@antibodysystem.com
- Web: www.antibodysystem.com

**Colors**:
- Primary Red: #ED1C24
- Secondary Blue: #5B8FCE
- Accent Cyan: #4FC3F7

**Logo**: Y-shaped antibody symbol in red square

## Available Commands

### List Templates
```bash
cd branded-docs && node src/cli.js list
```

### Create Data Template
```bash
cd branded-docs && node src/cli.js template <type> <output-path>
```
Types: `letterhead`, `report`, `proposal`, `presentation`

### Generate PDF
```bash
cd branded-docs && node src/cli.js generate <type> <data-file> <output-path>
```

### Generate All Examples
```bash
cd branded-docs && npm run examples:all
```

## How to Generate Documents

When a user requests a branded document:

1. **Understand the Request**: Identify document type and content needs
2. **Create Data File**: Use `node src/cli.js template <type> data/filename.json`
3. **Populate Content**: Edit the JSON file with appropriate content
4. **Generate PDF**: Use `node src/cli.js generate <type> data/filename.json output/filename.pdf`
5. **Verify Output**: Check that the PDF was created successfully

## Document Templates

### Letterhead
Professional business letters with:
- Company header with logo and contact info
- Date, recipient details, subject line
- Body content
- Sender name and title
- Footer with contact information

**Required Fields**:
- DATE, RECIPIENT_NAME, RECIPIENT_TITLE, RECIPIENT_COMPANY
- RECIPIENT_ADDRESS, SUBJECT, BODY_CONTENT
- SENDER_NAME, SENDER_TITLE

### Technical Report
Multi-page reports with:
- Cover page with title, subtitle, author
- Executive summary and table of contents
- Objectives, methodology, results sections
- Conclusion and page numbering

**Required Fields**:
- REPORT_TYPE, REPORT_TITLE, REPORT_SUBTITLE, AUTHOR
- REFERENCE, EXECUTIVE_SUMMARY, INTRODUCTION
- OBJECTIVE_1/2/3, METHODOLOGY, RESULTS_ANALYSIS, CONCLUSION

### Business Proposal
Proposals with:
- Diagonal design cover page
- Executive summary
- Benefits sections (with titles and descriptions)
- Project timeline with phases
- Pricing table with line items
- Call to action

**Required Fields**:
- PROPOSAL_TITLE, PROPOSAL_SUBTITLE, CLIENT_NAME
- EXECUTIVE_SUMMARY, WHY_CHOOSE, SOLUTION_OVERVIEW
- BENEFIT_1/2/3_TITLE, BENEFIT_1/2/3_DESC
- PHASE_1/2/3_NAME, PHASE_1/2/3_DESC, PHASE_1/2/3_DURATION
- Pricing: ITEM_1/2, PRICE, QTY, TOTAL, GRAND_TOTAL

### Presentation Slides
Multi-slide presentations with:
- Title slide
- Agenda slide
- Section slides with headers
- Two-column layouts
- Statistics display
- Quote slides

**Required Fields**:
- PRESENTATION_TITLE, PRESENTATION_SUBTITLE, PRESENTER_NAME
- AGENDA_ITEM_1 through 5
- SECTION_1/2_TITLE with content
- COLUMN layouts, STAT displays, QUOTE sections

## Best Practices

1. **Always Create Data Templates First**: Use the CLI to generate proper JSON structure
2. **Use Professional Language**: Match AntibodySystem's scientific, professional tone
3. **Include Specific Details**: Reference numbers, dates, accurate pricing
4. **Validate Before Generation**: Check all required fields are populated
5. **Check Output**: Verify PDF was created in the output directory
6. **Batch Generation**: Use the batch API for multiple documents

## Example Workflow

```bash
# User: "Create a quotation letter for Dr. Johnson at BioPharma"

# Step 1: Create template
cd branded-docs && node src/cli.js template letterhead data/johnson-quote.json

# Step 2: Populate with content (use Edit tool)
# Edit data/johnson-quote.json with:
# - Date: Current date
# - Recipient: Dr. Johnson details
# - Subject: Quotation for Recombinant Antibody Products
# - Body: Professional quotation content
# - Sender: Sales team member

# Step 3: Generate PDF
cd branded-docs && node src/cli.js generate letterhead data/johnson-quote.json output/johnson-quote.pdf

# Step 4: Confirm
ls -lh output/johnson-quote.pdf
```

## Content Guidelines

**Voice & Tone**:
- Professional and courteous
- Scientifically accurate
- Clear and concise
- Confident but not overstated

**Letter Body Structure**:
- Opening: Acknowledge recipient's inquiry/need
- Middle: Present products/services with technical details
- Details: Specifications, pricing, availability
- Closing: Call to action and next steps
- Signature: Professional closing

**Report Structure**:
- Executive Summary: High-level overview for decision-makers
- Introduction: Context and background
- Objectives: Clear, measurable goals
- Methodology: Technical approach
- Results: Data-driven analysis
- Conclusion: Actionable insights

**Proposal Structure**:
- Hook: Compelling value proposition
- Problem: Client's challenge or need
- Solution: How AntibodySystem addresses it
- Benefits: Specific advantages
- Timeline: Realistic project phases
- Pricing: Transparent, detailed costs
- CTA: Clear next steps

## Common Patterns

### Auto-Generate Reference Numbers
Use format: `TYPE-YYYYMMDD-XXX`
Example: `QUOTE-20251120-001`

### Format Pricing
Use `€` for European clients, `$` for international
Example: `€15,000.00` or `$16,500.00`

### Standard Recipients
- Research Institutions: Dr./Prof. title
- Corporate: Mr./Ms./Dr. + position title
- Government: Full title and department

### Standard Senders
- Sales: Dr. Marie Dupont, Sales Director
- Technical: Dr. Pierre Laurent, Scientific Director
- Management: Claire Moreau, CEO

## File Management

**Data Files**: Store in `branded-docs/data/`
**Output PDFs**: Generated in `branded-docs/output/`
**Examples**: Reference `branded-docs/examples/data/` for templates

## Troubleshooting

**PDF Not Generated**:
- Check Node.js is running
- Verify Puppeteer is installed: `npm install`
- Check output directory exists: `mkdir -p output`

**Missing Placeholders**:
- Verify all required fields in JSON
- Check spelling matches template exactly
- Use uppercase for placeholder names

**Formatting Issues**:
- Check HTML entities are escaped
- Use `\n\n` for paragraph breaks
- Verify UTF-8 encoding for special characters

## When to Use Each Template

- **Letterhead**: Quotations, correspondence, formal communications, order confirmations
- **Report**: Technical documentation, research summaries, quality reports, analysis documents
- **Proposal**: New business opportunities, project proposals, partnership agreements, RFP responses
- **Presentation**: Client meetings, conferences, internal reviews, investor pitches

## Integration with Other Systems

The document generator can be integrated with:
- Email systems (attach generated PDFs)
- CRM systems (generate quotes on demand)
- Order management (confirmation letters)
- Project management (proposal generation)

---

Remember: Every document represents AntibodySystem's brand. Ensure accuracy, professionalism, and consistent quality in all generated materials.
