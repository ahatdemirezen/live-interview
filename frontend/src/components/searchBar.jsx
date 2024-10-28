import React from 'react';

const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search packages..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-md p-2 outline-none focus:border-blue-500"
    />
  );
};

export default SearchBar;
