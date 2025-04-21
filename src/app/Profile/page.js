'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    DOB: '',
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
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+`/getUser?username=${username}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+`/userPost?username=${username}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/updateUser', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        alert("Profile updated successfully!");
        setEditMode(false);
      } else {
         const errorData = await response.json();
         alert(`Update failed: ${errorData.message}`);  
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      //alert("Error updating profile. See console for details.");
    }
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  if (!username) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-300">Please login to view your profile</h2>
        <Link href="/Login" className="text-blue-100 hover:underline">
          Go to Login Page
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white/30 backdrop-blur-sm shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Profile</h2>
          <button
            onClick={toggleEditMode}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {editMode ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {editMode ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={profile?.username || ''}
                readOnly
                className="w-full mt-1 p-2 border rounded-md bg-white/30 backdrop-blur-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={profile?.email || ''}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="DOB"
                value={profile?.DOB || ''}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Username</p>
              <p className="mt-1 p-2 bg-gray-100 rounded-md">{profile?.username}</p>
            </div>
            {/* <div>
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="mt-1 p-2 bg-gray-100 rounded-md">{profile?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Date of Birth</p>
              <p className="mt-1 p-2 bg-gray-100 rounded-md">{profile?.DOB}</p>
            </div> */}
          </div>
        )}
      </div>
      <div className="bg-white/30 backdrop-blur-sm shadow-md rounded-lg p-6 mb-14">
        <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white/30 backdrop-blur-sm  rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <Link href={`/edit-post/${post._id}`}>
                  <div>
                    <img
                      src={post.img}
                      alt={post.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{post.desc}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
