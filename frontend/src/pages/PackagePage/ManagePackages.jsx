import React from 'react';
import { useNavigate } from 'react-router-dom';
import PackageList from './PackageList';
import SideBar from '../../components/SideBar';

const ManagePackages = () => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Sol tarafa sabitlenen NavBar */}
      <SideBar />

      {/* Sağdaki içerik alanı */}
      <div className="flex-1 ml-64 p-6 bg-gray-100">
        <div className="bg-white shadow-md rounded-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Manage Question Package</h2>
            <button
              className="bg-green-500 text-white p-2 rounded-full text-xl"
              onClick={() => navigate('/create-package')}
            >
              ➕
            </button>
          </div>

          {/* Paket Listesi */}
          <PackageList />
        </div>
      </div>
    </div>
  );
};

export default ManagePackages;
