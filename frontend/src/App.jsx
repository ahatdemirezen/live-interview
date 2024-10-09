import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreatePackage from "./pages/CreatePackagePage/CreatePackage";
import ManagePackages from "./pages/PackagePage/ManagePackages";// CreatePackage bileşenini ekledik
import Login from "./pages/Login";  // Login bileşenini ekledik
import Modal from 'react-modal';
Modal.setAppElement('#root');

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Rotalar */}
        <Routes>
          <Route path="/login" element={<Login />} />  {/* Login rotası */}
          <Route path="/packages" element={<ManagePackages />} />
          <Route path="/create-package" element={<CreatePackage />} /> {/* CreatePackage rotası */}
          <Route path="/create-package/:packageId" element={<CreatePackage />} /> {/* Paket Düzenleme */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
