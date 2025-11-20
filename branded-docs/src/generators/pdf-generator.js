/**
 * PDF Generator using Puppeteer
 *
 * Converts HTML templates to professional PDF documents with AntibodySystem branding.
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class PDFGenerator {
  constructor() {
    this.browser = null;
  }

  /**
   * Initialize the browser instance
   */
  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    return this.browser;
  }

  /**
   * Close the browser instance
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Generate PDF from HTML template
   *
   * @param {string} templatePath - Path to HTML template file
   * @param {Object} data - Data to replace placeholders in template
   * @param {string} outputPath - Path where PDF will be saved
   * @param {Object} options - PDF generation options
   * @returns {Promise<string>} - Path to generated PDF
   */
  async generatePDF(templatePath, data, outputPath, options = {}) {
    try {
      // Initialize browser
      await this.init();

      // Read template
      const templateContent = await fs.readFile(templatePath, 'utf-8');

      // Replace placeholders with data
      const processedHTML = this.replacePlaceholders(templateContent, data);

      // Create a new page
      const page = await this.browser.newPage();

      // Set content
      await page.setContent(processedHTML, {
        waitUntil: 'networkidle0'
      });

      // Default PDF options
      const pdfOptions = {
        path: outputPath,
        format: options.format || 'A4',
        printBackground: true,
        margin: options.margin || {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm'
        },
        ...options
      };

      // Generate PDF
      await page.pdf(pdfOptions);

      // Close page
      await page.close();

      console.log(`✅ PDF generated successfully: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      throw error;
    }
  }

  /**
   * Replace placeholders in template with actual data
   *
   * @param {string} template - HTML template content
   * @param {Object} data - Data object with placeholder values
   * @returns {string} - Processed HTML
   */
  replacePlaceholders(template, data) {
    let processed = template;

    // Replace {{PLACEHOLDER}} with actual values
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{${key}}}`;
      const regex = new RegExp(placeholder, 'g');
      processed = processed.replace(regex, value || '');
    }

    // Remove any remaining unreplaced placeholders
    processed = processed.replace(/\{\{[A-Z_0-9]+\}\}/g, '');

    return processed;
  }

  /**
   * Generate letterhead PDF
   *
   * @param {Object} data - Letter data
   * @param {string} outputPath - Output PDF path
   * @returns {Promise<string>}
   */
  async generateLetterhead(data, outputPath) {
    const templatePath = path.join(__dirname, '../../templates/letterhead/letterhead.html');

    // Add current date if not provided
    if (!data.DATE) {
      data.DATE = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    return this.generatePDF(templatePath, data, outputPath);
  }

  /**
   * Generate report PDF
   *
   * @param {Object} data - Report data
   * @param {string} outputPath - Output PDF path
   * @returns {Promise<string>}
   */
  async generateReport(data, outputPath) {
    const templatePath = path.join(__dirname, '../../templates/report/report.html');

    // Add current date if not provided
    if (!data.DATE) {
      data.DATE = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    return this.generatePDF(templatePath, data, outputPath);
  }

  /**
   * Generate proposal PDF
   *
   * @param {Object} data - Proposal data
   * @param {string} outputPath - Output PDF path
   * @returns {Promise<string>}
   */
  async generateProposal(data, outputPath) {
    const templatePath = path.join(__dirname, '../../templates/proposal/proposal.html');

    // Add current date if not provided
    if (!data.DATE) {
      data.DATE = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // Calculate valid until date (30 days from now if not provided)
    if (!data.VALID_UNTIL) {
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 30);
      data.VALID_UNTIL = validDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    return this.generatePDF(templatePath, data, outputPath);
  }

  /**
   * Generate presentation slides PDF
   *
   * @param {Object} data - Presentation data
   * @param {string} outputPath - Output PDF path
   * @returns {Promise<string>}
   */
  async generatePresentation(data, outputPath) {
    const templatePath = path.join(__dirname, '../../templates/slides/presentation.html');

    // Add current date if not provided
    if (!data.DATE) {
      data.DATE = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // Custom options for presentations (landscape)
    const options = {
      format: 'A4',
      landscape: true,
      printBackground: true
    };

    return this.generatePDF(templatePath, data, outputPath, options);
  }

  /**
   * Batch generate multiple documents
   *
   * @param {Array} documents - Array of document configurations
   * @returns {Promise<Array>} - Array of generated PDF paths
   */
  async generateBatch(documents) {
    await this.init();
    const results = [];

    for (const doc of documents) {
      try {
        let result;
        switch (doc.type) {
          case 'letterhead':
            result = await this.generateLetterhead(doc.data, doc.outputPath);
            break;
          case 'report':
            result = await this.generateReport(doc.data, doc.outputPath);
            break;
          case 'proposal':
            result = await this.generateProposal(doc.data, doc.outputPath);
            break;
          case 'presentation':
            result = await this.generatePresentation(doc.data, doc.outputPath);
            break;
          default:
            throw new Error(`Unknown document type: ${doc.type}`);
        }
        results.push({ success: true, path: result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }

    await this.close();
    return results;
  }
}

// Export the generator
module.exports = PDFGenerator;

// CLI usage
if (require.main === module) {
  const generator = new PDFGenerator();

  // Example usage
  const exampleData = {
    DATE: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    RECIPIENT_NAME: 'Dr. John Smith',
    RECIPIENT_TITLE: 'Research Director',
    RECIPIENT_COMPANY: 'BioPharma Research Institute',
    RECIPIENT_ADDRESS: '123 Science Park, Boston, MA 02101, USA',
    SUBJECT: 'Quotation for Recombinant Antibodies',
    BODY_CONTENT: 'Thank you for your interest in AntibodySystem products. We are pleased to provide you with a quotation for recombinant antibodies as per your requirements.',
    SENDER_NAME: 'Marie Dupont',
    SENDER_TITLE: 'Sales Manager'
  };

  const outputPath = path.join(__dirname, '../../output/example-letterhead.pdf');

  generator.generateLetterhead(exampleData, outputPath)
    .then(() => {
      console.log('Example PDF generated successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to generate example PDF:', error);
      process.exit(1);
    });
}
