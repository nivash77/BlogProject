'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
import FontSize from '@tiptap/extension-font-size';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';

const RichTextEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      FontSize.configure({
        types: ['textStyle'], 
      }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML()); 
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
    
      <div className="flex space-x-2 mb-4">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('bold') ? 'bg-teal-500 text-white' : 'bg-gray-200'
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('italic') ? 'bg-teal-500 text-white' : 'bg-gray-200'
          }`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-teal-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-teal-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('bulletList') ? 'bg-teal-500 text-white' : 'bg-gray-200'
          }`}
        >
          Bullet List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('orderedList') ? 'bg-teal-500 text-white' : 'bg-gray-200'
          }`}
        >
          Ordered List
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-black text-sm leading-tight focus:outline-none focus:shadow-outline min-h-[150px]"
      />
    </div>
  );
};

export default RichTextEditor;
