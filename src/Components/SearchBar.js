'use client';
import React, { useState } from 'react';

export const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    if (event.type === 'click') {
      onSearch(searchTerm);
    } else {
      setSearchTerm(event.target.value);
      onSearch(event.target.value);
    }
  };

  return (
    <form className="flex items-center">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search posts..."
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        type="button"
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-500 text-white rounded-md ml-2 hover:bg-blue-700 focus:outline-none focus:ring-blue-500"
      >
        Search
      </button>
    </form>
  );
};
