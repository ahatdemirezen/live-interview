import React from "react";
import { Link } from "react-router-dom";
import { GoArchive } from "react-icons/go";
import { GoLog } from "react-icons/go";
import { FaUserCog } from "react-icons/fa";

const SideBar = () => {
  return (
    <div className="h-screen w-full lg:w-64 bg-white text-neutral-500 fixed top-0 left-0 lg:rounded-r-xl rounded-b-xl lg:rounded-none">
      <div className="p-4 text-2xl font-semibold flex item-center">
      <FaUserCog className="text-3xl mr-2" />
       <span>Admin Panel</span> 
      </div>
      <nav className="mt-6">
        <ul>
          <li className="mb-4">
            <Link to="/packages" className="flex items-center p-3 hover:bg-gray-700 rounded-lg">
            <GoArchive className="text-xl"/>
              <span className="ml-4">Manage Question Package</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/interview-list" className="flex items-center p-3 hover:bg-gray-700 rounded-lg">
               <GoLog className= "text-xl" />
              <span className="ml-4">Interview List</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
