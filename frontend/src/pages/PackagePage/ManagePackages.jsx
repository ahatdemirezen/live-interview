import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PackageList from './PackageList';
import SideBar from '../../components/SideBar';
import TitleModal from "../CreatePackagePage/TitlePopup";
import Header from '../../components/Header';
import Button from '../../components/buttonComponent';
import { HiViewGridAdd } from "react-icons/hi";

const ManagePackages = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-100 h-screen">
      {/* SideBar - Mobilde gizlenir, büyük ekranlarda görünür */}
      <div className="hidden lg:block">
        <SideBar />
      </div>

      {/* Sağdaki içerik alanı */}
      <div className="flex-1 lg:ml-64 p-4 md:p-6 bg-gray-100">
        <Header />

        <div className="bg-white shadow-md rounded-md p-4 md:p-6 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-stone-500">Manage Question Package</h2>
            <Button onClick={openModal} size='lg' icon={<HiViewGridAdd className='text-2xl md:text-3xl text-[#92C7CF]' />} />
          </div>

          {/* Paket Listesi */}
          <PackageList />
        </div>
      </div>

      {/* TitleModal bileşeni */}
      <TitleModal 
        isOpen={isModalOpen} 
        onClose={closeModal}
      />
    </div>
  );
};

export default ManagePackages;
