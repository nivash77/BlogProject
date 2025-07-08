'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function AddPost() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

 useEffect(() => {
  fetch('/api/Categories')
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        console.warn("Expected categories array but got:", data);
        setCategories([]);
      }
    })
    .catch((err) => {
      console.error('Error fetching categories:', err);
      setCategories([]);
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCategory = isOtherCategory ? newCategory : category;

    try {
      const response = await fetch('/api/addpost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, desc, img, author, date, category: selectedCategory }),
      });

      if (!response.ok) throw new Error('Failed to create post');

      router.push('/');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white/30 backdrop-blur-sm px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white/30 backdrop-blur-md shadow-xl rounded-xl p-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Write a New Blog Post
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full text-3xl font-semibold placeholder-gray-400 text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0"
          />

          <textarea
            rows={15}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Start writing your blog here..."
            className="w-full text-lg leading-relaxed placeholder-gray-500 text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 resize-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Image URL</label>
              <input
                type="text"
                value={img}
                onChange={(e) => setImg(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Publish Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
              <select
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300"
              >
                <option value="">Select category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
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
            </div>
          </div>

          <div className="flex justify-between mt-10">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
            >
              Publish Post
            </button>
            <Link href="/">
              <button
                type="button"
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
