import React from 'react';
import Modal from "../../components/modal";
import useInterviewStore from '../../stores/InterviewListPageStore';

const QuestionListModal = ({ isOpen, onClose }) => {
  const questions = useInterviewStore((state) => state.questions); // Store'dan soruları alıyoruz
 
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Question List">
      {/* Soruların bulunduğu kapsayıcı div'e sabit yükseklik ve kaydırma özelliği ekledik */}
      <div className="space-y-4 max-h-96 overflow-y-auto p-4">
        {questions.length > 0 ? ( // Sorular varsa map ile gösterelim
          questions.map((question, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm"
            >
              <span className="text-gray-700">{question.questionText}</span>
              <span className="text-gray-500">{question.timeLimit} min</span>
            </div>
          ))
        ) : (
          <p>No questions available.</p> // Eğer sorular yoksa bir mesaj gösterelim
        )}
      </div>
    </Modal>
  );
};

export default QuestionListModal;
