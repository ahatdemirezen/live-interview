import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // useNavigate import edildi
import NavBar from "../components/NavBar"; 
import AddQuestionModal from "../components/add-question"; // AddQuestionModal bileşenini ekledik

const CreatePackage = () => {
  const [questions, setQuestions] = useState([
    { id: 1, content: "What is caching?", time: "2 min" },
    { id: 2, content: "What is Big-O notation?", time: "2 min" },
    { id: 3, content: "Can you explain JWT concept?", time: "2 min" },
    { id: 4, content: "What do you expect from this position?", time: "2 min" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal'ın açık/kapalı durumunu takip eder
  const navigate = useNavigate(); // navigate fonksiyonu kullanıma hazır

  const handleAddQuestion = (question, time) => {
    const newQuestion = {
      id: questions.length + 1,
      content: question,
      time: time,
    };
    setQuestions([...questions, newQuestion]); // Yeni soru listeye eklenir
    setIsModalOpen(false); // Modal kapatılır
  };

  return (
    <div className="flex h-screen">
      <NavBar />

      <div className="flex-1 ml-64 p-6 bg-gray-100">
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Remote-tech Admin Page</h2>

          <div className="flex justify-between items-center mb-4">
            {/* Package Title Input */}
            <input
              type="text"
              placeholder="Package Title..."
              className="border p-2 w-full rounded-md"
            />

            {/* + Butonu */}
            <button
              className="ml-4 bg-green-500 text-white p-2 rounded-full text-xl"
              onClick={() => setIsModalOpen(true)} // Modal'ı açmak için state'i true yap
            >
              ➕
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 font-semibold text-gray-700 mb-4">
            <div>Order</div>
            <div>Question</div>
            <div>Time</div>
            <div>Action</div>
          </div>

          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.id}
                className="grid grid-cols-4 gap-4 items-center bg-gray-50 p-4 rounded-md shadow"
              >
                <div className="flex items-center justify-center">
                  <span className="text-xl">≡</span>
                </div>
                <div className="text-lg">{question.content}</div>
                <div className="text-lg">{question.time}</div>
                <div className="flex items-center justify-center">
                  <button className="text-red-600 hover:text-red-800">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button 
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              onClick={() => navigate('/packages')} // Cancel butonuna tıklanıldığında packages sayfasına yönlendirme yapar
            >
              Cancel
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Modal'ı göster */}
      {isModalOpen && (
        <AddQuestionModal
          onClose={() => setIsModalOpen(false)} // Modal'ı kapatır
          onAdd={handleAddQuestion} // Soru ekleme işlemi
        />
      )}
    </div>
  );
};

export default CreatePackage;
