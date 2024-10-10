import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Cookie'yi almak için 'js-cookie' kütüphanesini kullanıyoruz

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token'); // Cookie'den token'ı alıyoruz

  if (!token) {
    // Token yoksa login sayfasına yönlendir
    return <Navigate to="/login" />;
  }

  // Token varsa, child bileşeni render ediyoruz (korunan sayfa)
  return children;
};

export default ProtectedRoute;
