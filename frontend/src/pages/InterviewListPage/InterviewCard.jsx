import React, { useState, useEffect } from "react";
import useInterviewStore from "../../stores/InterviewListPageStore";
import Button from "../../components/buttonComponent";
import dayjs from "dayjs";
import QuestionListModal from "./InterviewQuestionListPopup";
import AddInterviewModal from "./AddInterviewModal"; // AddInterviewModal bileşenini import ediyoruz
import { MdOutlineQuestionMark } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";
import { FaTrash, FaEdit } from "react-icons/fa";
import { GoChevronRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const InterviewCard = ({ interview }) => {
  const deleteInterview = useInterviewStore((state) => state.deleteInterview);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Düzenleme modalı için state
  const [accessError, setAccessError] = useState(false);
  const fetchInterviews = useInterviewStore((state) => state.fetchInterviews); // fetchInterviews'i ekleyin

  const navigate = useNavigate();
  const getQuestionsByInterview = useInterviewStore((state) => state.getQuestionsByInterview);

  const videoCounts = useInterviewStore((state) => state.videoCounts);
  const totalVideos = interview.totalForms || 0;
  const pendingVideos = interview.pendingForms || 0;   
  const isExpired = dayjs(interview.expireDate).isBefore(dayjs());
  const apiUrl = import.meta.env.VITE_BE_URL2;

  useEffect(() => {
    if (accessError) {
      const timer = setTimeout(() => {
        setAccessError(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [accessError]);

  const handleCopyLink = () => {
    if (isExpired) {
      setAccessError(true);
    } else {
      const interviewLink = `${apiUrl}/information-form/${interview._id}`;
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
    await getQuestionsByInterview(interview._id);
    setModalOpen(true);
  };

  const handleSeeVideos = () => {
    navigate(`/interview/${interview._id}/videos`);
  };

  const handleEditClick = () => {
    setEditModalOpen(true); // Düzenleme modalını aç
  };

  return (
    <div className="bg-white p-4 m-4 shadow-xl rounded-3xl relative w-full sm:w-60 h-auto sm:h-60 flex flex-col items-center">
      {/* Sol üst köşedeki yuvarlak bağlantı simgesi */}
      <div className="text-white flex items-center absolute rounded-full py-3 px-3 shadow-xl bg-[#F5A862] left-4 top-4 sm:-top-6">
        <AiOutlineLink className="text-white text-2xl" onClick={handleCopyLink} />
      </div>

      {/* Soru işareti, düzenleme ve silme ikonları */}
      <div className="absolute top-4 right-4 sm:top-1 sm:right-1 flex items-center3">
        <Button icon={<MdOutlineQuestionMark className="text-[#E2BB70] hover:text-[#C59A5A] text-2xl" />} size="sm" onClick={handleOpenModal} />
        <Button icon={<FaEdit className="text-[#ff7f0a] hover:text-[#cc6600] " />} size="sm" onClick={handleEditClick} />
        <Button icon={<FaTrash className="text-[#D9534F] hover:text-[#cc0000]" />} size="sm" onClick={() => deleteInterview(interview._id)} />
      </div>

      {/* Başlık */}
      <h3 className="text-lg sm:text-xl font-bold mb-1 mt-8 text-center text-gray-500 ">{interview.interviewTitle}</h3>

      {/* Aday sayıları */}
      <div className="bg-gray-100 rounded-lg p-2 flex justify-between items-center mt-4 sm:mt-6 shadow-md w-full max-w-xs">
        <div className="text-center">
          <p className="text-xs text-gray-500">TOTAL</p>
          <p className="text-lg sm:text-xl font-bold">{totalVideos}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">ON HOLD</p>
          <p className="text-lg sm:text-xl font-bold">{pendingVideos}</p>
        </div>
      </div>

      {/* Yayın durumu ve videolar */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center text-sm p-4">
        <span className="text-gray-500">{isExpired ? "Unpublished" : "Published"}</span>
        <Button
          size="sm"
          variant="special"
          icon={<GoChevronRight />}
          label="See Videos"
          onClick={handleSeeVideos}
        />
      </div>

      {/* Soru listesi modali */}
      <QuestionListModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

      {/* Düzenleme modali */}
      <AddInterviewModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onInterviewAdded={fetchInterviews} // fetchInterviews fonksiyonunu çağırarak veriyi güncelle
        interviewData={interview} // Güncellenmesi gereken interview verilerini gönderiyoruz
      />

      {/* Erişim hatası mesajı */}
      {accessError && (
        <div className="absolute bottom-12 left-4 right-4 bg-red-100 text-red-700 p-2 rounded-md z-20 shadow-lg">
          <p>Access denied: Interview link is expired.</p>
        </div>
      )}
    </div>
  );
};

export default InterviewCard;
