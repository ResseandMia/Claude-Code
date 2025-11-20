import { Post } from '../App'

interface PostListProps {
  posts: Post[]
  currentPost: Post | null
  onSelect: (post: Post) => void
  onDelete: (id: string) => void
}

function PostList({ posts, currentPost, onSelect, onDelete }: PostListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60))
        return minutes === 0 ? '刚刚' : `${minutes}分钟前`
      }
      return `${hours}小时前`
    } else if (days === 1) {
      return '昨天'
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }

  const getPreview = (content: string) => {
    // 从 HTML 内容中提取纯文本预览
    const div = document.createElement('div')
    div.innerHTML = content
    const text = div.textContent || div.innerText || ''
    return text.slice(0, 100) + (text.length > 100 ? '...' : '')
  }

  if (posts.length === 0) {
    return (
      <div className="p-4 text-center text-notion-secondary">
        <p>还没有文章</p>
        <p className="text-sm mt-2">点击上方按钮创建第一篇文章吧</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-notion-border">
      {posts.map((post) => (
        <div
          key={post.id}
          className={`p-4 cursor-pointer transition-colors group relative ${
            currentPost?.id === post.id
              ? 'bg-blue-50 border-l-4 border-blue-500'
              : 'hover:bg-notion-hover'
          }`}
          onClick={() => onSelect(post)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-notion-text truncate mb-1">
                {post.title || '无标题'}
              </h3>
              <p className="text-sm text-notion-secondary line-clamp-2 mb-2">
                {getPreview(post.content) || '无内容'}
              </p>
              <p className="text-xs text-notion-secondary">
                {formatDate(post.updatedAt)}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(post.id)
              }}
              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
              title="删除"
            >
              <svg
                className="w-4 h-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PostList
