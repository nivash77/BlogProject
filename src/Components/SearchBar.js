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
        className="search-input w-full px-4 py-2 text-black bg-white placeholder:text-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
      />
      <button
        type="button"
        onClick={handleSearch}
        className="px-4 py-2 bg-teal-500 text-white rounded-md ml-2 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        Search
      </button>
    </form>
  );
};