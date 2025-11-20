/**
 * AntibodySystem Brand Configuration
 *
 * This file contains all brand identity elements for document generation.
 * Update this file to customize branding across all templates.
 */

const brandConfig = {
  // Company Information
  company: {
    name: 'AntibodySystem',
    tagline: 'Recombinant Proteins & Antibodies',
    legalName: 'AntibodySystem SAS',

    // Contact Information
    contact: {
      phone: '+33 1 75 44 64 23',
      email: 'order@antibodysystem.com',
      website: 'www.antibodysystem.com',
      websiteFr: 'www.antibodysystem.fr',
      address: {
        street: '10 Avenue Kl ber',
        city: 'Paris',
        postalCode: '75116',
        country: 'France',
        full: '10 Avenue Kl ber 75116 Paris, FRANCE'
      }
    },

    // Social Media (add your handles)
    social: {
      linkedin: '',
      twitter: '',
      facebook: ''
    }
  },

  // Color Palette
  colors: {
    primary: {
      red: '#ED1C24',        // Primary brand red
      redRGB: '237, 28, 36'
    },
    secondary: {
      blue: '#5B8FCE',       // Cornflower blue
      blueRGB: '91, 143, 206'
    },
    accent: {
      cyan: '#4FC3F7',       // Light blue/cyan accent
      cyanRGB: '79, 195, 247'
    },
    neutral: {
      darkGray: '#3E3E3E',   // Text color
      mediumGray: '#757575',
      lightGray: '#E0E0E0',
      white: '#FFFFFF',
      black: '#000000'
    },
    // Background options
    backgrounds: {
      light: '#FFFFFF',
      lightGray: '#F5F5F5',
      red: '#ED1C24',
      blue: '#5B8FCE'
    }
  },

  // Typography
  typography: {
    fonts: {
      // Primary font stack (modern sans-serif)
      primary: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',

      // Headings (bold, clean)
      heading: '"Eurostile", "Bank Gothic", "Segoe UI", Arial, sans-serif',

      // Monospace for code/technical content
      mono: '"Courier New", Courier, monospace'
    },

    sizes: {
      // Document text sizes
      h1: '32px',
      h2: '24px',
      h3: '18px',
      body: '11pt',        // Standard document body text
      small: '9pt',
      caption: '8pt',

      // Presentation sizes
      slideTitle: '44px',
      slideHeading: '32px',
      slideBody: '20px'
    },

    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },

    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7
    }
  },

  // Logo and Branding Elements
  branding: {
    // Logo configurations
    logo: {
      // SVG version of the antibody symbol logo
      symbol: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="10" fill="#ED1C24"/>
        <path d="M30,30 L50,50 M70,30 L50,50 M50,50 L50,80 M45,75 C45,77 47,80 50,80 C53,80 55,77 55,75"
              stroke="white" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="30" cy="30" r="5" fill="white"/>
        <circle cx="70" cy="30" r="5" fill="white"/>
      </svg>`,

      // Text version
      text: 'AntibodySystem',

      // Logo usage guidelines
      minWidth: '120px',
      spacing: '20px' // Clear space around logo
    },

    // Design elements
    elements: {
      // Diagonal stripe accent
      diagonalStripe: {
        angle: '45deg',
        width: '60px',
        colors: ['#ED1C24', '#5B8FCE']
      },

      // Border styles
      borders: {
        thin: '1px',
        medium: '2px',
        thick: '4px'
      },

      // Corner radius
      borderRadius: {
        small: '4px',
        medium: '8px',
        large: '12px'
      }
    },

    // Mascot - Fox character
    mascot: {
      name: 'Scientific Fox',
      description: 'Professional fox character in lab coat with glasses',
      usage: 'Use for informal communications, presentations, and marketing materials'
    }
  },

  // Document Templates Settings
  templates: {
    // Page margins (standard A4/Letter)
    margins: {
      top: '2.5cm',
      right: '2cm',
      bottom: '2.5cm',
      left: '2cm'
    },

    // Header and footer heights
    header: {
      height: '3cm',
      showLogo: true,
      showContact: true
    },

    footer: {
      height: '2cm',
      showPageNumber: true,
      showWebsite: true,
      showAddress: true
    },

    // Paper sizes
    paperSize: {
      default: 'A4',
      options: ['A4', 'Letter', 'Legal']
    }
  },

  // Voice and Tone Guidelines
  voiceAndTone: {
    personality: [
      'Professional and scientific',
      'Approachable and helpful',
      'Precise and accurate',
      'Innovation-focused'
    ],

    guidelines: [
      'Use clear, concise scientific language',
      'Maintain professional tone while being friendly',
      'Emphasize quality and precision',
      'Highlight scientific expertise and innovation'
    ],

    vocabulary: {
      preferred: ['precision', 'quality', 'innovation', 'expertise', 'reliable', 'advanced'],
      avoid: ['cheap', 'basic', 'simple', 'generic']
    }
  },

  // Document Types Configuration
  documentTypes: {
    letterhead: {
      enabled: true,
      useCase: 'Official correspondence, quotations, certificates'
    },

    report: {
      enabled: true,
      useCase: 'Technical reports, research summaries, white papers'
    },

    proposal: {
      enabled: true,
      useCase: 'Business proposals, project proposals, RFP responses'
    },

    presentation: {
      enabled: true,
      useCase: 'Scientific presentations, company overview, product showcase'
    },

    certificate: {
      enabled: true,
      useCase: 'Certificates of analysis, quality certificates'
    },

    datasheet: {
      enabled: true,
      useCase: 'Product datasheets, technical specifications'
    }
  }
};

// Export for Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = brandConfig;
}
