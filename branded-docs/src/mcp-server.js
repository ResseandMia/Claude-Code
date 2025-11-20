#!/usr/bin/env node

/**
 * AntibodySystem Document Generator - MCP Server
 *
 * Model Context Protocol server for Claude integration
 * Allows Claude to generate branded documents directly
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const PDFGenerator = require('./generators/pdf-generator');
const TemplateHelper = require('./utils/template-helper');
const path = require('path');
const fs = require('fs').promises;

class DocumentGeneratorServer {
  constructor() {
    this.server = new Server(
      {
        name: 'antibodysystem-docs',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.generator = new PDFGenerator();
    this.setupHandlers();
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'generate_letterhead',
          description: 'Generate a professional letterhead PDF with AntibodySystem branding',
          inputSchema: {
            type: 'object',
            properties: {
              recipient_name: { type: 'string', description: 'Name of the recipient' },
              recipient_title: { type: 'string', description: 'Title of the recipient' },
              recipient_company: { type: 'string', description: 'Company name' },
              recipient_address: { type: 'string', description: 'Full address' },
              subject: { type: 'string', description: 'Letter subject' },
              body_content: { type: 'string', description: 'Main letter content' },
              sender_name: { type: 'string', description: 'Name of the sender' },
              sender_title: { type: 'string', description: 'Title of the sender' },
              output_filename: { type: 'string', description: 'Output PDF filename (optional)', default: 'letterhead.pdf' }
            },
            required: ['recipient_name', 'subject', 'body_content', 'sender_name']
          }
        },
        {
          name: 'generate_report',
          description: 'Generate a technical report PDF with AntibodySystem branding',
          inputSchema: {
            type: 'object',
            properties: {
              report_type: { type: 'string', description: 'Type of report (e.g., Technical Report, Analysis Report)' },
              report_title: { type: 'string', description: 'Main title of the report' },
              report_subtitle: { type: 'string', description: 'Subtitle or description' },
              author: { type: 'string', description: 'Report author' },
              executive_summary: { type: 'string', description: 'Executive summary' },
              introduction: { type: 'string', description: 'Introduction section' },
              methodology: { type: 'string', description: 'Methodology section' },
              conclusion: { type: 'string', description: 'Conclusion section' },
              output_filename: { type: 'string', description: 'Output PDF filename (optional)', default: 'report.pdf' }
            },
            required: ['report_title', 'author', 'executive_summary']
          }
        },
        {
          name: 'generate_proposal',
          description: 'Generate a business proposal PDF with AntibodySystem branding',
          inputSchema: {
            type: 'object',
            properties: {
              proposal_title: { type: 'string', description: 'Main title of the proposal' },
              proposal_subtitle: { type: 'string', description: 'Brief description' },
              client_name: { type: 'string', description: 'Client contact name' },
              client_company: { type: 'string', description: 'Client company name' },
              executive_summary: { type: 'string', description: 'Executive summary' },
              solution_overview: { type: 'string', description: 'Overview of proposed solution' },
              output_filename: { type: 'string', description: 'Output PDF filename (optional)', default: 'proposal.pdf' }
            },
            required: ['proposal_title', 'client_name', 'executive_summary']
          }
        },
        {
          name: 'generate_presentation',
          description: 'Generate presentation slides PDF with AntibodySystem branding',
          inputSchema: {
            type: 'object',
            properties: {
              presentation_title: { type: 'string', description: 'Main title of the presentation' },
              presentation_subtitle: { type: 'string', description: 'Subtitle' },
              presenter_name: { type: 'string', description: 'Presenter name' },
              agenda_items: { type: 'array', items: { type: 'string' }, description: 'Agenda items (5 items)' },
              output_filename: { type: 'string', description: 'Output PDF filename (optional)', default: 'presentation.pdf' }
            },
            required: ['presentation_title', 'presenter_name']
          }
        },
        {
          name: 'get_template_data',
          description: 'Get the data structure/template for a specific document type',
          inputSchema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['letterhead', 'report', 'proposal', 'presentation'],
                description: 'Document type'
              }
            },
            required: ['type']
          }
        },
        {
          name: 'list_templates',
          description: 'List all available document templates',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        }
      ]
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case 'generate_letterhead':
            return await this.generateLetterhead(args);

          case 'generate_report':
            return await this.generateReport(args);

          case 'generate_proposal':
            return await this.generateProposal(args);

          case 'generate_presentation':
            return await this.generatePresentation(args);

          case 'get_template_data':
            return await this.getTemplateData(args);

          case 'list_templates':
            return await this.listTemplates();

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async generateLetterhead(args) {
    const data = {
      RECIPIENT_NAME: args.recipient_name,
      RECIPIENT_TITLE: args.recipient_title || '',
      RECIPIENT_COMPANY: args.recipient_company || '',
      RECIPIENT_ADDRESS: args.recipient_address || '',
      SUBJECT: args.subject,
      BODY_CONTENT: args.body_content,
      SENDER_NAME: args.sender_name,
      SENDER_TITLE: args.sender_title || ''
    };

    const outputPath = path.join(process.cwd(), 'branded-docs/output', args.output_filename || 'letterhead.pdf');
    await this.generator.generateLetterhead(data, outputPath);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Letterhead PDF generated successfully!\nOutput: ${outputPath}`
        }
      ]
    };
  }

  async generateReport(args) {
    const data = {
      REPORT_TYPE: args.report_type || 'Technical Report',
      REPORT_TITLE: args.report_title,
      REPORT_SUBTITLE: args.report_subtitle || '',
      AUTHOR: args.author,
      EXECUTIVE_SUMMARY: args.executive_summary,
      INTRODUCTION: args.introduction || '',
      METHODOLOGY: args.methodology || '',
      CONCLUSION: args.conclusion || '',
      REFERENCE: TemplateHelper.generateReference('REP')
    };

    const outputPath = path.join(process.cwd(), 'branded-docs/output', args.output_filename || 'report.pdf');
    await this.generator.generateReport(data, outputPath);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Report PDF generated successfully!\nOutput: ${outputPath}`
        }
      ]
    };
  }

  async generateProposal(args) {
    const data = {
      PROPOSAL_TITLE: args.proposal_title,
      PROPOSAL_SUBTITLE: args.proposal_subtitle || '',
      CLIENT_NAME: args.client_name,
      CLIENT_COMPANY: args.client_company || '',
      EXECUTIVE_SUMMARY: args.executive_summary,
      SOLUTION_OVERVIEW: args.solution_overview || '',
      REFERENCE: TemplateHelper.generateReference('PROP')
    };

    const outputPath = path.join(process.cwd(), 'branded-docs/output', args.output_filename || 'proposal.pdf');
    await this.generator.generateProposal(data, outputPath);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Proposal PDF generated successfully!\nOutput: ${outputPath}`
        }
      ]
    };
  }

  async generatePresentation(args) {
    const data = {
      PRESENTATION_TITLE: args.presentation_title,
      PRESENTATION_SUBTITLE: args.presentation_subtitle || '',
      PRESENTER_NAME: args.presenter_name
    };

    // Add agenda items if provided
    if (args.agenda_items && Array.isArray(args.agenda_items)) {
      args.agenda_items.forEach((item, index) => {
        data[`AGENDA_ITEM_${index + 1}`] = item;
      });
    }

    const outputPath = path.join(process.cwd(), 'branded-docs/output', args.output_filename || 'presentation.pdf');
    await this.generator.generatePresentation(data, outputPath);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Presentation PDF generated successfully!\nOutput: ${outputPath}`
        }
      ]
    };
  }

  async getTemplateData(args) {
    const data = TemplateHelper.getDefaultData(args.type);

    return {
      content: [
        {
          type: 'text',
          text: `Template data structure for ${args.type}:\n\n${JSON.stringify(data, null, 2)}`
        }
      ]
    };
  }

  async listTemplates() {
    const templates = TemplateHelper.getAvailableTemplates();
    const list = templates.map((t, i) =>
      `${i + 1}. ${t.name} (${t.type})\n   ${t.description}`
    ).join('\n\n');

    return {
      content: [
        {
          type: 'text',
          text: `Available document templates:\n\n${list}`
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('AntibodySystem Document Generator MCP Server running on stdio');
  }
}

// Start server
const server = new DocumentGeneratorServer();
server.run().catch(console.error);
