import React from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from 'react-router-dom';  // useNavigate hook'u import edildi

const ManagePackages = () => {
  const navigate = useNavigate();  // useNavigate hook'u burada çağrılıyor

  const packages = [
    { id: 1, name: "Backend Question Package", count: 10 },
    { id: 2, name: "Frontend Question Package", count: 8 },
    { id: 3, name: "Fullstack Question Package", count: 5 },
    { id: 4, name: "Devops Question Package", count: 7 },
  ];

  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Sol tarafa sabitlenen NavBar */}
      <NavBar />

      {/* Sağdaki içerik alanı */}
      <div className="flex-1 ml-64 p-6 bg-gray-100">
        <div className="bg-white shadow-md rounded-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Manage Question Package</h2>
            <button
              className="bg-green-500 text-white p-2 rounded-full text-xl"
              onClick={() => navigate('/create-package')} // Butona tıklandığında /create-package sayfasına yönlendirir
            >
              ➕
            </button>
          </div>

          {/* Kart yapısı */}
          <div className="space-y-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-semibold">{pkg.id}</div>
                  <div className="text-lg">{pkg.name}</div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-lg">{pkg.count}</div>
                  <button className="text-blue-600 hover:text-blue-800">
                    ✏️
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePackages;
