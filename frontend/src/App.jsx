import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import CreatePackage from "./pages/CreatePackagePage/CreatePackage";
import ManagePackages from "./pages/PackagePage/ManagePackages";
import Login from "./pages/Login";  
import Modal from 'react-modal';
import InterviewList from "./pages/InterviewListPage/InterviewList";
import ProtectedRoute from './access-control/auth-controller'; // Koruma bileşenini import ediyoruz
import InterviewVideosPage from "./pages/InterviewVideoCollectionPage/interviewVideos";
Modal.setAppElement('#root');
//free cmmt
const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Rotalar */}
        <Routes>
          {/* Root rotası (/) login sayfasına yönlendirilecek */}
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />  {/* Login rotası */}
          
          {/* Korunan rotalar */}
          <Route 
            path="/packages" 
            element={
              <ProtectedRoute>
                <ManagePackages />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-package" 
            element={
              <ProtectedRoute>
                <CreatePackage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-package/:packageId" 
            element={
              <ProtectedRoute>
                <CreatePackage />
              </ProtectedRoute>
            } 
          />
          <Route
           
            path="/interview-list" 
            element={
              <ProtectedRoute>
                <InterviewList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/interview/:interviewId/videos" 
            element={
              <ProtectedRoute>
                <InterviewVideosPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;