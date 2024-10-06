import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Packages from "./pages/packages";
import CreatePackage from "./pages/createPackage";  // CreatePackage bileşenini ekledik

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Rotalar */}
        <Routes>
          <Route path="/packages" element={<Packages />} />
          <Route path="/create-package" element={<CreatePackage />} /> {/* CreatePackage rotası */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
