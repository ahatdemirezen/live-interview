import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PackageList from './PackageList';
import SideBar from '../../components/SideBar';
import TitleModal from "../CreatePackagePage/TitlePopup";  // Modal bileşenini import ettiniz
import Header from "../../components/header";

const ManagePackages = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal görünürlüğünü kontrol eden state
  const navigate = useNavigate();

  // Modal'ı açma ve kapatma fonksiyonları
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Sol tarafa sabitlenen NavBar */}
      <SideBar />

      {/* Sağdaki içerik alanı */}
      <div className="flex-1 ml-64 p-6 bg-gray-100">
      <Header />

        <div className="bg-white shadow-md rounded-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Manage Question Package</h2>
            <button
              className="bg-green-500 text-white p-2 rounded-full text-xl"
              onClick={openModal}  // Modal'ı açıyoruz
            >
              ➕
            </button>
          </div>

          {/* Paket Listesi */}
          <PackageList />
        </div>
      </div>

      {/* TitleModal bileşeni */}
      <TitleModal 
        isOpen={isModalOpen} 
        onClose={closeModal}  // Modal'ı kapatma fonksiyonu
      />
    </div>
  );
};

export default ManagePackages;
