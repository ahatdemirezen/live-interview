// SubmissionSuccessPage.js
import React from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai'; // Başarı simgesi için ikon
import backgroundImage from '../assets/background.jpg'; // Arka plan resmi dosyasını içe aktar

const SubmissionSuccessPage = () => {
  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center px-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div
        className="p-6 sm:p-10 rounded-lg shadow-lg text-center w-full max-w-sm sm:max-w-md"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.6)", // %60 saydamlık ile beyaz arka plan
        }}
      >
        <AiOutlineCheckCircle className="text-[#3a5a80] text-5xl sm:text-6xl mb-4 sm:mb-6 mx-auto" />
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-4 text-gray-800">
          Videonuz başarıyla kaydedildi!
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Mülakatınız başarıyla gönderildi. Katılımınız için teşekkür ederiz!
        </p>
      </div>
    </div>
  );
};

export default SubmissionSuccessPage;