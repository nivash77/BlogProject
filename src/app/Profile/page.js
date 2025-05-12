'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit2, X } from 'lucide-react';
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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProfile({ ...data, password: '', repassword: '' });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile');
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`/api/userPost?username=${username}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profile.username,
          email: profile.email,
          DOB: profile.DOB,
        }),
      });
      if (response.ok) {
        toast.success('Profile updated successfully!', { autoClose: 2000 });
        setEditMode(false);
      } else {
        const errorData = await response.json();
        toast.error(`Update failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (profile.password !== profile.repassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!profile.password) {
      toast.error('Password cannot be empty');
      return;
    }
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/updatePassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profile.username,
          password: profile.password,
        }),
      });
      if (response.ok) {
        toast.success('Password updated successfully!', { autoClose: 2000 });
        setProfile({ ...profile, password: '', repassword: '' });
        setShowPasswordForm(false);
        setEditMode(false);
      } else {
        const errorData = await response.json();
        toast.error(`Password update failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Error updating password');
    }
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setShowPasswordForm(false);
    setProfile({ ...profile, password: '', repassword: '' });
  };

  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
    setProfile({ ...profile, password: '', repassword: '' });
  };

  if (!username) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Please login to view your profile</h2>
        <Link href="/Login" className="text-teal-500 hover:underline">
          Go to Login Page
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <div className=" bg-white/30 backdrop-blur-sm shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
          <button
            onClick={toggleEditMode}
            className="px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-700 flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            {editMode ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {editMode ? (
          <div className="space-y-6">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={profile?.username || ''}
                  disabled
                  className="search-input w-full mt-1 p-2 rounded-full bg-gray-200 text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile?.email || ''}
                  onChange={handleInputChange}
                  className="search-input w-full mt-1 p-2 rounded-full bg-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="DOB"
                  value={profile?.DOB || ''}
                  onChange={handleInputChange}
                  className="search-input w-full mt-1 p-2 rounded-full bg-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-700 w-full"
                >
                  Save Profile Changes
                </button>
                <button
                  type="button"
                  onClick={togglePasswordForm}
                  className="px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-700 w-full"
                >
                  {showPasswordForm ? 'Hide Password Form' : 'Change Password'}
                </button>
              </div>
            </form>
            {showPasswordForm && (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={profile?.password || ''}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className="search-input w-full mt-1 p-2 rounded-full bg-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    name="repassword"
                    value={profile?.repassword || ''}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className="search-input w-full mt-1 p-2 rounded-full bg-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-700 w-full"
                  >
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={togglePasswordForm}
                    className="px-4 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 w-full flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Username</p>
              <p className="mt-1 p-2 bg-gray-100 rounded-md text-gray-900">{profile?.username}</p>
            </div>
            
          </div>
        )}
      </div>
      <div className=" bg-white/30 backdrop-blur-sm shadow-lg rounded-xl p-6 mb-14 border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Your Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className=" bg-white/30 backdrop-blur-sm rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <Link href={`/edit-post/${post._id}`}>
                  <div>
                    <img
                      src={post.img || 'https://via.placeholder.com/400x200'}
                      alt={post.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2 text-gray-900 hover:text-teal-500">{post.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{post.desc}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-900">No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;