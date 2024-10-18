import React, { useState } from "react";
import useInterviewStore from "../../stores/InterviewListPageStore";
import Button from "../../components/buttonComponent";
import dayjs from "dayjs";
import QuestionListModal from "./InterviewQuestionListPopup";
import { MdOutlineQuestionMark } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";
import { FaTrash } from 'react-icons/fa';
import { GoChevronRight } from "react-icons/go";
import { useNavigate } from "react-router-dom"; // Yönlendirme için useNavigate hook'u

const InterviewCard = ({ interview }) => {
  const deleteInterview = useInterviewStore((state) => state.deleteInterview);
  const [isModalOpen, setModalOpen] = useState(false);
  const [accessError, setAccessError] = useState(false); // Erişim hatası için state ekledik
  const navigate = useNavigate(); // Yönlendirme için useNavigate
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

  // See Videos butonuna basıldığında videolar sayfasına yönlendirme işlemi
  const handleSeeVideos = () => {
    navigate(`/interview/${interview._id}/videos`); // Yönlendirme işlemi
  };

  return (
    <div className="bg-white p-4 m-4 shadow-md rounded-md relative w-60 h-60">
      {/* Soru işareti ve link kısmı */}
      <div className="absolute top-1 left-1 text-gray-600">
        <Button icon={<MdOutlineQuestionMark className="text-red-500 text-2xl" />} size="sm" onClick={handleOpenModal} />
      </div>

      <div className="absolute top-1 right-1 flex items-center space-x-3">
        <Button icon={<AiOutlineLink className="text-stone-400 text-2xl" />} onClick={handleCopyLink} />
        <Button icon={<FaTrash className="text-rose-800 text-xl" />} onClick={() => deleteInterview(interview._id)} />
      </div>

      {/* Başlık */}
      <h3 className="text-lg font-bold mb-1 mt-8 text-center">{interview.interviewTitle}</h3>

      {/* Aday sayıları */}
      <div className="bg-gray-100 rounded-lg p-2 flex justify-between items-center mt-6 shadow-md">
        <div className="text-center">
          <p className="text-xs text-gray-500">TOTAL</p>
          <p className="text-xl font-bold">{interview.packageId.length}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">ON HOLD</p>
          <p className="text-xl font-bold">{Math.floor(Math.random() * 10)}</p>
        </div>
      </div>

      {/* Yayın durumu ve videolar */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center text-sm p-4">
        <span className="text-gray-500">{isExpired ? "Unpublished" : "Published"}</span>
        <Button
          label="See Videos"
          size="sm"
          icon={<GoChevronRight />}
          variant="secondary"
          onClick={handleSeeVideos} // See Videos butonuna tıklanınca handleSeeVideos çalıştırılıyor
        />
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
