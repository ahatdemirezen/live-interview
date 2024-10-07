import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import SideBar from "../../components/SideBar";
import AddQuestionModal from "./QuestionPopup";
import useCreatePackage from "../../stores/CreatePackagePageStore";


const CreatePackage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

 

  const packageTitle =  useCreatePackage((state) => state.packageTitle);
  const questions = useCreatePackage((state) => state.questions);
  const setPackageTitle = useCreatePackage((state) => state.setPackageTitle);
  const removeQuestion = useCreatePackage((state) => state.removeQuestion);
  const resetPackage = useCreatePackage((state) => state.resetPackage);


  const handleSave = () => {
    console.log("Package Title:", packageTitle);
    console.log("Questions:", questions);
   
    resetPackage();
    navigate('/packages');
  };

  return (
    <div className="flex h-screen">
      <SideBar />

      <div className="flex-1 ml-64 p-6 bg-gray-100">
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Remote-tech Admin Page</h2>

          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Package Title..."
              className="border p-2 w-full rounded-md"
              value={packageTitle}
              onChange={(e) => setPackageTitle(e.target.value)}
            />
            <button
              className="ml-4 bg-green-500 text-white p-2 rounded-full text-xl"
              onClick={() => setIsModalOpen(true)}
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
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              onClick={() => navigate('/packages')}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Modal'ı göster */}
      <AddQuestionModal
         isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}  
      />

    </div>
  );
};

export default CreatePackage;
