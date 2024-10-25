import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useInterviewStore from "../../stores/InterviewListPageStore"; // Store'dan verileri çekmek için
import axios from "axios";
import Modal from "../../components/modal"; // Sizin modal componentinizi buraya import ediyoruz

const InterviewVideosPage = () => {
  const { interviewId } = useParams(); // URL'deki interviewId'yi alıyoruz
  const { getPersonalFormsByInterview, personalForms, updateCandidateStatus, deleteCandidateAndMedia } = useInterviewStore(); // updateCandidateStatus ve deleteCandidateAndMedia fonksiyonlarını ekledik

  const [loading, setLoading] = useState(true);
  const [videoURLs, setVideoURLs] = useState({}); // Her videoId için URL'leri tutacak state
  const [selectedVideo, setSelectedVideo] = useState(null); // Açılacak video için state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal açılıp kapanma kontrolü
  const [status, setStatus] = useState(false); // Status durumu için state
  const [selectedFormId, setSelectedFormId] = useState(null); // Seçilen formId'yi tutmak için state
  const [selectedVideoId, setSelectedVideoId] = useState(null); // Seçilen videoId'yi tutmak için state

  // Belirli bir videoId için video URL'sini getir
  const fetchVideoURL = async (videoId) => {
    if (!videoId) {
      console.error("No videoId provided");
      return null;
    }

    try {
      const response = await axios.post(`http://localhost:5002/api/upload/video-url`, {
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

  // Modal açma ve video seçme işlemi (formId ve status'ü de ayarlıyoruz)
  const openModal = (videoUrl, formId, formStatus, videoId) => {
    setSelectedVideo(videoUrl);
    setSelectedFormId(formId); // FormId'yi ayarla
    setSelectedVideoId(videoId); // VideoId'yi ayarla
    setStatus(formStatus); // Formun mevcut status durumunu ayarla
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
        onClick={() => openModal(videoURLs[form.videoId], form._id, form.status, form.videoId)}
      >
        {/* Statü Gösterge Düğmesi */}
        <div
          className={`absolute top-2 left-2 w-4 h-4 rounded-full ${
            form.status === "passed"
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
  <Modal isOpen={isModalOpen} onClose={closeModal} title="Interview Video">
    {selectedVideo ? (
      <div className="flex flex-col items-center">
        <video controls width="600" className="mb-4">
          <source src={selectedVideo} type="video/webm" />
          Your browser does not support the video tag.
        </video>

        {/* Checkbox Statü Seçim Alanı */}
        <div className="mt-4">
          <label htmlFor="passedStatus" className="inline-flex items-center">
            <input
              type="checkbox"
              id="passedStatus"
              checked={status === "passed"}
              onChange={() => toggleStatus("passed")}
              className="form-checkbox h-5 w-5 text-green-500"
            />
            <span className="ml-2 text-gray-600">Passed</span>
          </label>

          <label htmlFor="failedStatus" className="inline-flex items-center ml-4">
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

        {/* Silme Butonu */}
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleDelete}
        >
          Delete Candidate and Video
        </button>
      </div>
    ) : (
      <p>No video available</p>
    )}
  </Modal>
</div>
  );
};

export default InterviewVideosPage;
