import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PersonalInformationForm from "./pages/InformationPage";
import VideoRecorder from "./pages/RecordVideo"; // VideoRecorder bileşenini içe aktarıyoruz
import Modal from 'react-modal';

Modal.setAppElement('#root');

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Rotalar */}
        <Routes>
          <Route path="/information-form/:interviewId" element={<PersonalInformationForm />} />
          <Route path="/video-recorder" element={<VideoRecorder />} /> {/* Video kaydedici rotası */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
