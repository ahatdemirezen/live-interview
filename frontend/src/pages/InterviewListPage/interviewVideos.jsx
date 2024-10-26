import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useInterviewStore from "../../stores/InterviewListPageStore"; // Store'dan verileri çekmek için
import axios from "axios";
import ModalForVideos from "../../components/modalForVideos"; // Sizin modal componentinizi buraya import ediyoruz

const InterviewVideosPage = () => {
  const { interviewId } = useParams(); // URL'deki interviewId'yi alıyoruz
  const { getPersonalFormsByInterview, personalForms, updateCandidateStatus, deleteCandidateAndMedia, updateCandidateNote, getQuestionsByInterview, questions } = useInterviewStore(); // Fonksiyonları ve soruları ekledik

  const [loading, setLoading] = useState(true);
  const [videoURLs, setVideoURLs] = useState({}); // Her videoId için URL'leri tutacak state
  const [selectedVideo, setSelectedVideo] = useState(null); // Açılacak video için state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal açılıp kapanma kontrolü
  const [status, setStatus] = useState(false); // Status durumu için state
  const [note, setNote] = useState(""); // Not girişi için state
  const [selectedFormId, setSelectedFormId] = useState(null); // Seçilen formId'yi tutmak için state
  const [selectedVideoId, setSelectedVideoId] = useState(null); // Seçilen videoId'yi tutmak için state

  const apiUrl = import.meta.env.VITE_BE_URL; // Backend URL'ini çevresel değişkenden alıyoruz
  console.log(apiUrl); // apiUrl doğru mu kontrol edin

  // Belirli bir videoId için video URL'sini getir
  const fetchVideoURL = async (videoId) => {
    if (!videoId) {
      console.error("No videoId provided");
      return null;
    }

    try {
      const response = await axios.post(`${apiUrl}/upload/video-url`, {
        videoId: videoId, // Body'ye videoId ekleniyor
      });

      const videoUrl = response.data.videoUrl; // Gelen video URL'sini döndür
      return videoUrl;
    } catch (error) {
      console.error("Error fetching video URL:", error);
      return null;
    }
  };

  // İlk aşamada interviewId'ye göre personalForms'u çekiyoruz
  useEffect(() => {
    const fetchForms = async () => {
      await getPersonalFormsByInterview(interviewId); // Store'dan verileri çek
    };
    fetchForms();
  }, [interviewId, getPersonalFormsByInterview]);

  // İkinci aşamada personalForms değişince video URL'lerini çekiyoruz
  useEffect(() => {
    const fetchVideos = async () => {
      if (personalForms.length > 0) {
        const urls = {};
        for (const form of personalForms) {
          if (form.videoId) {
            const url = await fetchVideoURL(form.videoId); // Her form için videoId'ye göre URL al
            if (url) {
              urls[form.videoId] = url;
            }
          }
        }
        setVideoURLs(urls); // URL'leri state'e kaydet
        setLoading(false); // Yükleme tamamlandı
      }
    };
    fetchVideos();
  }, [personalForms]);

  // Modal açma ve video ile soruları seçme işlemi
  const openModal = async (videoUrl, formId, formStatus, videoId, formNote) => {
    setSelectedVideo(videoUrl);
    setSelectedFormId(formId); // FormId'yi ayarla
    setSelectedVideoId(videoId); // VideoId'yi ayarla
    setStatus(formStatus); // Formun mevcut status durumunu ayarla
    setNote(formNote || ""); // Formun mevcut notunu ayarla veya boş string yap
    await getQuestionsByInterview(interviewId); // İlgili interview'a ait soruları çek
    setIsModalOpen(true);
  };

  // Modal kapatma işlemi
  const closeModal = () => {
    setSelectedVideo(null);
    setSelectedFormId(null);
    setSelectedVideoId(null);
    setIsModalOpen(false);
  };

  // Status durumunu toggle eden fonksiyon
  const toggleStatus = async (newStatus) => {
    setStatus(newStatus); // Yeni durumu frontend'de güncelliyoruz
    if (selectedFormId) {
      await updateCandidateStatus(selectedFormId, newStatus); // Zustand fonksiyonunu kullanarak backend'e PATCH isteği atıyoruz
    }
  };

  // Silme işlemi
  const handleDelete = async () => {
    if (selectedFormId && selectedVideoId) {
      try {
        await deleteCandidateAndMedia(selectedFormId, selectedVideoId); // formId ve videoId'yi gönderiyoruz
        closeModal(); // Silme işleminden sonra modal'ı kapatıyoruz
      } catch (error) {
        console.error("Error deleting candidate and media:", error);
      }
    }
  };

  // Notu kaydetme işlemi
  const handleSaveNote = async () => {
    if (selectedFormId) {
      try {
        await updateCandidateNote(selectedFormId, note); // Notu güncelleme isteği
        alert("Note saved successfully!"); // Başarı mesajı
      } catch (error) {
        console.error("Error saving note:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-center text-stone-500">Interview Video Collection</h1>
      <div className="grid grid-cols-3 gap-4">
        {personalForms.map((form) => (
          <div
            key={form._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 relative"
            onClick={() => openModal(videoURLs[form.videoId], form._id, form.status, form.videoId, form.note)}
          >
            {/* Statü Gösterge Düğmesi */}
            <div
              className={`absolute top-2 left-2 w-4 h-4 rounded-full ${form.status === "passed"
                ? "bg-green-400"
                : form.status === "failed"
                  ? "bg-red-400"
                  : "bg-gray-400"
                }`}
              title={
                form.status === "passed"
                  ? "Passed"
                  : form.status === "failed"
                    ? "Failed"
                    : "Pending"
              }
            ></div>
            <div className="bg-[#92C7CF] px-6 py-4">
              <h2 className="font-semibold text-lg text-slate-100">
                {form.name} {form.surname}
              </h2>
            </div>
            <div className="bg-stone-200 h-48 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197 2.132A1 1 0 0110 12.441V7.558a1 1 0 011.555-.832l3.197 2.132a1 1 0 010 1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11A7.5 7.5 0 114.95 7.905"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ModalForVideos isOpen={isModalOpen} onClose={closeModal} className="w-full" title="Interview Video" > {/* Modal genişliği artırıldı */}
        {selectedVideo ? (
          <div className="flex flex-col w-full gap-4 h-full">
            {/* Üst Kısım */}
            <div className="flex flex-col gap-4 h-full">
              {/* Video Alanı */}
              <div className="flex flex-row h-full flex-grow gap-4">
                <video controls className="w-full h-[500px] rounded-lg mb-2"> {/* Video yüksekliği ayarlandı */}
                  <source src={selectedVideo} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
                {/* Sorular ve Not Alanı */}
                <div className="flex flex-col w-full h-[500px] max-w-md ">
                  {/* Sorular Alanı */}
                  <div className="bg-gray-100 h-2/3 p-4 rounded-tl-lg rounded-tr-lg border  overflow-y-auto" > {/* Sorular yüksekliği ayarlandı */}
                    <h3 className="text-lg font-semibold mb-2">Questions</h3>
                    {questions.length > 0 ? (
                      questions.map((question, index) => (
                        <div key={index} className="mb-2">
                          <p className="text-gray-700 text-sm">Q{index + 1}: {question.questionText}</p>
                        </div>
                      ))
                    ) : (
                      <p>No questions available</p>
                    )}
                  </div>

                  {/* Not Girişi Alanı */}
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Enter note here..."
                    className="w-full h-1/3 p-2 border rounded-bl-lg rounded-br-lg"
                  ></textarea>
                </div>


              </div>
              {/* Checkbox Statü Seçim Alanı */}
              <div className="flex justify-start items-center mt-2">
                <label htmlFor="passedStatus" className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    id="passedStatus"
                    checked={status === "passed"}
                    onChange={() => toggleStatus("passed")}
                    className="form-checkbox h-5 w-5 text-green-500"
                  />
                  <span className="ml-2 text-gray-600">Passed</span>
                </label>

                <label htmlFor="failedStatus" className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="failedStatus"
                    checked={status === "failed"}
                    onChange={() => toggleStatus("failed")}
                    className="form-checkbox h-5 w-5 text-red-500"
                  />
                  <span className="ml-2 text-gray-600">Failed</span>
                </label>
              </div>


            </div>

            {/* Alt Kısım - Kaydet ve Sil Butonları */}
            <div className="flex gap-4 justify-end mt-4">
              <button
                onClick={handleSaveNote}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow-lg"
              >
                Save
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Delete Candidate and Video
              </button>
            </div>
          </div>
        ) : (
          <p>No video available</p>
        )}
      </ModalForVideos>


    </div>
  );
};

export default InterviewVideosPage;
