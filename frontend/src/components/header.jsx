import React from "react";
import { useAuthStore } from "../stores/LoginStore"; // useAuthStore'u içe aktarıyoruz
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa"; // Logout ikonu için Font Awesome kullanımı

const Header = () => {
  const logout = useAuthStore((state) => state.logout); // Logout fonksiyonunu Zustand'dan alıyoruz
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Zustand'daki logout fonksiyonunu çağırıyoruz
    navigate("/login"); // Kullanıcıyı login sayfasına yönlendiriyoruz
  };

  return (
    <nav>
      <div className="responsive-nav">
        <div className="w-full max-w-full h-auto px-4 sm:px-6 py-2 sm:py-4 bg-[#4B657B] rounded-md flex justify-between items-center gap-2">
          <h2 className="responsive-nav-heading text-white text-base sm:text-lg md:text-xl lg:text-2xl">
            Remote-tech Admin Page
          </h2>
          <div className="flex-grow"></div>
          {/* Logout butonu */}
          <div className="flex flex-col items-center text-white">
            <button onClick={handleLogout} className="text-xl">
              <FaSignOutAlt />
            </button>
            <span className="text-xs">Logout</span> {/* Logout yazısı */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
