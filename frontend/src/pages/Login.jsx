import React, { useState } from "react";
import Image from "../assets/image.png"; // Resmi import edin

const Login = () => {
  const [showPassword, setShowPassword] = useState(false); // Şifreyi gösterme durumu

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-100 flex justify-center items-center">
        <img
          src={Image} // Burada import edilen resmi kullanın
          alt="Illustration"
          className="max-w-md"
        />
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <div className="w-3/4 max-w-sm">
          <div className="text-left mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">
              Hoşgeldiniz
            </h2>
            <p className="text-sm text-gray-600">Hesabınıza giriş yapın</p>
          </div>
          <form>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 font-bold mb-2">
                E-mail
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                placeholder="E-mail"
              />
            </div>
            <div className="mb-6 relative">
              <label className="block text-sm text-gray-700 font-bold mb-2">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type={showPassword ? "text" : "password"} // Şifre gösterme durumu
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 py-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)} // Şifreyi gösterme/gizleme
              >
                {showPassword ? "Gizle" : "Göster"}
              </button>
              <div className="text-right">
                <a
                  href="#"
                  className="inline-block align-baseline font-bold text-xs text-red-500 hover:text-red-800"
                >
                  Şifremi Unuttum
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center">
                <input className="mr-2 leading-tight" type="checkbox" />
                <span className="text-xs text-gray-600">Beni Hatırla</span>
              </label>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full text-sm"
                type="submit"
              >
                Giriş Yap
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
