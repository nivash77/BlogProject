'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Type, FileText, Image, Save, X, User } from 'lucide-react';

export default function EditPostPage({ params }) {
  const [post, setPost] = useState({
    title: '',
    desc: '',
    img: '',
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setPostId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (postId) {
      const fetchPostById = async () => {
        try {
          const response = await fetch(`/api/post/${postId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setPost(data);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching post:', error);
          setIsLoading(false);
        }
      };
      fetchPostById();
    }
  }, [postId]);

  const handleInputChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updatePost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postId, ...post }),
      });
      if (response.ok) {
        router.push('/', { replace: true });
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post. See console for details.');
    }
  };

  if (isLoading) {
    return (
     
        <div className="container mx-auto p-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Loading...</h2>
        </div>
      
    );
  }

  return (
    
      <div className="container mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-6 md:p-8 max-w-4xl mx-auto"
        >
          <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800">Edit Post</h2>
              <p className="text-sm text-gray-900 mt-1">
                Update your blog post details below.
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase">
                <Type className="w-4 h-4" /> Title
              </label>
              <input
                type="text"
                name="title"
                value={post.title}
                onChange={handleInputChange}
                required
                placeholder="Enter post title"
                className="w-full mt-1 p-4 text-2xl font-bold border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
              <p className="text-sm text-gray-900 italic mt-1">
                Enter a catchy title for your post.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase">
                <FileText className="w-4 h-4" /> Description
              </label>
              <textarea
                name="desc"
                value={post.desc}
                onChange={handleInputChange}
                required
                placeholder="Write your post content here..."
                className="w-full mt-1 p-4 min-h-[400px] border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-y"
              />
              <p className="text-sm text-gray-900 italic mt-1">
                Describe your post in detail.
              </p>
            </div>

            {/* Image URL */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase">
                <Image className="w-4 h-4" /> Image URL
              </label>
              <input
                type="text"
                name="img"
                value={post.img}
                onChange={handleInputChange}
                placeholder="Enter image URL"
                className="w-full mt-1 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
              <p className="text-sm text-gray-900 italic mt-1">
                Enter the URL of the image for your post.
              </p>
              {post.img && (
                <img
                  src={post.img}
                  alt={post.title}
                  className="mt-4 w-full max-w-xs h-auto rounded-lg shadow-md"
                />
              )}
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-700 text-white font-bold rounded-md hover:bg-green-900 focus:ring-2 focus:ring-green-500"
              >
                <Save className="w-5 h-5" /> Save Changes
              </button>
              <Link href="/">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-400 text-white font-bold rounded-md hover:bg-gray-500 focus:ring-2 focus:ring-gray-400"
                >
                  <X className="w-5 h-5" /> Cancel
                </button>
              </Link>
            </div>

            {/* Back to Profile */}
            <Link href="/Profile">
              <p className="flex items-center justify-center gap-1 text-sm font-medium text-blue-500 hover:underline">
                <User className="w-4 h-4" /> Back to Profile
              </p>
            </Link>
          </div>
        </form>
      </div>
   
  );
}