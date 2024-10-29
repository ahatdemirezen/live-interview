import React from "react";
import { Link } from "react-router-dom";
import { GoArchive } from "react-icons/go";
import { GoLog } from "react-icons/go";
import { FaUserCog } from "react-icons/fa";

const SideBar = () => {
  return (
    <div className="h-16 lg:h-screen w-full lg:w-64 bg-white text-neutral-600 fixed bottom-0 lg:top-0 lg:left-0 flex lg:flex-col lg:rounded-r-xl rounded-t-xl lg:rounded-none shadow-md">
      {/* Header */}
      <div className="p-4 lg:text-2xl text-lg font-semibold flex items-center justify-center lg:justify-start lg:mb-6">
        <FaUserCog className="text-2xl lg:text-3xl mr-2 " />
        <span className="hidden lg:inline">Admin Panel</span>
      </div>
      
      {/* Navigation */}
      <nav className="flex lg:flex-col flex-1 justify-evenly lg:justify-start">
        <ul className="flex lg:flex-col w-full">
          <li className="lg:mb-4 flex-1 lg:w-full">
            <Link to="/packages" className="flex items-center justify-center lg:justify-start p-3 hover:bg-gray-200 rounded-lg lg:rounded-none ">
              <GoArchive className="text-2xl text-neutral-950" />
              <span className="hidden lg:inline ml-4 text-neutral-950 ">Manage Question Package</span>
            </Link>
          </li>
          <li className="lg:mb-4 flex-1 lg:w-full">
            <Link to="/interview-list" className="flex items-center justify-center lg:justify-start p-3 hover:bg-gray-200 rounded-lg lg:rounded-none">
              <GoLog className="text-2xl text-neutral-950" />
              <span className="hidden lg:inline ml-4 text-neutral-950">Interview List</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
