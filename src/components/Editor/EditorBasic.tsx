'use client'

// MUI Imports
import Divider from '@mui/material/Divider'

// Third-party imports
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/core'

// Components
import CustomIconButton from '@core/components/mui/IconButton'
import { useEffect } from 'react'

interface EditorBasicProps {
  name: string
  content?: string
  onChange: (name: string, value: string) => void
  viewOnly?: boolean
}

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 p-5'>
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className='ri-bold' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className='ri-underline' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className='ri-italic' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className='ri-strikethrough' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i className='ri-align-left' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <i className='ri-align-center' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <i className='ri-align-right' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <i className='ri-align-justify' />
      </CustomIconButton>
    </div>
  )
}

const EditorBasic = ({ name, content, onChange, viewOnly = false }: EditorBasicProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something here...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],
    content: content ?? '',
    onUpdate: ({ editor }) => {
      if (!viewOnly) {
        onChange(name, editor.getHTML())
      }
    }
  })

  // 👇 Ensure editable mode follows the prop correctly
  useEffect(() => {
    if (editor) {
      editor.setEditable(!viewOnly)
    }
  }, [editor, viewOnly])

  if (!editor) return null

  return (
    <div className={viewOnly ? '' : 'border rounded-md'}>
      {!viewOnly && <EditorToolbar editor={editor} />}
      {!viewOnly && <Divider />}
      <EditorContent
        editor={editor}
        className={`min-h-[2.5rem] overflow-y-auto px-3 py-2  ${
          viewOnly ? 'text-gray-600' : 'outline-none focus:outline-none focus:ring-0 focus:border-transparent '
        }`}
      />
    </div>
  )
}

export default EditorBasic
