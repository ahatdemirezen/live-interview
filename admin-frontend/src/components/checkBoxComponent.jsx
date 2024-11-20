import React from 'react';

const Checkbox = ({
  id,
  label,
  checked,
  onChange,
  className = '', // checkbox için varsayılan sınıf
  labelClassName = '', // etiket için varsayılan sınıf
}) => {
  return (
    <label htmlFor={id} className={`inline-flex items-center cursor-pointer  ${labelClassName}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 ${className}`}
      />
      
      {label && <span className="ml-3 text-gray-700">{label}</span>}
    </label>
  );
};

export default Checkbox;
