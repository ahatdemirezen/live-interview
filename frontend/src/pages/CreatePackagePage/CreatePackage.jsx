import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import SideBar from "../../components/SideBar";
import AddQuestionModal from "./QuestionPopup";
import useCreatePackage from "../../stores/CreatePackagePageStore";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import usePackageStore from '../../stores/PackagePageStore'; // Zustand store'u import ediyoruz
import Header from "../../components/Header";
import Button from "../../components/buttonComponent";

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
    <div className="flex flex-col lg:flex-row bg-gray-100 h-screen">
      <SideBar />

      <div className="flex-1 lg:ml-64 p-4 md:p-6 bg-gray-100">
        <Header/>
      {/* Paket başlığını gösteren kısım */}
          <div className="bg-white shadow-md rounded-md p-4 md:p-6 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-neutral-600">{packageTitle || "Loading Package Title..."}</h2>
           <Button onClick={() => {setSelectedQuestion(null);setIsModalOpen(true);}} label="Add Question" variant="outline"/>
              
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <table
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="table-auto w-full text-left"
                >
                  <thead>
                    <tr className="font-semibold text-stone-500">
                      <th className="w-2/12 py-2">Order</th>
                      <th className="w-2/12 py-2">Question</th>
                      <th className="w-2/12 py-2">Time</th>
                      <th className="w-2/12 py-2 ">Delete</th>
                      <th className="w-2/12 py-2 ">Edit</th>
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
                            className="bg-gray-50 hover:bg-gray-100 p-4 rounded-md"
                          >
                            <td className="py-4 px-2">{index + 1}</td>
                            <td className="py-4 px-2">{question.questionText}</td>
                            <td className="py-4 px-2">{question.timeLimit} min</td>
                            <td className="py-4 px-2  text-center align-middle">
                           <Button onClick={() => handleDeleteQuestion(question._id)} icon={<FaTrash className="text-[#D9534F] hover:text-[#cc0000] " />} />
                            </td>
                            <td className="py-4 px-2 text-center align-middle">
                              <Button onClick={() => handleEditQuestion(question)} icon={<FaEdit className="text-[#ff7f0a] hover:text-[#cc6600] " />}/>
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
