/**
 * Template Helper Utilities
 *
 * Helper functions for working with document templates
 */

const fs = require('fs').promises;
const path = require('path');
const brandConfig = require('../../config/brand.config');

class TemplateHelper {
  /**
   * Get default data for a template type
   *
   * @param {string} type - Template type (letterhead, report, proposal, presentation)
   * @returns {Object} - Default data object
   */
  static getDefaultData(type) {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const baseData = {
      DATE: today
    };

    switch (type) {
      case 'letterhead':
        return {
          ...baseData,
          RECIPIENT_NAME: 'Dr. [Recipient Name]',
          RECIPIENT_TITLE: '[Recipient Title]',
          RECIPIENT_COMPANY: '[Recipient Company]',
          RECIPIENT_ADDRESS: '[Recipient Address]',
          SUBJECT: '[Letter Subject]',
          BODY_CONTENT: '[Letter body content goes here]',
          SENDER_NAME: '[Your Name]',
          SENDER_TITLE: '[Your Title]'
        };

      case 'report':
        return {
          ...baseData,
          REPORT_TYPE: 'Technical Report',
          REPORT_TITLE: '[Report Title]',
          REPORT_SUBTITLE: '[Report Subtitle]',
          AUTHOR: '[Author Name]',
          REFERENCE: 'REF-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
          EXECUTIVE_SUMMARY: '[Executive summary goes here]',
          INTRODUCTION: '[Introduction content]',
          BACKGROUND: '[Background information]',
          OBJECTIVE_1: '[First objective]',
          OBJECTIVE_2: '[Second objective]',
          OBJECTIVE_3: '[Third objective]',
          METHODOLOGY: '[Methodology description]',
          KEY_INFO: '[Key information]',
          RESULTS_ANALYSIS: '[Results analysis]',
          PARAM_1: '[Parameter 1]',
          VALUE_1: '[Value 1]',
          UNIT_1: '[Unit 1]',
          NOTES_1: '[Notes 1]',
          CONCLUSION: '[Conclusion]',
          PAGE_NUMBER: '1'
        };

      case 'proposal':
        return {
          ...baseData,
          PROPOSAL_TITLE: '[Proposal Title]',
          PROPOSAL_SUBTITLE: '[Brief description of the proposal]',
          CLIENT_NAME: '[Client Name]',
          CLIENT_COMPANY: '[Client Company]',
          REFERENCE: 'PROP-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
          VALID_UNTIL: this.getFutureDate(30),
          EXECUTIVE_SUMMARY: '[Executive summary of the proposal]',
          WHY_CHOOSE: '[Reasons to choose AntibodySystem]',
          SOLUTION_OVERVIEW: '[Overview of the proposed solution]',
          BENEFIT_1_TITLE: '[Benefit 1 Title]',
          BENEFIT_1_DESC: '[Benefit 1 Description]',
          BENEFIT_2_TITLE: '[Benefit 2 Title]',
          BENEFIT_2_DESC: '[Benefit 2 Description]',
          BENEFIT_3_TITLE: '[Benefit 3 Title]',
          BENEFIT_3_DESC: '[Benefit 3 Description]',
          PHASE_1_NAME: 'Phase 1: [Name]',
          PHASE_1_DESC: '[Phase 1 description]',
          PHASE_1_DURATION: '[Duration]',
          PHASE_2_NAME: 'Phase 2: [Name]',
          PHASE_2_DESC: '[Phase 2 description]',
          PHASE_2_DURATION: '[Duration]',
          PHASE_3_NAME: 'Phase 3: [Name]',
          PHASE_3_DESC: '[Phase 3 description]',
          PHASE_3_DURATION: '[Duration]',
          ITEM_1: '[Item 1]',
          ITEM_1_DESC: '[Description]',
          QTY_1: '1',
          PRICE_1: '€ [Price]',
          TOTAL_1: '€ [Total]',
          ITEM_2: '[Item 2]',
          ITEM_2_DESC: '[Description]',
          QTY_2: '1',
          PRICE_2: '€ [Price]',
          TOTAL_2: '€ [Total]',
          GRAND_TOTAL: '€ [Grand Total]'
        };

      case 'presentation':
        return {
          ...baseData,
          PRESENTATION_TITLE: '[Presentation Title]',
          PRESENTATION_SUBTITLE: '[Presentation Subtitle]',
          PRESENTER_NAME: '[Presenter Name]',
          AGENDA_ITEM_1: '[Agenda Item 1]',
          AGENDA_ITEM_2: '[Agenda Item 2]',
          AGENDA_ITEM_3: '[Agenda Item 3]',
          AGENDA_ITEM_4: '[Agenda Item 4]',
          AGENDA_ITEM_5: '[Agenda Item 5]',
          SECTION_1_TITLE: '[Section 1 Title]',
          SECTION_1_HEADING: '[Heading]',
          SECTION_1_CONTENT: '[Content for section 1]',
          SECTION_2_TITLE: '[Section 2 Title]',
          COLUMN_1_TITLE: '[Column 1 Title]',
          COLUMN_1_CONTENT: '[Column 1 content]',
          COLUMN_2_TITLE: '[Column 2 Title]',
          COLUMN_2_CONTENT: '[Column 2 content]',
          STAT_1_NUMBER: '100+',
          STAT_1_LABEL: '[Stat 1 Label]',
          STAT_2_NUMBER: '500+',
          STAT_2_LABEL: '[Stat 2 Label]',
          STAT_3_NUMBER: '98%',
          STAT_3_LABEL: '[Stat 3 Label]',
          QUOTE_TEXT: '[Inspirational quote or key message]',
          QUOTE_AUTHOR: '[Quote Author]'
        };

      default:
        return baseData;
    }
  }

