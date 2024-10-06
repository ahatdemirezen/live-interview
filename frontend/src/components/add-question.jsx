import React, { useState } from "react";

const AddQuestionModal = ({ onClose, onAdd }) => {
  const [question, setQuestion] = useState("");
  const [time, setTime] = useState("2 min");

  const handleSubmit = () => {
    if (question) {
      onAdd(question, time);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Question</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">✖</button>
        </div>

        {/* Soru Girişi */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Question</label>
          <textarea
            className="border p-2 w-full rounded"
            placeholder="Input..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        {/* Süre Girişi */}
        <div className="flex space-x-4 mb-4">
          <div className="flex items-center">
            <input
              type="text"
              className="border p-2 rounded w-16"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <span className="ml-2">min</span>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;