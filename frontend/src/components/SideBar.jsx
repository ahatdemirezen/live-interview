import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white fixed top-0 left-0">
      <div className="p-4 text-2xl font-semibold">
        Menu
      </div>
      <nav className="mt-1"> {/* mt-10'du, boşlukları azaltmak için mt-6 yapıldı */}
        <ul>
          <li className="mb-2"> {/* mb-6'dan mb-4'e indirildi */}
            <Link to="/packages" className="flex items-center p-3 hover:bg-gray-700">
              <span className="ml-4">Manage Question Package</span>
            </Link>
          </li>
          <li className="mb-2"> {/* mb-6'dan mb-4'e indirildi */}
            <Link to="/interview-list" className="flex items-center p-3 hover:bg-gray-700">
              <span className="ml-4">Interview List</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
