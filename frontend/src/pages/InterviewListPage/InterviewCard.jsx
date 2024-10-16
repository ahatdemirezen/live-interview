import React, { useState } from "react";
import useInterviewStore from "../../stores/InterviewListPageStore";
import Button from "../../components/buttonComponent";
import dayjs from "dayjs";
import QuestionListModal from "./InterviewQuestionListPopup";

const InterviewCard = ({ interview }) => {
  const deleteInterview = useInterviewStore((state) => state.deleteInterview);
  const [isModalOpen, setModalOpen] = useState(false);
  const [accessError, setAccessError] = useState(false); // Erişim hatası için state ekledik

  const getQuestionsByInterview = useInterviewStore((state) => state.getQuestionsByInterview);

  // Expire date ile bugünün tarihini karşılaştırıyoruz
  const isExpired = dayjs(interview.expireDate).isBefore(dayjs());

  // Interview ID'ye göre link oluşturma ve kopyalama işlemi
  const handleCopyLink = () => {
    if (isExpired) {
      setAccessError(true); // Eğer tarih geçmişse, erişim hatası set ediliyor
    } else {
      const interviewLink = `http://localhost:5174/information-form/${interview._id}`;
      navigator.clipboard.writeText(interviewLink)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  const handleOpenModal = async () => {
    console.log("Interview ID:", interview._id);
    await getQuestionsByInterview(interview._id);
    setModalOpen(true);
  };

  return (
    <div className="bg-white p-4 m-4 shadow-md rounded-md relative w-64">
      {/* Soru işareti ve link kısmı */}
      <div className="absolute top-1 left-1 text-gray-600">
        <Button icon="❓" size="sm" onClick={handleOpenModal} />
      </div>

      <div className="absolute top-2 right-1 flex space-x-2">
        <Button icon="🔗" label="Copy Link" size="sm" onClick={handleCopyLink} />
        <Button icon="🗑️" onClick={() => deleteInterview(interview._id)} size="sm" />
      </div>

      {/* Başlık */}
      <h3 className="text-lg font-bold mb-1 mt-3">{interview.interviewTitle}</h3>

      {/* Aday sayıları */}
      <p className="text-sm text-gray-500 mb-2">Candidates:</p>
      <div className="bg-gray-100 rounded-lg p-2 flex justify-between items-center mb-4">
        <div className="text-center">
          <p className="text-xs text-gray-500">TOTAL</p>
          <p className="text-2xl font-bold">{interview.packageId.length}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">ON HOLD</p>
          <p className="text-2xl font-bold">{Math.floor(Math.random() * 10)}</p>
        </div>
      </div>

      {/* Yayın durumu ve videolar */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">{isExpired ? "Unpublished" : "Published"}</span>
        <button className="text-blue-500">See Videos ➡</button>
      </div>

      <QuestionListModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

      {/* Eğer erişim hatası varsa bu mesajı gösteriyoruz */}
      {accessError && (
        <div className="bg-red-100 text-red-700 p-2 mt-4 rounded-md">
          <p>Access denied: Interview link is expired.</p>
        </div>
      )}
    </div>
  );
};

export default InterviewCard;
