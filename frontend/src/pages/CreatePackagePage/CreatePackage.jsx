import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import SideBar from "../../components/SideBar";
import AddQuestionModal from "./QuestionPopup";
import useCreatePackage from "../../stores/CreatePackagePageStore"; // Zustand store'u import ettik

const CreatePackage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { packageId: urlPackageId } = useParams(); // URL'den packageId'yi alıyoruz
  const [packageId, setPackageId] = useState(urlPackageId || null); // packageId state'i

  // Zustand store fonksiyonları
  const packageTitle = useCreatePackage((state) => state.packageTitle); // Zustand'dan packageTitle çekiyoruz
  const questions = useCreatePackage((state) => state.questions);
  const setQuestions = useCreatePackage((state) => state.setQuestions);
  const resetPackage = useCreatePackage((state) => state.resetPackage);
  const getPackageById = useCreatePackage((state) => state.getPackageById);
  const deleteQuestion = useCreatePackage((state) => state.deleteQuestion); // Delete fonksiyonunu ekliyoruz
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

  return (
    <div className="flex h-screen">
      <SideBar />

      <div className="flex-1 ml-64 p-6 bg-gray-100">
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Remote-tech Admin Page</h2>

          {/* Paket başlığını gösteren kısım */}
          <div className="flex justify-between items-center mb-4">
            <div className="border p-2 w-full rounded-md bg-gray-100 text-gray-800">
              {packageTitle || "Loading Package Title..."} {/* Paket başlığı yoksa yükleniyor göster */}
            </div>
            <button
              className="ml-4 bg-green-500 text-white p-2 rounded-full text-xl"
              onClick={() => setIsModalOpen(true)}
            >
              ➕
            </button>
          </div>

          {/* Soruları görüntüleme */}
          <div className="grid grid-cols-5 gap-4 font-semibold text-gray-700 mb-4">
            <div>Order</div>
            <div>Question</div>
            <div>Time</div>
            <div>Action</div>
          </div>
          <div className="space-y-4">
            {/* Soru listesi */}
            {questions.map((question, index) => (
              <div key={question._id || index} className="grid grid-cols-5 gap-4 items-center bg-gray-50 p-4 rounded-md shadow">
                <div className="text-lg">{question.questionText}</div>
                <div className="text-lg">{question.timeLimit} min</div>
                <div className="flex items-center justify-center">
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteQuestion(question._id)}  // Soru silme işlevini burada tetikleme
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Toplam Soru Sayısı */}
          <div className="mt-4">
            <p className="font-semibold">Total Questions: {totalQuestions}</p>
          </div>
        </div>
      </div>

      <AddQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packageId={packageId}  // packageId'yi buradan modal'a geçiyoruz
        onAddQuestion={handleAddQuestion}  // Yeni soru eklendiğinde state'i güncelle
      />
    </div>
  );
};

export default CreatePackage;
