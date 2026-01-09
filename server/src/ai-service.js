/**
 * AI Writing Assistant Service
 *
 * This service provides AI-powered writing assistance with a mock mode for testing.
 * Set AI_PROVIDER=mock (default) for testing without API keys.
 * Set AI_PROVIDER=openai and OPENAI_API_KEY for real AI integration.
 */

// Simulated delay to mimic real AI response time
const simulateDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Mock AI responses for different actions
const mockResponses = {
  continue: {
    patterns: [
      "Furthermore, this concept extends beyond the initial scope, encompassing various aspects that merit deeper exploration. The implications are far-reaching and touch upon fundamental principles that have shaped our understanding.",
      "Building on this foundation, we can observe several key developments that have emerged over time. Each contributes to a richer tapestry of knowledge and opens new avenues for investigation.",
      "This naturally leads us to consider the broader context in which these ideas operate. By examining the interconnections, we gain valuable insights that illuminate previously hidden relationships.",
      "Moreover, the practical applications of these principles demonstrate their enduring relevance. From theoretical frameworks to real-world implementations, the journey continues to unfold in fascinating ways."
    ],
    chinese: [
      "此外，这个概念延伸到更广泛的领域，涵盖了值得深入探讨的各个方面。其影响深远，触及塑造我们理解的基本原则。",
      "在此基础上，我们可以观察到随时间推移而出现的几个关键发展。每一个都为知识的丰富画卷做出贡献，并开辟新的研究途径。",
      "这自然而然地引导我们思考这些想法运作的更广泛背景。通过审视这些相互联系，我们获得了宝贵的见解，揭示了先前隐藏的关系。",
      "而且，这些原则的实际应用展示了它们的持久相关性。从理论框架到实际实施，这段旅程继续以令人着迷的方式展开。"
    ]
  },
  improve: {
    transforms: [
      { find: /很好/g, replace: "卓越" },
      { find: /好的/g, replace: "优秀的" },
      { find: /I think/gi, replace: "I believe" },
      { find: /very/gi, replace: "remarkably" },
      { find: /good/gi, replace: "excellent" },
      { find: /bad/gi, replace: "suboptimal" },
      { find: /big/gi, replace: "substantial" },
      { find: /small/gi, replace: "minimal" }
    ],
    enhancements: [
      "The text has been enhanced for clarity and impact.",
      "Vocabulary upgraded and sentence structure refined.",
      "Professional tone applied with improved flow."
    ]
  },
  summarize: {
    templates: [
      "**Summary:** This text discusses {topic}. The main points include: the importance of {point1}, the relationship between {point2}, and the implications for {point3}.",
      "**Key Takeaways:**\n- Primary focus: {topic}\n- Core argument: {point1}\n- Supporting evidence: {point2}\n- Conclusion: {point3}"
    ]
  },
  translate: {
    // Simple word/phrase translations for demo
    enToCn: {
      "hello": "你好",
      "world": "世界",
      "the": "",
      "is": "是",
      "are": "是",
      "a": "一个",
      "an": "一个",
      "this": "这",
      "that": "那",
      "and": "和",
      "or": "或者",
      "but": "但是",
      "writing": "写作",
      "assistant": "助手",
      "blog": "博客",
      "article": "文章",
      "content": "内容",
      "text": "文本"
    }
  },
  expand: {
    additions: [
      "\n\nTo elaborate further, this point deserves special attention because of its profound implications. When we examine the details more closely, several fascinating aspects emerge that enrich our understanding significantly.",
      "\n\n深入来看，这一点值得特别关注，因为它具有深远的影响。当我们更仔细地审视细节时，会发现几个令人着迷的方面，它们极大地丰富了我们的理解。"
    ]
  },
  simplify: {
    note: "Here's a simpler version:\n\n"
  }
};

// Detect if text is primarily Chinese
function isChinese(text) {
  const chineseChars = text.match(/[\u4e00-\u9fff]/g) || [];
  return chineseChars.length > text.length * 0.3;
}

// Extract key phrases from text for contextual responses
function extractKeyPhrases(text) {
  const words = text.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 4);
  return words.slice(0, 5);
}

