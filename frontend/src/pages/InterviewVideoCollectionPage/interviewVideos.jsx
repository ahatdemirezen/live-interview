// InterviewVideosPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useInterviewStore from "../../stores/InterviewListPageStore";
import axios from "axios";
import VideoPopupContent from "./VideoPopupContent";
import UserInfoPopup from "./UserInfoPopup";
import Button from "../../components/buttonComponent";
import SearchBar from "../../components/searchBar";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa"; // Kırmızı ünlem ikonu
import PaginationComponent from "../../components/paginationComponent";

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
  const [searchQuery, setSearchQuery] = useState(""); // Arama sorgusu için state

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

  const filteredForms = personalForms.filter((form) => {
    const fullName = `${form.name} ${form.surname}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-700 text-center">
          Interview Video Collection
        </h1>
        {/* Search bar sağ üstte */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search videos..." />
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredForms.map((form) => (
          <div
            key={form._id}
            className="bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 relative"
            onClick={() => openModal(videoURLs[form.videoId], form._id, form.status, form.videoId, form.note)}
          >
            <div
              className={`absolute top-3 left-3 w-4 h-4 rounded-full border-2 border-white ${
                form.status === "passed" ? "bg-green-400" : form.status === "failed" ? "bg-red-400" : "bg-gray-400"
              }`}
              title={form.status === "passed" ? "Passed" : form.status === "failed" ? "Failed" : "Pending"}
            ></div>

            <div
              className="bg-[#6f95b6] px-6 py-4 flex items-center justify-between text-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="ml-4 font-semibold text-lg flex items-center">
                {form.alert && (
                <FaExclamationTriangle className="text-red-500 text-lg mr-2" title="Attention needed!" />
                    )}
                {form.name} {form.surname}
              </h2>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  openUserInfoModal(form);
                }}
                icon={<AiOutlineInfoCircle className="text-2xl md:text-2xl text-[#F2D096] hover:text-yellow-400 absolute right-20 top-5" />}
              />
              <Button
                icon={
                  <FaTrash className="text-[#D9534F] hover:text-[#cc0000] text-xl md:text-xl absolute right-5 top-5" />
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(form._id, form.videoId);
                }}
              />
            </div>

            <div className="bg-stone-200 h-48 flex items-center justify-center relative">
              {videoURLs[form.videoId] ? (
                <video
                  className="h-full w-full object-cover rounded-b-lg"
                  src={videoURLs[form.videoId]}
                  muted
                  controls={false}
                  preload="metadata"
                />
              ) : (
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
              )}
            </div>
          </div>
        ))}
      </div>

    <PaginationComponent page={page} setPage={setPage} totalPages={totalPages}/>

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
