import axios from 'axios'

// 根据环境变量配置 API 地址
// 开发环境：使用代理 /api
// 生产环境：使用环境变量 VITE_API_URL 或默认 /api
const BASE_URL = import.meta.env.VITE_API_URL || ''
const API_URL = `${BASE_URL}/api/posts`

export interface PostData {
  title: string
  content: string
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
