import React, { useEffect } from "react";
import Modal from "../../components/modal";
import useCreatePackage from "../../stores/CreatePackagePageStore";  // Zustand store import edildi
import TextareaComponent from "../../components/textAreaComponent";
import Button from "../../components/buttonComponent";
import TextInputComponent from "../../components/textInputComponent";

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
     <TextareaComponent placeholder="Input..." value={currentQuestion} onChange={(e) => setCurrentQuestion(e.target.value)} textAreaInputHeader="Question" rows={10}/>

      <div className="flex items-start space-x-4 mb-4">
        <div className="flex items-center">
          <TextInputComponent value={currentTime} onChange={(e) => setCurrentTime(e.target.value)} className="border p-2 rounded w-16"/>
          <span className="ml-2">min</span>
        </div>
        <Button onClick={handleSubmit} label={question ? "Update" : "Add"} variant="outline" className="w-auto mt-2"  rounded="rounded-md"/>
      </div>
    </Modal>
  );
};

export default AddQuestionModal;
