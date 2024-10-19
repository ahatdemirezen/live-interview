import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useInterviewStore from "../../stores/InterviewListPageStore"; // Store'dan verileri çekmek için
import axios from "axios";
import Modal from "../../components/modal";// Sizin modal componentinizi buraya import ediyoruz

const InterviewVideosPage = () => {
  const { interviewId } = useParams(); // URL'deki interviewId'yi alıyoruz
  const { getPersonalFormsByInterview, personalForms } = useInterviewStore();

  const [loading, setLoading] = useState(true);
  const [videoURLs, setVideoURLs] = useState({}); // Her videoId için URL'leri tutacak state
  const [selectedVideo, setSelectedVideo] = useState(null); // Açılacak video için state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal açılıp kapanma kontrolü

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

  // Modal açma ve video seçme işlemi
  const openModal = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setIsModalOpen(true);
  };

  // Modal kapatma işlemi
  const closeModal = () => {
    setSelectedVideo(null);
    setIsModalOpen(false);
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
            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
             
            onClick={() => openModal(videoURLs[form.videoId])}
          >
            <div className="bg-[#92C7CF] px-6 py-4">
              <h2 className="font-semibold text-lg text-slate-100">{form.name} {form.surname}</h2>
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

      {/* Modal yapısı */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Interview Video"
      >
        {selectedVideo ? (
          <div className="flex flex-col items-center">
            <video controls width="600" className="mb-4">
              <source src={selectedVideo} type="video/webm" />
              Your browser does not support the video tag.
            </video>
           
          </div>
        ) : (
          <p>No video available</p>
        )}
      </Modal>
    </div>
  );
};

export default InterviewVideosPage;
