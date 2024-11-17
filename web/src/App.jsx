import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PersonalInformationForm from "./pages/InformationPage";
import InterviewPage from "./pages/InterviewPage"; // VideoRecorder bileşenini içe aktarıyoruz
import Modal from 'react-modal';
import SubmissionSuccessPage from "./pages/SubmissionSuccessPage";
Modal.setAppElement('#root');

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Rotalar */}
        <Routes>
          <Route path="/information-form/:interviewId" element={<PersonalInformationForm />} />
          <Route path="/interview/:interviewId/:formId" element={<InterviewPage />} /> {/* formId ve interviewId URL'den geliyor */}
          <Route path="/submission-success" element={<SubmissionSuccessPage />} /> {/* formId ve interviewId URL'den geliyor */}
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;
