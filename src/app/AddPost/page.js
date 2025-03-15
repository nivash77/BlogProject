'use client'
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
    <div className="container mx-auto p-4">
    <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Add New Post</h2>
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2 uppercase tracking-wide">
          Title:
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <small className="text-gray-500 italic">Enter a catchy title for your post.</small>
      </div>
  
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2 uppercase tracking-wide">
          Description:
        </label>
        <textarea
          rows={8}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Enter post description"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <small className="text-gray-500 italic">Describe your post in detail.</small>
      </div>
  
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2 uppercase tracking-wide">
          Image URL:
        </label>
        <input
          type="text"
          value={img}
          onChange={(e) => setImg(e.target.value)}
          placeholder="Enter image URL"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <small className="text-gray-500 italic">Enter the URL of the image for your post.</small>
      </div>
  
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2 uppercase tracking-wide">
          Author:
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter author name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <small className="text-gray-500 italic">Enter the name of the post author.</small>
      </div>
  
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2 uppercase tracking-wide">
          Date:
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Select date"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <small className="text-gray-500 italic">Choose the date for your post.</small>
      </div>
  
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Post
        </button>
      </div>
    </form>
  </div>
  

  );
}
