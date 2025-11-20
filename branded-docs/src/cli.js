#!/usr/bin/env node

/**
 * AntibodySystem Document Generator CLI
 *
 * Command-line interface for generating branded documents
 */

const PDFGenerator = require('./generators/pdf-generator');
const TemplateHelper = require('./utils/template-helper');
const path = require('path');
const fs = require('fs').promises;

// Parse command line arguments
const args = process.argv.slice(2);

async function showHelp() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║        AntibodySystem Branded Document Generator         ║
╚═══════════════════════════════════════════════════════════╝

USAGE:
  node src/cli.js <command> [options]

COMMANDS:
  generate <type> <data-file> <output>  Generate a PDF document
  template <type> <output>              Create a data template file
  list                                  List available templates
  help                                  Show this help message

DOCUMENT TYPES:
  letterhead      Official letterhead
  report          Technical report
  proposal        Business proposal
  presentation    Presentation slides

EXAMPLES:
  # Create a data template
  node src/cli.js template letterhead data/my-letter.json

  # Generate a letterhead PDF
  node src/cli.js generate letterhead data/my-letter.json output/letter.pdf

  # Generate a proposal
  node src/cli.js generate proposal data/proposal.json output/proposal.pdf

  # List all templates
  node src/cli.js list

For more information, see README.md
`);
}

async function listTemplates() {
  const templates = TemplateHelper.getAvailableTemplates();

  console.log('\n📄 Available Document Templates:\n');
  templates.forEach((template, index) => {
    console.log(`${index + 1}. ${template.name} (${template.type})`);
    console.log(`   ${template.description}\n`);
  });
}

async function createTemplate(type, outputPath) {
  try {
    console.log(`\n🔨 Creating ${type} template...`);

    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });

    // Create template
    await TemplateHelper.createDataTemplate(type, outputPath);

    console.log(`✅ Template created successfully!`);
    console.log(`📝 Edit the file: ${outputPath}`);
    console.log(`\n💡 Next step:`);
    console.log(`   node src/cli.js generate ${type} ${outputPath} output/${type}.pdf\n`);
  } catch (error) {
    console.error(`❌ Error creating template: ${error.message}`);
    process.exit(1);
  }
}

async function generateDocument(type, dataFile, outputPath) {
  try {
    console.log(`\n🔨 Generating ${type} PDF...`);

    // Load data from JSON file
    console.log(`📖 Loading data from: ${dataFile}`);
    const data = await TemplateHelper.loadDataFromJSON(dataFile);

    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });

    // Create generator
    const generator = new PDFGenerator();

    // Generate PDF based on type
    console.log(`📄 Generating PDF...`);
    switch (type) {
      case 'letterhead':
        await generator.generateLetterhead(data, outputPath);
        break;
      case 'report':
        await generator.generateReport(data, outputPath);
        break;
      case 'proposal':
        await generator.generateProposal(data, outputPath);
        break;
      case 'presentation':
        await generator.generatePresentation(data, outputPath);
        break;
      default:
        throw new Error(`Unknown document type: ${type}`);
    }

    // Close generator
    await generator.close();

    console.log(`\n✅ PDF generated successfully!`);
    console.log(`📁 Output: ${outputPath}\n`);
  } catch (error) {
    console.error(`❌ Error generating document: ${error.message}`);
    process.exit(1);
  }
}

// Main CLI logic
async function main() {
  const command = args[0];

  if (!command || command === 'help') {
    showHelp();
    return;
  }

  switch (command) {
    case 'list':
      await listTemplates();
      break;

    case 'template':
      const templateType = args[1];
      const templateOutput = args[2];

      if (!templateType || !templateOutput) {
        console.error('❌ Error: Missing arguments');
        console.log('Usage: node src/cli.js template <type> <output>');
        process.exit(1);
      }

      await createTemplate(templateType, templateOutput);
      break;

    case 'generate':
      const docType = args[1];
      const dataFile = args[2];
      const outputPath = args[3];

      if (!docType || !dataFile || !outputPath) {
        console.error('❌ Error: Missing arguments');
        console.log('Usage: node src/cli.js generate <type> <data-file> <output>');
        process.exit(1);
      }

      await generateDocument(docType, dataFile, outputPath);
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      console.log('Run "node src/cli.js help" for usage information');
      process.exit(1);
  }
}

// Run CLI
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
