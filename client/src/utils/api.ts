import axios from 'axios'

const API_URL = '/api/posts'

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
