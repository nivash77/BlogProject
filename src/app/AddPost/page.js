'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import TextAlign from '@tiptap/extension-text-align';
import Picker from '@emoji-mart/react';
import emojiData from '@emoji-mart/data';
import Link from 'next/link';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontSize from '@tiptap/extension-font-size';

export default function AddPost() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [fontSize, setFontSize] = useState('16px');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Blockquote,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      FontSize.configure(),
      Placeholder.configure({ placeholder: 'Start writing your story...' })
    ],
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none p-4 min-h-[250px] border border-gray-300 rounded-md',
      },
    },
    onUpdate: ({ editor }) => {
      setDesc(editor.getHTML());
    },
  });

  useEffect(() => {
    fetch('/api/Categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          setCategories([]);
        }
      })
      .catch(() => setCategories([]));
  }, []);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    if (selected === 'Other') {
      setIsOtherCategory(true);
      setCategory('');
    } else {
      setIsOtherCategory(false);
      setCategory(selected);
    }
  };

  const handleEmojiSelect = (emoji) => {
    if (editor) {
      editor.commands.insertContent(emoji.native);
    }
  };

  const applyFontSize = () => {
    if (editor) {
      editor.chain().focus().setFontSize(fontSize).run();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, desc, img, author, date, category: isOtherCategory ? newCategory : category };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addpost`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      alert('Successfully published your post');
      router.push('/');
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-sm shadow-lg py-10 px-6 min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Left: Editor */}
        <div className="md:col-span-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title..."
            className="w-full text-2xl font-semibold text-gray-800 placeholder-gray-400 outline-none bg-white/30 backdrop-blur-sm shadow-lg px-4 py-3 border border-gray-300 rounded-lg mb-4"
            required
          />

          <div className="bg-white/30 backdrop-blur-sm shadow-lg border border-gray-300 rounded-lg  p-4">
            {editor && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="border border-gray-400 px-2 py-1 rounded text-sm font-bold">B</button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="border border-gray-400 px-2 py-1 rounded text-sm italic">I</button>
                <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className="border border-gray-400 px-2 py-1 rounded text-sm underline">U</button>
                {[1, 2, 3, 4, 5, 6].map(size => (
                  <button key={size} type="button" onClick={() => editor.chain().focus().toggleHeading({ level: size }).run()} className="border border-gray-300 px-2 py-1 rounded text-sm">H{size}</button>
                ))}
                <input
                  type="number"
                  min="6"
                  step="0.1"
                  value={fontSize.replace('px', '')}
                  onChange={(e) => setFontSize(e.target.value + 'px')}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="Font px"
                />
                <button type="button" onClick={applyFontSize} className="border border-blue-500 px-2 py-1 rounded text-sm text-blue-700">Apply Size</button>
                <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className="border border-gray-400 px-2 py-1 rounded text-sm">❝</button>
                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="border border-gray-400 px-2 py-1 rounded text-sm">😊</button>
              </div>
            )}
            {showEmojiPicker && (
              <div className="mb-4 max-w-xs">
                <Picker data={emojiData} onEmojiSelect={handleEmojiSelect} />
              </div>
            )}
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Right: Post Settings */}
        <div className="bg-white/30 backdrop-blur-sm shadow-lg border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Post Settings</h2>

          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            onChange={handleCategoryChange}
            className="w-full mb-3 px-4 py-2 rounded-md border border-gray-300"
          >
            <option value="">Select a category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
            <option value="Other">Other</option>
          </select>
          {isOtherCategory && (
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category"
              className="w-full mb-3 px-4 py-2 rounded-md border border-gray-300"
            />
          )}

          <label className="block text-sm font-medium mb-1">Featured Image URL</label>
          <input
            type="text"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full mb-3 px-4 py-2 rounded-md border border-gray-300"
            required
          />

          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full mb-3 px-4 py-2 rounded-md border border-gray-300"
            required
          />

          <label className="block text-sm font-medium mb-1">Publish Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mb-3 px-4 py-2 rounded-md border border-gray-300"
            required
          />

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
            >
              Publish
            </button>
            <Link href="/">
              <button
                type="button"
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg shadow-md transition"
              >
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
