'use client';
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { isLoggedIn, logout } from "../../utils/auth";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!username || !password) {
        return setError('Username and password are required');
      }

      const response = await fetch('/api/checkUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }
      localStorage.setItem("username",username);
      router.push('/', { replace: true });
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    logout();
    router.push('/Login', { replace: true });
  };

  return (
    <>
      <div className="flex items-center justify-center p-11 ">
        <div className="w-full max-w-md p-8 space-y-4  rounded-lg shadow-md bg-white/30 backdrop-blur-md">
          {isLoggedIn() ? (
            <div>
              <h2 className="text-2xl font-bold text-center text-gray-800">You are logged in</h2>
              <button
                type="button"
                className="w-full py-2 mt-4 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleLogout}
              >
                Logout
              </button>
              <Link href="/" className="text-blue-500 hover:underline">
                Back to Home
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-center text-gray-800">Login Account</h2>
              {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                    UserName
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your Username"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 mt-4 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit
                </button>
              </form>
              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">
                  Do not have an account?{" "}
                  <Link href='/Signup' className="text-indigo-500 hover:underline">
                    Signup
                  </Link>
                </span>
              </div>
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
