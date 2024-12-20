import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"> 
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="md:text-xl font-bold text-neutral-700 text-2xl">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800"><AiOutlineCloseCircle className="text-3xl"/></button>
        </div>
        <div>{children}</div> 
      </div>
    </div>
  );
};

export default Modal;