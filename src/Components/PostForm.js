'use client';

import React from 'react';

const PostForm = ({ isOpen, onClose, handleAddPost }) => {
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [img, setImg] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [date, setDate] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddPost({ title, desc, img, author, date });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-md p-6 w-1/2 max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Add New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <small className="text-gray-600">Enter a catchy title for your post.</small>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Description:</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Enter post description"
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <small className="text-gray-600">Describe your post in a few sentences.</small>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Image URL:</label>
            <input
              type="text"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="Enter image URL"
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <small className="text-gray-600">Enter the URL of the image for your post.</small>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Author:</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <small className="text-gray-600">Enter the name of the post author.</small>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Select date"
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <small className="text-gray-600">Choose the date for your post.</small>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-green-500"
          >
            Add Post
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
