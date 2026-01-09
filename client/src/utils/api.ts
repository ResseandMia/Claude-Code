import axios from 'axios'

// 根据环境变量配置 API 地址
// 开发环境：使用代理 /api
// 生产环境：使用环境变量 VITE_API_URL 或默认 /api
const BASE_URL = import.meta.env.VITE_API_URL || ''
const API_URL = `${BASE_URL}/api/posts`
const AI_API_URL = `${BASE_URL}/api/ai`

export interface PostData {
  title: string
  content: string
}

// AI Assistant Types
export type AIAction = 'continue' | 'improve' | 'summarize' | 'translate' | 'expand' | 'simplify' | 'custom'

export interface AIOptions {
  targetLang?: 'en' | 'zh'
  prompt?: string
}

export interface AIResponse {
  success: boolean
  result: string
  action: AIAction
  model: string
  changes?: string
  wordCount?: number
  sourceLang?: string
  targetLang?: string
  prompt?: string
  error?: string
}

export interface AIStatus {
  status: string
  provider: string
  supportedActions: AIAction[]
  message: string
}

export const getPosts = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

export const getPost = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

export const createPost = async (data: PostData) => {
  const response = await axios.post(API_URL, data)
  return response.data
}

export const updatePost = async (id: string, data: Partial<PostData>) => {
  const response = await axios.put(`${API_URL}/${id}`, data)
  return response.data
}

export const deletePost = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data
}

// ===================
// AI Assistant API
// ===================

export const getAIStatus = async (): Promise<AIStatus> => {
  const response = await axios.get(`${AI_API_URL}/status`)
  return response.data
}

export const processAI = async (action: AIAction, text: string, options?: AIOptions): Promise<AIResponse> => {
  const response = await axios.post(`${AI_API_URL}/process`, { action, text, options })
  return response.data
}

export const aiContinue = async (text: string): Promise<AIResponse> => {
  const response = await axios.post(`${AI_API_URL}/continue`, { text })
  return response.data
}

export const aiImprove = async (text: string): Promise<AIResponse> => {
  const response = await axios.post(`${AI_API_URL}/improve`, { text })
  return response.data
}

export const aiSummarize = async (text: string): Promise<AIResponse> => {
  const response = await axios.post(`${AI_API_URL}/summarize`, { text })
  return response.data
}

export const aiTranslate = async (text: string, targetLang: 'en' | 'zh' = 'zh'): Promise<AIResponse> => {
  const response = await axios.post(`${AI_API_URL}/translate`, { text, options: { targetLang } })
  return response.data
}
