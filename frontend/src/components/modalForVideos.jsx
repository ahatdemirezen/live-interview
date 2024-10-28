import React from "react";

const ModalForVideos = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"> 
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg h-h-full w-full max-w-md md:max-w-lg lg:max-w-5xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-bold text-stone-500 ">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">✖</button>
        </div>
        <div className="h-full">{children}</div> 
      </div>
    </div>
  );
};

export default ModalForVideos;