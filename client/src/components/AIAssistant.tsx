import { useState, useEffect, useRef } from 'react'
import { processAI, AIAction, AIResponse } from '../utils/api'

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  selectedText: string
  onInsertText: (text: string) => void
  onReplaceText: (text: string) => void
}

interface AIActionButton {
  action: AIAction
  label: string
  labelCn: string
  icon: string
  description: string
}

const aiActions: AIActionButton[] = [
  {
    action: 'continue',
    label: 'Continue Writing',
    labelCn: '继续写作',
    icon: '✏️',
    description: 'AI will continue your text'
  },
  {
    action: 'improve',
    label: 'Improve Writing',
    labelCn: '改进文字',
    icon: '✨',
    description: 'Enhance clarity and style'
  },
  {
    action: 'summarize',
    label: 'Summarize',
    labelCn: '生成摘要',
    icon: '📝',
    description: 'Create a brief summary'
  },
  {
    action: 'expand',
    label: 'Expand',
    labelCn: '扩展内容',
    icon: '📖',
    description: 'Add more detail and depth'
  },
  {
    action: 'simplify',
    label: 'Simplify',
    labelCn: '简化文字',
    icon: '🎯',
    description: 'Make it easier to understand'
  },
  {
    action: 'translate',
    label: 'Translate',
    labelCn: '翻译',
    icon: '🌐',
    description: 'Translate to another language'
  }
]

function AIAssistant({ isOpen, onClose, selectedText, onInsertText, onReplaceText }: AIAssistantProps) {
  const [loading, setLoading] = useState(false)
  const [activeAction, setActiveAction] = useState<AIAction | null>(null)
  const [result, setResult] = useState<AIResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setResult(null)
      setError(null)
      setActiveAction(null)
      setShowCustom(false)
      setCustomPrompt('')
    }
  }, [isOpen])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleAction = async (action: AIAction, options?: { prompt?: string; targetLang?: 'en' | 'zh' }) => {
    if (!selectedText.trim()) {
      setError('请先选择一些文本 / Please select some text first')
      return
    }

    setLoading(true)
    setActiveAction(action)
    setError(null)
    setResult(null)

    try {
      const response = await processAI(action, selectedText, options)
      setResult(response)
    } catch (err) {
      setError('AI 处理失败，请重试 / AI processing failed, please try again')
      console.error('AI Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCustomSubmit = () => {
    if (customPrompt.trim()) {
      handleAction('custom', { prompt: customPrompt })
    }
  }

  const handleInsert = () => {
    if (result?.result) {
      onInsertText(result.result)
      onClose()
    }
  }

  const handleReplace = () => {
    if (result?.result) {
      onReplaceText(result.result)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 animate-fade-in">
      <div
        ref={panelRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-slide-up"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h2 className="text-white font-semibold text-lg">AI Writing Assistant</h2>
                <p className="text-purple-200 text-sm">AI 写作助手</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Selected Text Preview */}
        <div className="px-6 py-3 bg-gray-50 border-b">
          <p className="text-xs text-gray-500 mb-1">Selected Text / 选中的文本:</p>
          <p className="text-sm text-gray-700 line-clamp-2">
            {selectedText ? (
              selectedText.length > 150 ? selectedText.slice(0, 150) + '...' : selectedText
            ) : (
              <span className="text-gray-400 italic">No text selected / 未选中文本</span>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        {!result && !loading && (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {aiActions.map((action) => (
                <button
                  key={action.action}
                  onClick={() => handleAction(action.action)}
                  className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                >
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </span>
                  <span className="font-medium text-gray-800">{action.labelCn}</span>
                  <span className="text-xs text-gray-500">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Custom Prompt Section */}
            <div className="mt-4">
              <button
                onClick={() => setShowCustom(!showCustom)}
                className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
              >
                <span>{showCustom ? '▼' : '▶'}</span>
                自定义指令 / Custom Prompt
              </button>

              {showCustom && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                    placeholder="输入自定义指令... / Enter custom instructions..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={handleCustomSubmit}
                    disabled={!customPrompt.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    执行
                  </button>
                </div>
              )}
            </div>

            {/* Keyboard Shortcut Hint */}
            <div className="mt-6 text-center text-xs text-gray-400">
              Press <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600">ESC</kbd> to close •
              <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600 ml-2">⌘J</kbd> to toggle
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-12 flex flex-col items-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
              <span className="absolute inset-0 flex items-center justify-center text-2xl">
                {aiActions.find(a => a.action === activeAction)?.icon || '🤖'}
              </span>
            </div>
            <p className="mt-4 text-gray-600 font-medium">
              {aiActions.find(a => a.action === activeAction)?.labelCn || 'Processing'}...
            </p>
            <p className="text-sm text-gray-400">AI is thinking / AI 正在思考中</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div>
                <p className="text-red-800 font-medium">Error / 错误</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="mt-4 w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              重试 / Try Again
            </button>
          </div>
        )}

        {/* Result Display */}
        {result && !loading && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">
                {aiActions.find(a => a.action === result.action)?.icon || '✨'}
              </span>
              <span className="font-medium text-gray-800">
                {aiActions.find(a => a.action === result.action)?.labelCn || 'Result'}
              </span>
              <span className="text-xs text-gray-400 ml-auto">
                Model: {result.model}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              <p className="text-gray-800 whitespace-pre-wrap">{result.result}</p>
            </div>

            {result.changes && (
              <p className="mt-2 text-xs text-gray-500">
                📝 {result.changes}
              </p>
            )}

            {result.wordCount && (
              <p className="mt-1 text-xs text-gray-500">
                📊 Word count: {result.wordCount}
              </p>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleInsert}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                插入文本 / Insert
              </button>
              <button
                onClick={handleReplace}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                替换选中 / Replace
              </button>
            </div>

            <button
              onClick={() => setResult(null)}
              className="mt-3 w-full py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← 返回 / Back to actions
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIAssistant
