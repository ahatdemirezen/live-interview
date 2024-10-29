import React from "react";

const ModalForVideos = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl xl:max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-600">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-xl sm:text-2xl">✖</button>
        </div>

        {/* İçerik alanı */}
        <div className="h-full overflow-y-auto max-h-[85vh]">{children}</div>
      </div>
    </div>
  );
};

export default ModalForVideos;
