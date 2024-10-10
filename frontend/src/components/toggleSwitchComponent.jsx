import React from 'react';
const ToggleSwitch = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center cursor-pointer space-x-2">
      <span className="text-gray-700 text-sm md:text-base">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className={`w-10 h-5 md:w-12 md:h-6 bg-gray-300 rounded-full shadow-inner ${checked ? 'bg-green-500' : 'bg-gray-300'}`}></div>
       <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${checked ? 'translate-x-5 md:translate-x-6' : ''}`}
        ></div>
      </div>
    </label>
  );
};
export default ToggleSwitch;