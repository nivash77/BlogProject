'use client';
import React, { useState, useEffect, use } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const PostDetails = ({ params }) => {
  const resolvedParams = use(params);
  const postId = resolvedParams.id;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editedComment, setEditedComment] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }

        if (!postId) {
          setError('Post ID missing');
          setLoading(false);
          return;
        }

        const viewKey = `viewed-${postId}`;
        const hasViewed = localStorage.getItem(viewKey);

        const url = `/api/post/${postId}?userId=${storedUsername || 'anonymous'}&newView=${hasViewed ? 'false' : 'true'}`;
        if (!hasViewed) {
          localStorage.setItem(viewKey, 'true');
        }

        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch post');
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!username) return alert('Please login to add a comment');
    if (!newComment.trim()) return alert('Comment cannot be empty');

    try {
      const response = await fetch('/api/addCommand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, username, command: newComment }),
      });

      if (!response.ok) throw new Error('Failed to add comment');
      const updatedPost = await response.json();
      setPost(updatedPost);
      setNewComment('');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditComment = (index, currentComment) => {
    setEditingCommentIndex(index);
    setEditedComment(currentComment);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!editedComment.trim()) return alert('Comment cannot be empty');

    try {
      const response = await fetch('/api/updateCommand', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, username, command: editedComment, index: editingCommentIndex }),
      });

      if (!response.ok) throw new Error('Failed to update comment');
      const updatedPost = await response.json();
      setPost(updatedPost);
      setEditingCommentIndex(null);
      setEditedComment('');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteComment = async (index) => {
    try {
      const response = await fetch('/api/deleteCommand', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, username, index }),
      });

      if (!response.ok) throw new Error('Failed to delete comment');
      const updatedPost = await response.json();
      setPost(updatedPost);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div className="text-center py-10 text-white text-2xl">Loading...</div>;
  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;
  if (!post) return <div className="text-white p-4 text-center">Post not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Post details */}
      <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-6 p-6">
          <div className="md:w-1/2">
            <img
              src={post.img || 'https://via.placeholder.com/800x400'}
              alt={post.title}
              className="w-full h-96 object-cover rounded-xl shadow-sm hover:shadow-md transition-shadow"
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
            <p className="mt-4 text-sm text-gray-700">👁️ Views: <b>{post.views || 0}</b></p>
            <p className="mt-4 text-sm text-gray-700">Category: <b>{post.category || 0}</b></p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Comments ({post.commands?.length || 0})
          </h2>
        </div>

        {/* Comments List */}
        <div className="max-h-[400px] overflow-y-auto">
          {post.commands?.length > 0 ? (
            post.commands.map((command, index) => (
              <div key={index} className="p-4 border-b last:border-0 hover:bg-white/30 backdrop-blur-xl transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm">👤</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-gray-900">{command.username}</span>
                      {username === command.username && (
                        <div className="flex gap-2">
                          <button onClick={() => handleEditComment(index, command.command)} className="text-teal-500 hover:text-teal-700">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteComment(index)} className="text-red-500 hover:text-red-700">
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
                          className="w-full py-2 px-4 rounded-full bg-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                        />
                        <button type="submit" className="px-3 py-1 bg-teal-500 text-white rounded-full text-sm hover:bg-teal-700">Save</button>
                        <button type="button" onClick={() => { setEditingCommentIndex(null); setEditedComment(''); }} className="px-3 py-1 bg-gray-400 text-white rounded-full text-sm hover:bg-gray-500">Cancel</button>
                      </form>
                    ) : (
                      <p className="text-gray-800 text-sm">{command.command}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-700">No comments yet.</div>
          )}
        </div>

        {/* Add Comment */}
        {username ? (
          <form onSubmit={handleAddComment} className="p-4 border-t flex items-center gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow py-2 px-4 rounded-full bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
            <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-700">Post</button>
          </form>
        ) : (
          <div className="p-4 text-center text-gray-500">Please login to add comments.</div>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
