'use client';
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
const PostDetails = ({ params }) => {
  const [postId, setPostId] = useState(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editedComment, setEditedComment] = useState('');

  useEffect(() => {
    const fetchParamsAndPost = async () => {
      const resolvedParams = await params;
      setPostId(resolvedParams.id);

      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }

      if (!resolvedParams.id) return;

      try {
        const response = await fetch(`/api/post/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch post with id ${resolvedParams.id}`);
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParamsAndPost();
  }, [params]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!username) {
      alert('Please login to add a comment');
      return;
    }
    if (!newComment.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      const response = await fetch( '/api/addCommand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, username, command: newComment }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add comment`);
      }

      await response.json();
      setPost(prevPost => ({
        ...prevPost,
        commands: [...(prevPost.commands || []), { username, command: newComment }],
      }));
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  const handleEditComment = (index, currentComment) => {
    setEditingCommentIndex(index);
    setEditedComment(currentComment);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!editedComment.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      const response = await fetch( '/api/updateCommand', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, username, command: editedComment }),
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      const result = await response.json();
      if (result.message === 'Comment updated successfully') {
        setPost(prevPost => {
          const updatedCommands = [...prevPost.commands];
          updatedCommands[editingCommentIndex] = { username, command: editedComment };
          return { ...prevPost, commands: updatedCommands };
        });
        
        setEditingCommentIndex(null);
        setEditedComment('');
      } else {
        throw new Error('Comment not found or no changes made');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment: ' + error.message);
    }
  };

  const handleDeleteComment = async (index) => {
    try {
      const response = await fetch('/api/deleteCommand', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, username, command: post.commands[index].command }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      const result = await response.json();
      if (result.message === 'Comment deleted successfully') {
        setPost(prevPost => ({
          ...prevPost,
          commands: prevPost.commands.filter((_, i) => i !== index),
        }));
      } else {
        throw new Error('Comment not found');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment: ' + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentIndex(null);
    setEditedComment('');
  };

  if (loading) {
    return (
      
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-4xl font-bold text-white">Loading...</h2>
        </div>
       
    );
  }
  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }
  if (!post) {
    return <div className="container mx-auto p-4 text-white">Post not found</div>;
  }

  return (
    <div className="container mx-auto p-4 mb-16 max-w-4xl">
      <div className=" bg-white/30 backdrop-blur-md rounded-xl shadow-lg mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-6 p-6">
          <div className="md:w-1/2">
            <img
              className="w-full h-96 object-cover rounded-xl shadow-sm hover:shadow-md transition-shadow"
              src={post.img || "https://via.placeholder.com/800x400"}
              alt={post.title}
            />
          </div>
          <div className="md:w-1/2 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">👤</span>
                </div>
                <span className="text-gray-900 font-medium">{post.author}</span>
              </div>
              <p className="text-sm text-gray-900">{new Date(post.date).toLocaleDateString()}</p>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{post.title}</h1>
            <p className="text-gray-800 leading-relaxed text-justify">{post.desc}</p>
          </div>
        </div>
      </div>
      {post.commands && post.commands.length > 0 ? (
        <div className=" bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Comments ({post.commands.length})
            </h2>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {post.commands.map((command, index) => (
              <div
                key={index}
                className="p-4 border-b last:border-0 hover:bg-white/30 backdrop-blur-xl transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm">👤</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-gray-900">
                        {command.username}
                      </span>
                      {username === command.username && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditComment(index, command.command)}
                            className="text-teal-500 hover:text-teal-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    {editingCommentIndex === index ? (
                      <form onSubmit={handleUpdateComment} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={editedComment}
                          onChange={(e) => setEditedComment(e.target.value)}
                          placeholder="Edit your comment..."
                          className="search-input w-full py-2 px-4 rounded-full bg-white  placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1 bg-teal-500 text-white rounded-full text-sm hover:bg-teal-700"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-3 py-1 bg-gray-400 text-white rounded-full text-sm hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <p className="text-gray-800 text-sm">{command.command}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {username && (
            <div className="p-4 border-t">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">👤</span>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className=" w-full py-2 px-4 rounded-full bg-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                  <button
                    type="submit"
                    onClick={handleAddComment}
                    className="absolute right-2 top-1.5 px-3 py-1 bg-teal-500 text-white rounded-full text-sm hover:bg-teal-700"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className=" bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-gray-100">
          {username ? (
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">👤</span>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="search-input w-full py-2 px-4 rounded-full bg-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                  <button
                    type="submit"
                    onClick={handleAddComment}
                    className="absolute right-2 top-1.5 px-3 py-1 bg-teal-500 text-white rounded-full text-sm hover:bg-teal-700"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 ">
              <h2 className="text-xl font-semibold text-gray-800">
                No comments yet. Please login to add a comment.
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostDetails;