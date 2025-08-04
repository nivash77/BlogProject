'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontSize from '@tiptap/extension-font-size';
import { Save, X, User } from 'lucide-react';
import Picker from '@emoji-mart/react';
import emojiData from '@emoji-mart/data';

export default function EditPostPage({ params }) {
  const router = useRouter();
  const [post, setPost] = useState({ title: '', desc: '', img: '', author: '', date: '', category: '' });
  const [postId, setPostId] = useState(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [fontSize, setFontSize] = useState('16px');
  const [categories, setCategories] = useState([]);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
      Placeholder.configure({ placeholder: 'Update your blog content here...' })
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none p-4 min-h-[250px] border border-gray-300 rounded-md',
      },
    },
  });

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setPostId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (postId) {
      fetch(`/api/post/${postId}`)
        .then((res) => res.json())
        .then((data) => {
          setPost(data);
          editor?.commands.setContent(data.desc);
          setEditorLoaded(true);
        })
        .catch(console.error);
    }
  }, [postId, editor]);

  useEffect(() => {
    fetch('/api/Categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.categories)) setCategories(data.categories);
      });
  }, []);

  const handleInputChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    if (selected === 'Other') {
      setIsOtherCategory(true);
      setPost({ ...post, category: '' });
    } else {
      setIsOtherCategory(false);
      setPost({ ...post, category: selected });
    }
  };

  const applyFontSize = () => {
    if (editor) editor.chain().focus().setFontSize(fontSize).run();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedCategory = isOtherCategory ? newCategory : post.category;
    const updatedPost = { ...post, category: selectedCategory, desc: editor.getHTML() };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updatePost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, ...updatedPost }),
      });
      if (response.ok) {
        alert('Successfully updated your post');
        router.push('/');
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post. See console for details.');
    }
  };

  const handleEmojiSelect = (emoji) => {
    editor.chain().focus().insertContent(emoji.native).run();
    setShowEmojiPicker(false);
  };

  if (!editorLoaded) return <div className="container mx-auto p-6 text-center"><h2 className="text-3xl font-bold mb-6">Loading...</h2></div>;

  return (
    <div className="bg-white/30 backdrop-blur-sm shadow-sm py-10 px-6 min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleInputChange}
            placeholder="Enter post title..."
            className="w-full text-2xl font-semibold text-gray-800 placeholder-gray-400 outline-none bg-white px-4 py-3 border border-gray-300 rounded-lg mb-4"
            required
          />

          <div className="bg-white border border-gray-300 rounded-lg shadow p-4">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="border px-2 py-1 rounded text-sm font-bold">B</button>
              <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="border px-2 py-1 rounded text-sm italic">I</button>
              <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className="border px-2 py-1 rounded text-sm underline">U</button>
              <input
                type="number"
                min="6"
                step="0.1"
                value={fontSize.replace('px', '')}
                onChange={(e) => setFontSize(e.target.value + 'px')}
                className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <button type="button" onClick={applyFontSize} className="border px-2 py-1 rounded text-sm text-blue-700">Apply Size</button>
              <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="border px-2 py-1 rounded text-sm">😊 Emoji</button>
            </div>
            {showEmojiPicker && (
              <div className="mb-2">
                <Picker data={emojiData} onEmojiSelect={handleEmojiSelect} previewPosition="none" />
              </div>
            )}
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-md">
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            name="img"
            value={post.img}
            onChange={handleInputChange}
            className="w-full mb-3 px-4 py-2 rounded-md border border-gray-300"
            required
          />
          {post.img && (
            <img src={post.img} alt="Post Image" className="mb-3 rounded-md" />
          )}

          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            type="text"
            name="author"
            value={post.author}
            onChange={handleInputChange}
            className="w-full mb-3 px-4 py-2 rounded-md border border-gray-300"
            required
          />

          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={post.date}
            onChange={handleInputChange}
            className="w-full mb-3 px-4 py-2 rounded-md border border-gray-300"
            required
          />

          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={post.category}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 mb-2"
          >
            <option value="">Select category</option>
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
              className="mt-2 w-full px-4 py-2 rounded-md border border-gray-300"
            />
          )}

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
            >
              <Save className="w-5 h-5" /> Save Changes
            </button>
            <Link href="/">
              <button
                type="button"
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
              >
                <X className="w-5 h-5" /> Cancel
              </button>
            </Link>
          </div>

          <Link href="/Profile">
            <p className="flex items-center justify-center gap-1 text-sm font-medium text-blue-500 hover:underline mt-4">
              <User className="w-4 h-4" /> Back to Profile
            </p>
          </Link>
        </div>
      </form>
    </div>
  );
}