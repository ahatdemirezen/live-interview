import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa'; // FontAwesome'dan silme ve düzenleme ikonları
import SideBar from "../../components/SideBar";
import AddQuestionModal from "./QuestionPopup"; // Bunu soru ekleme ve düzenleme için kullanacağız
import useCreatePackage from "../../stores/CreatePackagePageStore"; // Zustand store'u import ettik

const CreatePackage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null); // Seçilen soruyu burada tutacağız
  const { packageId: urlPackageId } = useParams(); // URL'den packageId'yi alıyoruz
  const [packageId, setPackageId] = useState(urlPackageId || null); // packageId state'i

  // Zustand store fonksiyonları
  const packageTitle = useCreatePackage((state) => state.packageTitle);
  const questions = useCreatePackage((state) => state.questions);
  const setQuestions = useCreatePackage((state) => state.setQuestions);
  const resetPackage = useCreatePackage((state) => state.resetPackage);
  const getPackageById = useCreatePackage((state) => state.getPackageById);
  const deleteQuestion = useCreatePackage((state) => state.deleteQuestion); // Delete fonksiyonunu ekliyoruz
  const updateQuestion = useCreatePackage((state) => state.updateQuestion); // Update fonksiyonunu da ekliyoruz
  const totalQuestions = questions.length;

  useEffect(() => {
    if (urlPackageId) {
      setPackageId(urlPackageId);
      getPackageById(urlPackageId); // getPackageById fonksiyonu, packageTitle ve diğer verileri günceller
    } else {
      resetPackage(); // Eğer packageId yoksa, reset yapıyoruz
    }
  }, [urlPackageId, getPackageById, resetPackage]);

  // Soru ekleme işlevi - eklenen soruyu güncelleme
  const handleAddQuestion = async (newQuestion) => {
    setQuestions([...questions, newQuestion]);

    // Soruyu ekledikten sonra paketi yeniden getir (sayfayı yenilemeden)
    await getPackageById(packageId);  // Paket detaylarını tekrar çek
  };

  // Soru silme işlevi
  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestion(questionId);  // Silme fonksiyonunu çağırıyoruz
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  // Soru güncelleme butonuna basıldığında modal açma
  const handleEditQuestion = (question) => {
    setSelectedQuestion(question); // Seçilen soruyu state'e set ediyoruz
    setIsModalOpen(true); // Modal'ı açıyoruz
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
                setSelectedQuestion(null); // Yeni soru eklerken seçili soru olmasın
                setIsModalOpen(true);
              }}
            >
              <span>Add</span>&nbsp;<span>Question</span>
            </button>
          </div>

          {/* Soruları görüntüleme */}
          <table className="table-auto w-full text-left">
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
                <tr key={question._id || index} className="bg-gray-50 hover:bg-gray-100 p-4 rounded-md shadow">
                  <td className="py-4">{index + 1}</td>
                  <td className="py-4">{question.questionText}</td>
                  <td className="py-4">{question.timeLimit} min</td>
                  <td className="py-4 text-center">
                    <button
                      className="text-red-600 hover:text-red-800 mr-4"
                      onClick={() => handleDeleteQuestion(question._id)}  // Soru silme işlevi
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditQuestion(question)}  // Edit butonu için işlev
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Toplam Soru Sayısı */}
          <div className="mt-4">
            <p className="font-semibold">Total Questions: {totalQuestions}</p>
          </div>
        </div>
      </div>

      {/* Modal: Soru eklemek ya da düzenlemek için */}
      <AddQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packageId={packageId}
        question={selectedQuestion} // Seçili soru varsa, o veriler modal'a geçer
        onAddQuestion={handleAddQuestion}  // Yeni soru eklendiğinde state'i güncelle
        onUpdateQuestion={updateQuestion} // Soru güncelleme işlevi
      />
    </div>
  );
};

export default CreatePackage;