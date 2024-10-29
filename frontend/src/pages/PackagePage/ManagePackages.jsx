import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PackageList from './PackageList';
import SideBar from '../../components/SideBar';
import TitleModal from "../CreatePackagePage/TitlePopup";
import Header from '../../components/Header';
import Button from '../../components/buttonComponent';
import { HiViewGridAdd } from "react-icons/hi";
import SearchBar from '../../components/searchBar';
import usePackageStore from '../../stores/PackagePageStore';

const ManagePackages = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const { packages } = usePackageStore();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.title && pkg.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row bg-gray-100 h-screen">
      {/* Sidebar - sadece büyük ekranlarda gösterilir */}
      <div className="hidden lg:block">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-4 md:p-6 bg-gray-100">
        <Header />

        <div className="bg-white shadow-md rounded-md p-4 md:p-6 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-lg md:text-2xl font-semibold text-neutral-600">Manage Question Package</h2>
            
            {/* Search Bar and Add Button */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center mt-2 md:mt-0">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <Button onClick={openModal} size='lg' icon={<HiViewGridAdd className='text-2xl md:text-3xl text-[#5C7C98]' />} />
            </div>
          </div>

          {/* Filtered Package List */}
          <PackageList packages={filteredPackages} />
        </div>
      </div>

      {/* Modal for Adding Package */}
      <TitleModal 
        isOpen={isModalOpen} 
        onClose={closeModal}
      />
    </div>
  );
};

export default ManagePackages;
