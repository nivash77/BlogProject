"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const EditPostPage = ({ params }) => {
  const [post, setPost] = useState({
    title: "",
    desc: "",
    img: "",
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
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/post/${postId}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setPost(data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching post:", error);
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/updatePost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: postId, ...post }),
        }
      );
      if (response.ok) {
        //alert('Post updated successfully!');
        router.push("/", { replace: true });
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Error updating post. See console for details.");
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
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Edit Post
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="desc"
            value={post.desc}
            onChange={handleInputChange}
            rows="4"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="text"
            name="img"
            value={post.img}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          />
          {post.img && (
            <img
              src={post.img}
              alt={post.title}
              className="mt-4 w-full max-w-xs h-auto rounded-lg shadow-md"
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring focus:ring-green-300"
        >
          Save Changes
        </button>
      </form>
      <Link href="/Profile">
        <p className="block mt-6 text-center text-blue-500 hover:underline">
          Back to Profile
        </p>
      </Link>
    </div>
  );
};

export default EditPostPage;
