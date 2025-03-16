'use client'
import Link from "next/link";
import { SearchBar } from "../Components/SearchBar";
import { useEffect, useState } from "react";
import { isLoggedIn } from "../utils/auth";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/posts"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setPosts(data || []);
        setFilteredPosts(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-5xl font-bold mb-6 text-center">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-5xl font-bold mb-6 text-center text-red-500">
          Error
        </h2>
        <p className="text-center text-gray-600">{error}</p>
      </div>
    );
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.short_description.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredPosts(filtered);
  };

  return (
    <>
      <main className="container mx-auto  py-6">
        <h2 className="text-5xl font-bold mb-6 text-center">
          Welcome to Our Blog
        </h2>
        <p className="text-lg text-gray-600 text-center mb-8">
          Discover the latest insights and stories that inspire and inform.
        </p>
      </main>

      <div className="flex justify-center px-4 mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-9 px-4">
        {filteredPosts.map((post) => (
          <Link href={"/post/" + post._id} key={post._id}>
            <div
              key={post._id}
              className="bg-white shadow-md rounded-md overflow-hidden"
            >
              <img
                className="w-full h-64 object-cover object-center"
                src={post.img || "https://via.placeholder.com/400x200"}
                alt={post.title}
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-600 text-lg">
                  {post.short_description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className=" bg-white shadow-md p-4 flex justify-center mb-14">
        {isLoggedIn() ? (
          <Link href="/AddPost" className="w-full sm:w-1/2 md:w-1/3 h-12 flex items-center justify-center bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-green-500">
            <span className="mr-2">+</span> Add Post
          </Link>
        ) : (
          <Link href="/Login" className="w-full sm:w-1/2 md:w-1/3 h-12 flex items-center justify-center bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-blue-500">
            Login to Add Post
          </Link>
        )}
      </div>
    </>
  );
}
