import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import SideBar from "../../components/SideBar";
import AddQuestionModal from "./QuestionPopup";
import useCreatePackage from "../../stores/CreatePackagePageStore";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import usePackageStore from '../../stores/PackagePageStore'; // Zustand store'u import ediyoruz

const CreatePackage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const { packageId: urlPackageId } = useParams();
  const [packageId, setPackageId] = useState(urlPackageId || null);

  // Zustand store fonksiyonları
  const packageTitle = useCreatePackage((state) => state.packageTitle);
  const questions = useCreatePackage((state) => state.questions);
  const setQuestions = useCreatePackage((state) => state.setQuestions);
  const resetPackage = useCreatePackage((state) => state.resetPackage);
  const getPackageById = useCreatePackage((state) => state.getPackageById);
  const deleteQuestion = useCreatePackage((state) => state.deleteQuestion);
  const updateQuestion = useCreatePackage((state) => state.updateQuestion);
  const totalQuestions = questions.length;

  // Zustand store'dan `updatePackageOrder` fonksiyonunu alıyoruz
  const updatePackageOrder = usePackageStore((state) => state.updatePackageOrder);

  useEffect(() => {
    if (urlPackageId) {
      setPackageId(urlPackageId);
      getPackageById(urlPackageId);
    } else {
      resetPackage();
    }
  }, [urlPackageId, getPackageById, resetPackage]);

  const handleAddQuestion = async (newQuestion) => {
    setQuestions([...questions, newQuestion]);
    await getPackageById(packageId);
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestion(questionId);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  // Drag-end işlemi (sürükleme işlemi bittiğinde çalışacak fonksiyon)
  const onDragEnd = async (result) => {
    const { destination, source } = result;
    if (!destination) return;

    const updatedQuestions = Array.from(questions);
    const [removed] = updatedQuestions.splice(source.index, 1);
    updatedQuestions.splice(destination.index, 0, removed);

    setQuestions(updatedQuestions);

    // Backend'e gönderilecek veri: Her sorunun id'si ve yeni sequenceNumber'ı
    const reorderedQuestions = updatedQuestions.map((question, index) => ({
      questionId: question._id,
      sequenceNumber: index + 1,
    }));

    // Zustand store'dan gelen `updatePackageOrder` fonksiyonu ile backend'e istek yapıyoruz
    try {
      await updatePackageOrder(packageId, reorderedQuestions);
    } catch (error) {
      console.error('Sıralama kaydedilirken hata oluştu:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <SideBar />

      <div className="flex-1 ml-64 p-6 bg-gray-100">
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Remote-tech Admin Page</h2>

          {/* Paket başlığını gösteren kısım */}
          <div className="flex justify-between items-center mb-4">
            <div className="p-2 w-full rounded-md text-gray-800 font-semibold mt-[-4px]">
              {packageTitle || "Loading Package Title..."}
            </div>

            <button
              className="bg-white text-[#091E42] border border-[#D6D6D6] shadow-md flex items-center justify-center w-[92px] h-[40px] rounded-md px-4 py-2 text-[14px] font-medium leading-[20px] hover:shadow-lg transition-shadow duration-200"
              onClick={() => {
                setSelectedQuestion(null);
                setIsModalOpen(true);
              }}
            >
              <span>Add</span>&nbsp;<span>Question</span>
            </button>
          </div>

          {/* Soruları görüntüleme ve Drag-and-Drop işlemi */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <table
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="table-auto w-full text-left"
                >
                  <thead>
                    <tr className="font-semibold text-gray-700">
                      <th className="w-1/12">Order</th>
                      <th className="w-4/12">Question</th>
                      <th className="w-2/12">Time</th>
                      <th className="w-5/12 text-center">Delete <FaTrash className="inline-block" /> / Edit <FaEdit className="inline-block" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question, index) => (
                      <Draggable key={question._id || index} draggableId={question._id || `${index}`} index={index}>
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-50 hover:bg-gray-100 p-4 rounded-md shadow"
                          >
                            <td className="py-4">{index + 1}</td>
                            <td className="py-4">{question.questionText}</td>
                            <td className="py-4">{question.timeLimit} min</td>
                            <td className="py-4 text-center">
                              <button
                                className="text-red-600 hover:text-red-800 mr-4"
                                onClick={() => handleDeleteQuestion(question._id)}
                              >
                                <FaTrash />
                              </button>
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleEditQuestion(question)}
                              >
                                <FaEdit />
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>

          {/* Toplam Soru Sayısı */}
          <div className="mt-4">
            <p className="font-semibold">Total Questions: {totalQuestions}</p>
          </div>
        </div>
      </div>

      <AddQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packageId={packageId}
        question={selectedQuestion}
        onAddQuestion={handleAddQuestion}
        onUpdateQuestion={updateQuestion}
      />
    </div>
  );
};

export default CreatePackage;
