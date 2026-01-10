import { useState, useCallback } from 'react';
import {
  uploadImage,
  analyzeImages,
  processImage,
  pollTaskUntilComplete,
  getImageUrl,
  ProcessMode,
  TaskStatus,
  UploadResponse
} from '../utils/imageApi';

interface ImageState {
  file: File | null;
  preview: string | null;
  uploaded: UploadResponse | null;
}

export default function ImageEditor() {
  // 图片状态
  const [productImage, setProductImage] = useState<ImageState>({
    file: null,
    preview: null,
    uploaded: null
  });
  const [sceneImage, setSceneImage] = useState<ImageState>({
    file: null,
    preview: null,
    uploaded: null
  });

  // 处理状态
  const [mode, setMode] = useState<ProcessMode>('composite');
  const [customPrompt, setCustomPrompt] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  // UI 状态
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 处理文件选择
  const handleFileSelect = useCallback(async (
    file: File,
    setImage: React.Dispatch<React.SetStateAction<ImageState>>
  ) => {
    // 创建预览
    const preview = URL.createObjectURL(file);
    setImage({ file, preview, uploaded: null });

    // 上传文件
    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadImage(file);
      setImage(prev => ({ ...prev, uploaded: result }));
    } catch (err) {
      setError('上传图片失败，请重试');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }, []);

  // 处理拖放
  const handleDrop = useCallback((
    e: React.DragEvent,
    setImage: React.Dispatch<React.SetStateAction<ImageState>>
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file, setImage);
    }
  }, [handleFileSelect]);

  // AI 分析
  const handleAnalyze = async () => {
    if (!productImage.uploaded) {
      setError('请先上传产品图片');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeImages(
        productImage.uploaded.filename,
        sceneImage.uploaded?.filename
      );
      setAnalysis(result.analysis);
    } catch (err: any) {
      setError(err.response?.data?.details || 'AI 分析失败，请检查 API 配置');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 处理图片
  const handleProcess = async () => {
    if (!productImage.uploaded) {
      setError('请先上传产品图片');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResultImage(null);
    setTaskStatus(null);

    try {
      const response = await processImage(
        productImage.uploaded.filename,
        mode,
        sceneImage.uploaded?.filename,
        customPrompt || undefined
      );

      // 轮询任务状态
      const finalStatus = await pollTaskUntilComplete(
        response.taskId,
        (status) => setTaskStatus(status)
      );

      if (finalStatus.status === 'completed' && finalStatus.result) {
        setResultImage(getImageUrl(finalStatus.result.filename));
      } else if (finalStatus.status === 'failed') {
        setError(finalStatus.error || '处理失败');
      }
    } catch (err: any) {
      setError(err.response?.data?.details || err.message || '处理失败');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 清除图片
  const clearImage = (setImage: React.Dispatch<React.SetStateAction<ImageState>>) => {
    setImage({ file: null, preview: null, uploaded: null });
  };

  // 重置所有
  const resetAll = () => {
    setProductImage({ file: null, preview: null, uploaded: null });
    setSceneImage({ file: null, preview: null, uploaded: null });
    setAnalysis(null);
    setTaskStatus(null);
    setResultImage(null);
    setError(null);
    setCustomPrompt('');
  };

  // 下载结果
  const downloadResult = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `processed-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI 产品图片编辑器</h1>
            <p className="text-gray-500 text-sm mt-1">上传产品图片，AI 自动分析并处理</p>
          </div>
          <button
            onClick={resetAll}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            重新开始
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：上传区域 */}
          <div className="space-y-6">
            {/* 产品图片上传 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                1. 上传产品图片 <span className="text-red-500">*</span>
              </h2>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer
                  ${productImage.preview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, setProductImage)}
                onClick={() => document.getElementById('product-input')?.click()}
              >
                {productImage.preview ? (
                  <div className="relative">
                    <img
                      src={productImage.preview}
                      alt="产品图片"
                      className="max-h-64 mx-auto rounded-lg shadow"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearImage(setProductImage);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition"
                    >
                      x
                    </button>
                    {productImage.uploaded && (
                      <p className="mt-3 text-green-600 text-sm">已上传</p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="text-4xl mb-3">📦</div>
                    <p className="text-gray-600 mb-2">拖拽产品图片到这里</p>
                    <p className="text-gray-400 text-sm">或点击选择文件</p>
                    <p className="text-gray-400 text-xs mt-2">支持 JPG、PNG、WebP，最大 10MB</p>
                  </>
                )}
                <input
                  id="product-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file, setProductImage);
                  }}
                />
              </div>
            </div>

            {/* 场景图片上传 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                2. 上传场景图片 <span className="text-gray-400 text-sm font-normal">(可选)</span>
              </h2>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer
                  ${sceneImage.preview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, setSceneImage)}
                onClick={() => document.getElementById('scene-input')?.click()}
              >
                {sceneImage.preview ? (
                  <div className="relative">
                    <img
                      src={sceneImage.preview}
                      alt="场景图片"
                      className="max-h-48 mx-auto rounded-lg shadow"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearImage(setSceneImage);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition"
                    >
                      x
                    </button>
                    {sceneImage.uploaded && (
                      <p className="mt-3 text-green-600 text-sm">已上传</p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="text-4xl mb-3">🖼️</div>
                    <p className="text-gray-600 mb-2">拖拽目标场景图片</p>
                    <p className="text-gray-400 text-sm">AI 将把产品融入此场景</p>
                  </>
                )}
                <input
                  id="scene-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file, setSceneImage);
                  }}
                />
              </div>
            </div>

            {/* 处理模式选择 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">3. 选择处理模式</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'composite', label: 'AI 智能合成', desc: '分析产品并生成场景图' },
                  { value: 'generate-scene', label: '生成新场景', desc: '为产品创建全新背景' },
                  { value: 'edit-image', label: 'AI 优化', desc: '优化产品图片效果' },
                  { value: 'remove-background', label: '移除背景', desc: '透明背景处理' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setMode(option.value as ProcessMode)}
                    className={`p-4 rounded-lg border-2 text-left transition
                      ${mode === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <p className={`font-medium ${mode === option.value ? 'text-blue-700' : 'text-gray-900'}`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
                  </button>
                ))}
              </div>

              {/* 自定义提示词 */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  自定义提示词 <span className="text-gray-400 font-normal">(可选)</span>
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="例如：将产品放在现代简约的办公桌上，柔和的自然光线..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                onClick={handleAnalyze}
                disabled={!productImage.uploaded || isAnalyzing || isUploading}
                className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg font-medium
                  hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> AI 分析中...
                  </span>
                ) : 'AI 分析图片'}
              </button>
              <button
                onClick={handleProcess}
                disabled={!productImage.uploaded || isProcessing || isUploading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
                  hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> 处理中...
                  </span>
                ) : '开始处理'}
              </button>
            </div>
          </div>

          {/* 右侧：结果展示 */}
          <div className="space-y-6">
            {/* AI 分析结果 */}
            {analysis && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">AI 分析结果</h2>
                <div className="prose prose-sm max-w-none">
                  <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700">
                    {analysis}
                  </div>
                </div>
              </div>
            )}

            {/* 处理状态 */}
            {taskStatus && taskStatus.status === 'processing' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">处理进度</h2>
                <div className="flex items-center gap-4">
                  <div className="animate-spin text-3xl">⏳</div>
                  <div>
                    <p className="text-gray-900 font-medium">AI 正在处理您的图片...</p>
                    <p className="text-gray-500 text-sm mt-1">这可能需要 10-30 秒</p>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            )}

            {/* 处理结果 */}
            {resultImage && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">处理结果</h2>
                  <button
                    onClick={downloadResult}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                  >
                    下载图片
                  </button>
                </div>
                <img
                  src={resultImage}
                  alt="处理结果"
                  className="w-full rounded-lg shadow-lg"
                />
                {taskStatus?.result?.revisedPrompt && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">AI 使用的提示词：</p>
                    <p className="text-sm text-gray-700">{taskStatus.result.revisedPrompt}</p>
                  </div>
                )}
              </div>
            )}

            {/* 空状态 */}
            {!analysis && !taskStatus && !resultImage && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">等待处理</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  上传产品图片后，AI 将自动分析并帮助您完成图片处理
                </p>
                <div className="mt-6 space-y-3 text-left max-w-xs mx-auto">
                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">1</span>
                    <span>上传产品图片</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">2</span>
                    <span>可选上传目标场景</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">3</span>
                    <span>选择处理模式</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">4</span>
                    <span>AI 自动完成处理</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 上传中遮罩 */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-900 font-medium">上传中...</p>
          </div>
        </div>
      )}
    </div>
  );
}
