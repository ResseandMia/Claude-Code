import { useState, useEffect } from 'react'
import PostList from './components/PostList'
import Editor from './components/Editor'
import { getPosts, createPost, updatePost, deletePost } from './utils/api'

export interface Post {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPost, setCurrentPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  // 加载所有文章
  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const data = await getPosts()
      setPosts(data)
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }

  // 创建新文章
  const handleCreatePost = async () => {
    try {
      const newPost = await createPost({
        title: '无标题',
        content: ''
      })
      setPosts([newPost, ...posts])
      setCurrentPost(newPost)
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  // 更新文章
  const handleUpdatePost = async (id: string, title: string, content: string) => {
    try {
      const updated = await updatePost(id, { title, content })
      setPosts(posts.map(p => p.id === id ? updated : p))
      setCurrentPost(updated)
    } catch (error) {
      console.error('Failed to update post:', error)
    }
  }

  // 删除文章
  const handleDeletePost = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return

    try {
      await deletePost(id)
      setPosts(posts.filter(p => p.id !== id))
      if (currentPost?.id === id) {
        setCurrentPost(null)
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  // 选择文章
  const handleSelectPost = (post: Post) => {
    setCurrentPost(post)
  }

  return (
    <div className="flex h-screen bg-white">
      {/* 左侧边栏 - 文章列表 */}
      <div className="w-80 border-r border-notion-border flex flex-col">
        <div className="p-4 border-b border-notion-border">
          <h1 className="text-xl font-semibold text-notion-text mb-4">我的博客</h1>
          <button
            onClick={handleCreatePost}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
          >
            + 新建文章
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-notion-secondary">加载中...</div>
          ) : (
            <PostList
              posts={posts}
              currentPost={currentPost}
              onSelect={handleSelectPost}
              onDelete={handleDeletePost}
            />
          )}
        </div>
      </div>

      {/* 右侧 - 编辑器 */}
      <div className="flex-1 overflow-hidden">
        {currentPost ? (
          <Editor
            post={currentPost}
            onUpdate={handleUpdatePost}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-notion-secondary">
            <div className="text-center">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-notion-border"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <p className="text-lg">选择一篇文章或创建新文章</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
