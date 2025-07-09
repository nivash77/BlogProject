'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, PencilLine } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    DOB: '',
    password: '',
    repassword: '',
  });
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);

  useEffect(() => {
    if (username) {
      fetchUserProfile();
      fetchUserPosts();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/getUser?username=${username}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setProfile({ ...data, password: '', repassword: '' });
    } catch {
      toast.error('Failed to fetch profile');
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`/api/userPost?username=${username}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setPosts(data);
    } catch {
      toast.error('Failed to fetch posts');
    }
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  if (!username) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please login to view your profile</h2>
        <Link href="/Login" className="text-teal-500 hover:underline">
          Go to Login Page
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <div className="bg-white/30 backdrop-blur-md rounded-xl shadow p-8 mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
          <button onClick={() => setEditMode(!editMode)} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Edit2 className="w-4 h-4" /> {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editMode ? (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <input name="username" value={profile.username} disabled className="w-full px-4 py-2 rounded bg-gray-100 border" />
            <input name="email" value={profile.email} onChange={handleInputChange} className="w-full px-4 py-2 rounded border" />
            <input type="date" name="DOB" value={profile.DOB} onChange={handleInputChange} className="w-full px-4 py-2 rounded border" />
          </form>
        ) : (
          <div className="space-y-3">
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Date of Birth:</strong> {profile.DOB}</p>
          </div>
        )}
      </div>

      <div className="bg-white/30  backdrop-blur-md rounded-xl shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Posts</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length ? posts.map(post => (
            <div key={post._id} className="relative group bg-white/30 shadow rounded-lg overflow-hidden hover:shadow-lg transition">
              <Link href={`/post/${post._id}`} className="block">
                <img src={post.img || 'https://via.placeholder.com/400x200'} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: post.desc }}></p>
                </div>
              </Link>
              <button
                onClick={() => router.push(`/edit-post/${post._id}`)}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow group-hover:scale-110 transition-transform"
                title="Edit Post"
              >
                <PencilLine className="w-4 h-4" />
              </button>
            </div>
          )) : <p>No posts available.</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
