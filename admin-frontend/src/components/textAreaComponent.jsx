import React from 'react';

const TextareaComponent = ({
  name,
  value,
  textAreaInputHeader,
  onChange,
  placeholder = '',
  rows = 3,
  className = '', // Eğer className prop'u sağlanmazsa boş bir string olarak tanımlıyoruz
}) => {
  const containerClassName = className || "w-[413px] h-[86px] px-[17px] py-[18px] bg-white rounded-[10px] border border-[#dfe2e6]";

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">{textAreaInputHeader}</label>
      <div className={containerClassName}> 
        <textarea
          name={name}
          value={value}
          onChange={onChange}  
          placeholder={placeholder}
          rows={rows}
          className="w-full h-full border-none outline-none resize-none"
        />
      </div>
    </div>
  );
};

export default TextareaComponent;
