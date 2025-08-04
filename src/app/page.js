'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isLoggedIn } from '../utils/auth';
import { Plus } from 'lucide-react';
import { SearchBar } from '../Components/SearchBar';
import { IoEye } from 'react-icons/io5';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts(currentPage, selectedCategory);
  }, [currentPage, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/Categories');
      const data = await res.json();
      if (Array.isArray(data.categories)) {
        setCategories(['All', ...data.categories]);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchPosts = async (page, category) => {
    setLoading(true);
    try {
      const categoryQuery = category !== 'All' ? `&category=${category}` : '';
      const res = await fetch(`/api/posts?page=${page}${categoryQuery}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const { posts = [], totalPages = 1 } = await res.json();
      setPosts(posts);
      setFilteredPosts(posts);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.short_description?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // reset to first page on category change
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-4xl font-bold text-white">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-4xl font-bold text-red-500">Error</h2>
        <p className="text-gray-200 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <main className="container mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to Our Blog
        </h2>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto">
          Discover the latest insights and stories that inspire and inform.
        </p>
      </main>

      {/* Category & Search */}
      <div className="container mx-auto max-w-6xl px-4 mb-6 flex flex-col md:flex-row items-center  gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-4 py-2 rounded bg-white/30 backdrop-blur-md shadow-md text-gray-800 "
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="w-full max-w-md">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container mx-auto max-w-6xl px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link href={`/post/${post._id}`} key={post._id}>
                <div className="bg-white/30 backdrop-blur-md shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img
                    className="w-full h-48 object-cover object-center rounded-t-lg"
                    src={post.img || 'https://via.placeholder.com/400x200'}
                    alt={post.title}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-teal-500 transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3"
                      dangerouslySetInnerHTML={ {__html:post.short_description}}>
                    </p>
                    <h2 className="flex justify-end items-center gap-1 text-gray-600 text-sm mt-2">
                      <IoEye className="text-xl" />
                      {post.views}
                    </h2>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-white text-center col-span-full">No posts found.</p>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 pb-10">
        <button
          onClick={() => {
            const prev = Math.max(currentPage - 1, 1);
            setCurrentPage(prev);
          }}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => {
            const next = Math.min(currentPage + 1, totalPages);
            setCurrentPage(next);
          }}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Add Post/Login Button */}
      <div className="container mx-auto max-w-6xl px-4 pb-12 flex justify-center">
        {isLoggedIn() ? (
          <Link
            href="/AddPost"
            className="flex items-center justify-center gap-2 w-full sm:w-64 h-12 bg-green-500 text-white font-bold rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" /> Add Post
          </Link>
        ) : (
          <Link
            href="/Login"
            className="flex items-center justify-center gap-2 w-full sm:w-64 h-12 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Login to Add Post
          </Link>
        )}
      </div>
    </div>
  );
}
