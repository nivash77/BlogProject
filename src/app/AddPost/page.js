'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function AddPost() {
  const router = useRouter();
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [img, setImg] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [date, setDate] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/addpost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, desc, img, author, date }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`);
      }

      router.push('/', { replace: true });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Write a New Blog Post
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (e.g., My Journey into Web Development)"
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
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Publish Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