  /**
   * Get future date
   *
   * @param {number} days - Number of days in the future
   * @returns {string} - Formatted date string
   */
  static getFutureDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Load data from JSON file
   *
   * @param {string} jsonPath - Path to JSON file
   * @returns {Promise<Object>} - Parsed JSON data
   */
  static async loadDataFromJSON(jsonPath) {
    try {
      const content = await fs.readFile(jsonPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error loading JSON file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Save data to JSON file
   *
   * @param {string} jsonPath - Path to save JSON file
   * @param {Object} data - Data to save
   * @returns {Promise<void>}
   */
  static async saveDataToJSON(jsonPath, data) {
    try {
      const content = JSON.stringify(data, null, 2);
      await fs.writeFile(jsonPath, content, 'utf-8');
      console.log(`✅ Data saved to: ${jsonPath}`);
    } catch (error) {
      console.error(`Error saving JSON file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a data template file
   *
   * @param {string} type - Document type
   * @param {string} outputPath - Path to save template
   * @returns {Promise<string>}
   */
  static async createDataTemplate(type, outputPath) {
    const defaultData = this.getDefaultData(type);
    await this.saveDataToJSON(outputPath, defaultData);
    return outputPath;
  }

  /**
   * Validate required fields
   *
   * @param {Object} data - Data object
   * @param {Array} requiredFields - Array of required field names
   * @returns {Object} - Validation result {valid: boolean, missing: Array}
   */
  static validateData(data, requiredFields) {
    const missing = [];

    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        missing.push(field);
      }
    }

    return {
      valid: missing.length === 0,
      missing
    };
  }

  /**
   * Get brand colors
   *
   * @returns {Object} - Brand colors
   */
  static getBrandColors() {
    return brandConfig.colors;
  }

  /**
   * Get company information
   *
   * @returns {Object} - Company information
   */
  static getCompanyInfo() {
    return brandConfig.company;
  }

  /**
   * Generate reference number
   *
   * @param {string} prefix - Prefix for reference (e.g., 'PROP', 'REF', 'INV')
   * @returns {string} - Generated reference number
   */
  static generateReference(prefix = 'REF') {
    const year = new Date().getFullYear();
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `${prefix}-${year}-${random}`;
  }

  /**
   * Format currency
   *
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency symbol (default: '€')
   * @returns {string} - Formatted currency string
   */
  static formatCurrency(amount, currency = '€') {
    return `${currency} ${amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  /**
   * List available templates
   *
   * @returns {Array} - Array of available template types
   */
  static getAvailableTemplates() {
    return [
      {
        type: 'letterhead',
        name: 'Letterhead',
        description: 'Official correspondence, quotations, certificates'
      },
      {
        type: 'report',
        name: 'Technical Report',
        description: 'Technical reports, research summaries, white papers'
      },
      {
        type: 'proposal',
        name: 'Business Proposal',
        description: 'Business proposals, project proposals, RFP responses'
      },
      {
        type: 'presentation',
        name: 'Presentation Slides',
        description: 'Scientific presentations, company overview, product showcase'
      }
    ];
  }
}

module.exports = TemplateHelper;
