import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';
const API_URL = `${BASE_URL}/api/images`;

export interface UploadResponse {
  success: boolean;
  filename: string;
  originalName: string;
  size: number;
  url: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysis: string;
  productImage: string;
  sceneImage?: string;
}

export interface ProcessResponse {
  success: boolean;
  taskId: string;
  message: string;
}

export interface TaskResult {
  url: string;
  filename: string;
  message: string;
  revisedPrompt?: string;
  productDescription?: string;
  sceneDescription?: string;
}

export interface TaskStatus {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  productImage: string;
  sceneImage?: string;
  prompt?: string;
  mode: string;
  createdAt: string;
  result: TaskResult | null;
  error: string | null;
}

export type ProcessMode = 'remove-background' | 'generate-scene' | 'edit-image' | 'composite';

// 上传图片
export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post<UploadResponse>(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
}

// AI 分析图片
export async function analyzeImages(
  productImage: string,
  sceneImage?: string
): Promise<AnalysisResponse> {
  const response = await axios.post<AnalysisResponse>(`${API_URL}/analyze`, {
    productImage,
    sceneImage
  });

  return response.data;
}

// 创建图片处理任务
export async function processImage(
  productImage: string,
  mode: ProcessMode,
  sceneImage?: string,
  prompt?: string
): Promise<ProcessResponse> {
  const response = await axios.post<ProcessResponse>(`${API_URL}/process`, {
    productImage,
    sceneImage,
    prompt,
    mode
  });

  return response.data;
}

// 获取任务状态
export async function getTaskStatus(taskId: string): Promise<TaskStatus> {
  const response = await axios.get<TaskStatus>(`${API_URL}/task/${taskId}`);
  return response.data;
}

// 轮询任务状态直到完成
export async function pollTaskUntilComplete(
  taskId: string,
  onProgress?: (status: TaskStatus) => void,
  maxAttempts: number = 60,
  interval: number = 2000
): Promise<TaskStatus> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = await getTaskStatus(taskId);

    if (onProgress) {
      onProgress(status);
    }

    if (status.status === 'completed' || status.status === 'failed') {
      return status;
    }

    await new Promise(resolve => setTimeout(resolve, interval));
    attempts++;
  }

  throw new Error('任务超时');
}

// 获取图片完整 URL
export function getImageUrl(filename: string): string {
  return `${BASE_URL}${API_URL}/file/${filename}`;
}
