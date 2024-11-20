import React from 'react';

function DropDown({ packages, currentInterview, loading, handlePackageSelect }) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-2 font-medium">Package</label>
      <select
        value=""
        onChange={handlePackageSelect}
        className="block w-full mt-1 p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="" disabled>Select Package</option>
        {loading ? (
          <option value="">Loading...</option>
        ) : (
          packages
            .filter((pkg) => !currentInterview.packageId.some(selectedPkg => selectedPkg._id === pkg._id))
            .map((pkg) => (
              <option key={pkg._id} value={pkg._id}>
                {pkg.title}
              </option>
            ))
        )}
      </select>
    </div>
  );
}

export default DropDown;
