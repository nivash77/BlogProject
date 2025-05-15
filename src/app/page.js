'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isLoggedIn } from '../utils/auth';
import { Plus } from 'lucide-react';
import {SearchBar} from '../Components/SearchBar'

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('api/posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data || []);
        setFilteredPosts(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err.message);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.short_description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
    console.log(searchQuery);
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

        {/* Search */}
        <div className="container mx-auto max-w-6xl px-4 mb-8 flex justify-center">
          <div className="w-full max-w-lg">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="container mx-auto max-w-6xl px-4 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
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
                    <p className="text-gray-600 line-clamp-3">
                      {post.short_description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Add Post / Login Button */}
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
