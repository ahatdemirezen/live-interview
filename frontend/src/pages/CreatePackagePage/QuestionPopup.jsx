import React, { useEffect } from "react";
import Modal from "../../components/modal";
import useCreatePackage from "../../stores/CreatePackagePageStore";  // Zustand store import edildi

const AddQuestionModal = ({ isOpen, onClose, packageId, onAddQuestion, question, onUpdateQuestion }) => {
  const currentQuestion = useCreatePackage((state) => state.currentQuestion);
  const currentTime = useCreatePackage((state) => state.currentTime);
  const setCurrentQuestion = useCreatePackage((state) => state.setCurrentQuestion);
  const setCurrentTime = useCreatePackage((state) => state.setCurrentTime);
  const addQuestion = useCreatePackage((state) => state.addQuestion);

  // Düzenleme modunda modal açılırken mevcut verileri input'lara set ediyoruz
  useEffect(() => {
    if (question) {
      setCurrentQuestion(question.questionText);
      setCurrentTime(question.timeLimit.toString());
    } else {
      setCurrentQuestion("");
      setCurrentTime("2");
    }
  }, [question, setCurrentQuestion, setCurrentTime]);

  const handleSubmit = async () => {
    if (currentQuestion.trim() === "" || currentTime.trim() === "") {
      alert("Please enter a question and a valid time limit.");
      return;
    }

    try {
      if (question) {
        // Mevcut soru güncelleme
        await onUpdateQuestion(question._id, {
          questionText: currentQuestion,
          timeLimit: parseInt(currentTime, 10),
        });
      } else {
        // Yeni soru ekleme
        await addQuestion(packageId);  // `packageId` ile addQuestion fonksiyonunu çağırıyoruz

        // Yeni soruyu parent component'e ilet
        if (onAddQuestion) {
          const newQuestion = {
            questionText: currentQuestion,
            timeLimit: parseInt(currentTime, 10),
          };
          onAddQuestion(newQuestion);
        }
      }

      // Modal kapatılır
      onClose();

    } catch (error) {
      console.error("Failed to add or update question:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={question ? "Edit Question" : "Add Question"}>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Question</label>
        <textarea
          className="border p-2 w-full rounded"
          placeholder="Input..."
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}  // Zustand ile state yönetimi
        />
      </div>

      <div className="flex space-x-4 mb-4">
        <div className="flex items-center">
          <input
            type="text"
            className="border p-2 rounded w-16"
            value={currentTime}
            onChange={(e) => setCurrentTime(e.target.value)}  // Zustand ile state yönetimi
          />
          <span className="ml-2">min</span>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {question ? "Update" : "Add"}
        </button>
      </div>
    </Modal>
  );
};

export default AddQuestionModal;
