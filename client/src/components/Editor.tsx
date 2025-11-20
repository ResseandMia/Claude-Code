import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Post } from '../App'

interface EditorProps {
  post: Post
  onUpdate: (id: string, title: string, content: string) => void
}

function Editor({ post, onUpdate }: EditorProps) {
  const [title, setTitle] = useState(post.title)
  const [isSaving, setIsSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '开始写作...',
      }),
    ],
    content: post.content,
    onUpdate: ({ editor }) => {
      handleSave(title, editor.getHTML())
    },
  })

  // 当切换文章时更新编辑器内容
  useEffect(() => {
    if (editor && post.content !== editor.getHTML()) {
      editor.commands.setContent(post.content)
    }
    setTitle(post.title)
  }, [post.id, editor])

  // 保存函数（带防抖）
  const handleSave = (() => {
    let timeout: NodeJS.Timeout
    return (newTitle: string, newContent: string) => {
      clearTimeout(timeout)
      setIsSaving(true)
      timeout = setTimeout(() => {
        onUpdate(post.id, newTitle, newContent)
        setIsSaving(false)
      }, 500)
    }
  })()

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    handleSave(newTitle, editor?.getHTML() || '')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!editor) {
    return null
  }

  return (
    <div className="h-full flex flex-col">
      {/* 工具栏 */}
      <div className="border-b border-notion-border p-4 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-notion-hover ${
              editor.isActive('bold') ? 'bg-notion-hover' : ''
            }`}
            title="粗体"
          >
            <span className="font-bold">B</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-notion-hover ${
              editor.isActive('italic') ? 'bg-notion-hover' : ''
            }`}
            title="斜体"
          >
            <span className="italic">I</span>
          </button>
          <div className="w-px h-6 bg-notion-border mx-2"></div>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-2 rounded hover:bg-notion-hover ${
              editor.isActive('heading', { level: 1 }) ? 'bg-notion-hover' : ''
            }`}
            title="标题 1"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-2 rounded hover:bg-notion-hover ${
              editor.isActive('heading', { level: 2 }) ? 'bg-notion-hover' : ''
            }`}
            title="标题 2"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-2 rounded hover:bg-notion-hover ${
              editor.isActive('heading', { level: 3 }) ? 'bg-notion-hover' : ''
            }`}
            title="标题 3"
          >
            H3
          </button>
          <div className="w-px h-6 bg-notion-border mx-2"></div>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-notion-hover ${
              editor.isActive('bulletList') ? 'bg-notion-hover' : ''
            }`}
            title="无序列表"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-notion-hover ${
              editor.isActive('orderedList') ? 'bg-notion-hover' : ''
            }`}
            title="有序列表"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-notion-hover ${
              editor.isActive('blockquote') ? 'bg-notion-hover' : ''
            }`}
            title="引用"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-notion-hover ${
              editor.isActive('codeBlock') ? 'bg-notion-hover' : ''
            }`}
            title="代码块"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-notion-secondary">
          {isSaving && <span>保存中...</span>}
          {!isSaving && <span>已保存</span>}
        </div>
      </div>

      {/* 编辑器区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 px-12">
          {/* 标题输入 */}
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full text-5xl font-bold mb-4 outline-none border-none placeholder-gray-300"
            placeholder="无标题"
          />

          {/* 元信息 */}
          <div className="text-sm text-notion-secondary mb-8">
            最后编辑于 {formatDate(post.updatedAt)}
          </div>

          {/* 编辑器内容 */}
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}

export default Editor
