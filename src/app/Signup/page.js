'use client'
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
export default function SignUp() {
      const router = useRouter();
     const [DOB, setDate] = React.useState('');
     const[username,setUsername]=useState('');
     const [email,setEmail]=useState('');
     const [password,SetPassword]=useState('');
     const [error, setError] = useState('');
     const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try {
        if (!DOB || !username || !email || !password) {
          return setError('All fields are required');
        }
        const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/addUser`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password, DOB }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to create account');
        }
        router.push('/Login', { replace: true });
      } catch (error) {
        setError(error.message);
      }
    }; 
  return (
    <>
      <div className="flex items-center justify-center p-11">
        <div className="w-full max-w-md p-8 space-y-4 bg-white/30 backdrop-blur-md rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            SignUp
          </h2>
          {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
          <form
           onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-800"
              >
                UserName
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                name="username"
                  value={username}
                placeholder="Enter your Username"
                 onChange={(e)=>setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800"
              >
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                name="username"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Enter your Email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-800"
              >
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                name="password"
                value={password}
                placeholder="Enter your password"
                  onChange={(e)=>SetPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-800 text-sm font-bold mb-2 uppercase tracking-wide">
                DOB:
              </label>
              <input
                type="date"
                value={DOB}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Select date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <small className="text-gray-800 italic">
                Choose the date for your post.
              </small>
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-4 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
