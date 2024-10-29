import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useInterviewStore from "../../stores/InterviewListPageStore";
import axios from "axios";
import VideoPopupContent from "./VideoPopupContent";
import UserInfoPopup from "./UserInfoPopup";
import Button from "../../components/buttonComponent";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
const InterviewVideosPage = () => {
  const { interviewId } = useParams();
  const {
    getPersonalFormsByInterview,
    personalForms,
    openUserInfoModal,
    updateCandidateStatus,
    deleteCandidateAndMedia,
    updateCandidateNote,
    getQuestionsByInterview,
    setVideoCounts,
    questions,
    totalForms,
  } = useInterviewStore();

  const [loading, setLoading] = useState(true);
  const [videoURLs, setVideoURLs] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [note, setNote] = useState("");
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 12;
  const totalPages = Math.ceil(totalForms / limit);

  useEffect(() => {
    getPersonalFormsByInterview(interviewId, page, limit);
  }, [interviewId, page, getPersonalFormsByInterview]);

  const apiUrl = import.meta.env.VITE_BE_URL;

  const fetchVideoURL = async (videoId) => {
    try {
      const response = await axios.post(`${apiUrl}/upload/video-url`, { videoId });
      return response.data.videoUrl;
    } catch (error) {
      console.error("Error fetching video URL:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      if (personalForms.length > 0) {
        const urls = {};
        for (const form of personalForms) {
          if (form.videoId) {
            const url = await fetchVideoURL(form.videoId);
            if (url) urls[form.videoId] = url;
          }
        }
        setVideoURLs(urls);
        setLoading(false);
      }
    };
    fetchVideos();
  }, [personalForms]);

  const openModal = async (videoUrl, formId, formStatus, videoId, formNote) => {
    setSelectedVideo(videoUrl);
    setSelectedFormId(formId);
    setSelectedVideoId(videoId);
    setStatus(formStatus);
    setNote(formNote || "");
    await getQuestionsByInterview(interviewId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setSelectedFormId(null);
    setSelectedVideoId(null);
    setIsModalOpen(false);
  };

  const toggleStatus = (newStatus) => {
    setStatus(newStatus);
  };

  const handleDelete = async (formId, videoId) => {
    try {
      await deleteCandidateAndMedia(formId, videoId);
    } catch (error) {
      console.error("Error deleting candidate and media:", error);
    }
  };

  const handleSaveNote = async () => {
    if (selectedFormId) {
      try {
        await updateCandidateStatus(selectedFormId, status);
        await updateCandidateNote(selectedFormId, note);
        closeModal();
      } catch (error) {
        console.error("Error saving note and status:", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-center text-neutral-600">
        Interview Video Collection
      </h1>
      <div className="grid grid-cols-3 gap-4">
        {personalForms.map((form) => (
          <div
            key={form._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 relative"
            onClick={() => openModal(videoURLs[form.videoId], form._id, form.status, form.videoId, form.note)}
          >
            
            <div className={`absolute top-2 left-2 w-4 h-4 rounded-full ${form.status === "passed" ? "bg-green-400" : form.status === "failed" ? "bg-red-400" : "bg-gray-400"}`} title={form.status === "passed" ? "Passed" : form.status === "failed" ? "Failed" : "Pending"}></div>
            
            {/* Bu alana stopPropagation ekliyoruz */}
            <div className="bg-[#80ACD2] px-6 py-4 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
          
              <h2 className="ml-4 font-semibold text-lg text-slate-100 flex-grow">
                {form.name} {form.surname}
              </h2>

              <Button onClick={(e) => {e.stopPropagation(); openUserInfoModal(form);}} icon={<AiOutlineInfoCircle className="text-2xl md:text-2xl text-[#F2D096] absolute right-20 top-5"/>}  />
              <Button onClick={(e) => {e.stopPropagation();handleDelete(form._id, form.videoId);}} icon={<AiOutlineClose className="text-2xl md:text-2xl text-[#D9534F] absolute right-5 top-5"/>} />
            </div>
            
            <div className="bg-stone-200 h-48 flex items-center justify-center">
              {videoURLs[form.videoId] ? (
                <video
                  className="h-full w-full object-cover"
                  src={videoURLs[form.videoId]}
                  muted
                  controls={false}
                  preload="metadata"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197 2.132A1 1 0 0110 12.441V7.558a1 1 0 011.555-.832l3.197 2.132a1 1 0 010 1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11A7.5 7.5 0 114.95 7.905" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-8 space-x-2 text-[#4B657B]">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-full hover:bg-[#4B657B] hover:text-white disabled:opacity-50"
        >
          &laquo; Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`px-3 py-1 rounded-full ${page === index + 1 ? 'bg-[#4B657B] text-white' : 'text-[#4B657B]'} hover:bg-[#4B657B] hover:text-white`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded-full hover:bg-[#4B657B] hover:text-white disabled:opacity-50"
        >
          Next &raquo;
        </button>
      </div>

      <VideoPopupContent
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedVideo={selectedVideo}
        questions={questions}
        note={note}
        setNote={setNote}
        status={status}
        toggleStatus={toggleStatus}
        handleSaveNote={handleSaveNote}
      />

      <UserInfoPopup />
    </div>
  );
};

export default InterviewVideosPage;