// Mock AI service implementation
const mockAIService = {
  async continue(text, options = {}) {
    await simulateDelay(1000 + Math.random() * 500);
    const isChineseText = isChinese(text);
    const responses = isChineseText ? mockResponses.continue.chinese : mockResponses.continue.patterns;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return {
      success: true,
      result: randomResponse,
      action: 'continue',
      model: 'mock-gpt-4'
    };
  },

  async improve(text, options = {}) {
    await simulateDelay(1200 + Math.random() * 500);
    let improved = text;

    // Apply transformations
    mockResponses.improve.transforms.forEach(({ find, replace }) => {
      improved = improved.replace(find, replace);
    });

    // Add some structural improvements for longer texts
    if (improved.length > 100) {
      improved = improved
        .replace(/\.\s+/g, '. ')
        .replace(/,\s+/g, ', ');
    }

    return {
      success: true,
      result: improved,
      action: 'improve',
      model: 'mock-gpt-4',
      changes: mockResponses.improve.enhancements[Math.floor(Math.random() * mockResponses.improve.enhancements.length)]
    };
  },

  async summarize(text, options = {}) {
    await simulateDelay(1500 + Math.random() * 500);
    const plainText = text.replace(/<[^>]*>/g, '');
    const words = plainText.split(/\s+/);
    const keyPhrases = extractKeyPhrases(plainText);

    const isChineseText = isChinese(text);

    let summary;
    if (isChineseText) {
      summary = `**摘要：** 本文主要讨论了${keyPhrases[0] || '相关主题'}。文章包含约${words.length}个词，涵盖了多个重要观点。核心内容围绕${keyPhrases[1] || '主要概念'}展开，并探讨了其实际应用和影响。`;
    } else {
      summary = `**Summary:** This text discusses ${keyPhrases[0] || 'the main topic'}. It contains approximately ${words.length} words and covers several important points. The core content revolves around ${keyPhrases[1] || 'key concepts'} and explores practical applications and implications.`;
    }

    return {
      success: true,
      result: summary,
      action: 'summarize',
      model: 'mock-gpt-4',
      wordCount: words.length
    };
  },

  async translate(text, options = { targetLang: 'zh' }) {
    await simulateDelay(1000 + Math.random() * 500);
    const isChineseText = isChinese(text);

    let translated;
    if (isChineseText && options.targetLang === 'en') {
      // Chinese to English (mock)
      translated = `[Translated to English]\n\nThis is a mock translation of the Chinese text. In a production environment, this would be processed by a real translation API to provide accurate English translation.`;
    } else if (!isChineseText && options.targetLang === 'zh') {
      // English to Chinese (mock with some real translations)
      let result = text;
      Object.entries(mockResponses.translate.enToCn).forEach(([en, cn]) => {
        result = result.replace(new RegExp(`\\b${en}\\b`, 'gi'), cn);
      });
      translated = `[翻译为中文]\n\n${result}\n\n(注：这是模拟翻译，实际生产环境将使用真实翻译API)`;
    } else {
      translated = text;
    }

    return {
      success: true,
      result: translated,
      action: 'translate',
      model: 'mock-translator',
      sourceLang: isChineseText ? 'zh' : 'en',
      targetLang: options.targetLang
    };
  },

  async expand(text, options = {}) {
    await simulateDelay(1300 + Math.random() * 500);
    const isChineseText = isChinese(text);
    const addition = isChineseText ? mockResponses.expand.additions[1] : mockResponses.expand.additions[0];

    return {
      success: true,
      result: text + addition,
      action: 'expand',
      model: 'mock-gpt-4'
    };
  },

  async simplify(text, options = {}) {
    await simulateDelay(1100 + Math.random() * 500);
    const plainText = text.replace(/<[^>]*>/g, '');
    const sentences = plainText.split(/[.。!！?？]+/).filter(s => s.trim());
    const isChineseText = isChinese(text);

    // Create a simplified version by shortening sentences
    const simplified = sentences
      .map(s => s.trim().split(/[,，;；]/).slice(0, 2).join(isChineseText ? '，' : ', '))
      .join(isChineseText ? '。' : '. ');

    const prefix = isChineseText ? '简化版本：\n\n' : 'Simplified version:\n\n';

    return {
      success: true,
      result: prefix + simplified + (isChineseText ? '。' : '.'),
      action: 'simplify',
      model: 'mock-gpt-4'
    };
  },

  async custom(text, prompt, options = {}) {
    await simulateDelay(1500 + Math.random() * 500);
    const isChineseText = isChinese(text);

    let response;
    if (isChineseText) {
      response = `根据您的请求「${prompt}」，以下是AI的回应：\n\n基于您提供的文本，我已经按照要求进行了处理。这是一个模拟响应，在实际生产环境中会提供更准确和相关的结果。`;
    } else {
      response = `Based on your request "${prompt}", here's the AI response:\n\nI've processed your text according to the specified instructions. This is a mock response - in production, this would provide more accurate and contextually relevant results.`;
    }

    return {
      success: true,
      result: response,
      action: 'custom',
      model: 'mock-gpt-4',
      prompt: prompt
    };
  }
};

// Main AI service that can switch between mock and real providers
export async function processAIRequest(action, text, options = {}) {
  const provider = process.env.AI_PROVIDER || 'mock';

  if (provider === 'mock') {
    switch (action) {
      case 'continue':
        return mockAIService.continue(text, options);
      case 'improve':
        return mockAIService.improve(text, options);
      case 'summarize':
        return mockAIService.summarize(text, options);
      case 'translate':
        return mockAIService.translate(text, options);
      case 'expand':
        return mockAIService.expand(text, options);
      case 'simplify':
        return mockAIService.simplify(text, options);
      case 'custom':
        return mockAIService.custom(text, options.prompt, options);
      default:
        return {
          success: false,
          error: `Unknown action: ${action}`
        };
    }
  }

  // Placeholder for real AI integration
  // if (provider === 'openai') {
  //   return openAIService.process(action, text, options);
  // }

  return {
    success: false,
    error: `Unknown AI provider: ${provider}`
  };
}

export const aiService = {
  process: processAIRequest,
  supportedActions: ['continue', 'improve', 'summarize', 'translate', 'expand', 'simplify', 'custom']
};
