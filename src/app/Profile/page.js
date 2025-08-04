"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Trash } from "lucide-react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Edit2, PencilLine, Lock } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    dob: "",
    password: "",
    repassword: "",
  });
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/getUser?username=${username}`
      );
      if (!response.ok) throw new Error();
      const data = await response.json();
      setProfile({ ...data, password: "", repassword: "" });
    } catch {
      toast.error("Failed to fetch profile");
    }
  };
  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/delete/${postId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete post");

      toast.success("Post deleted successfully");

      setPosts((prev) => prev.filter((p) => (p._id || p.id) !== postId));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/userPost?username=${username}`
      );
      if (!response.ok) throw new Error();
      const data = await response.json();
      setPosts(data);
    } catch {
      toast.error("Failed to fetch posts");
    }
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (profile.password !== profile.repassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/updatePassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, newPassword: profile.password }),
        }
      );

      if (!response.ok) throw new Error();
      toast.success("Password updated successfully");
      setProfile({ ...profile, password: "", repassword: "" });
      setShowPasswordForm(false);
    } catch {
      toast.error("Failed to update password");
    }
  };

  if (!username) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Please login to view your profile
        </h2>
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
          <div className="flex gap-4">
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />{" "}
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />{" "}
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
          </div>
        </div>

        {editMode ? (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <input
              name="username"
              value={profile.username}
              disabled
              className="w-full px-4 py-2 rounded bg-gray-100 border"
            />
            <input
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded border"
            />
            <input
              type="date"
              name="dob"
              value={profile.dob}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded border"
            />
          </form>
        ) : (
          <div className="space-y-3">
            <p>
              <strong>Username:</strong> {profile.username}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Date of Birth:</strong> {profile.dob}
            </p>
          </div>
        )}

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="space-y-4 mt-6">
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleInputChange}
              placeholder="New Password"
              className="w-full px-4 py-2 rounded border"
              required
            />
            <input
              type="password"
              name="repassword"
              value={profile.repassword}
              onChange={handleInputChange}
              placeholder="Confirm New Password"
              className="w-full px-4 py-2 rounded border"
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Update Password
            </button>
          </form>
        )}
      </div>

      <div className="bg-white/30 backdrop-blur-md rounded-xl shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Your Posts
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(posts) && posts.length ? (
            posts.map((post, index) => (
              <div
                key={post._id || post.id || index}
                className="relative group bg-white/30 shadow rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <Link href={`/post/${post._id || post.id}`} className="block">
                  <img
                    src={post.img || "https://via.placeholder.com/400x200"}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {post.title}
                    </h3>
                    <p
                      className="text-sm text-gray-600 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: post.desc }}
                    ></p>
                  </div>
                </Link>

                {/* Edit Button */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() =>
                      router.push(`/edit-post/${post._id || post.id}`)
                    }
                    className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow"
                    title="Edit Post"
                  >
                    <PencilLine className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(post._id || post.id)}
                    className="bg-white/80 hover:bg-white text-red-600 p-2 rounded-full shadow"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
