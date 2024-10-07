import React from 'react';

const PackageItem = ({ pkg, onEdit, onDelete }) => {
  return (
    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow">
      <div className="flex items-center space-x-4">
        <div className="text-xl font-semibold">{pkg.id}</div>
        <div className="text-lg">{pkg.name}</div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-lg">{pkg.count}</div>
        <button onClick={onEdit} className="text-blue-600 hover:text-blue-800">
          ✏️
        </button>
        <button onClick={onDelete} className="text-red-600 hover:text-red-800">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default PackageItem;
