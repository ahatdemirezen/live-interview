import React, { useState, useEffect } from "react";
import useInterviewStore from "../../stores/InterviewListPageStore";
import InterviewCard from "./InterviewCard";
import AddInterviewModal from "./AddInterviewModal";
import SideBar from "../../components/SideBar";
import Button from "../../components/buttonComponent";
import Header from "../../components/header";
import { MdPostAdd } from "react-icons/md";
import SearchBar from "../../components/searchBar";
import PaginationComponent from "../../components/paginationComponent";

const InterviewList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const { interviews, fetchInterviews } = useInterviewStore();

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleInterviewAdded = () => {
    fetchInterviews();
  };

  const filteredInterviews = interviews.filter((interview) =>
    interview.interviewTitle && interview.interviewTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

   const itemsPerPage = 8;  // Sayfa başına gösterilecek öğe sayısı
   const totalPages = Math.ceil(filteredInterviews.length / itemsPerPage); 

  // Sayfa başına gösterilecek öğeleri hesapla
  const indexOfLastInterview = page * itemsPerPage; // Sonraki öğe
  const indexOfFirstInterview = indexOfLastInterview - itemsPerPage; // İlk öğe
  const currentInterviews = filteredInterviews.slice(indexOfFirstInterview, indexOfLastInterview); // Şu anki sayfada gösterilecek öğeler

  return (
    <div className="flex flex-col lg:flex-row bg-gray-100 min-h-screen">
      {/* Sidebar - Sadece büyük ekranlarda sol tarafta gösterilecek */}
      <SideBar />
      {/* Ana içerik alanı */}
      <div className="flex-1 lg:ml-64 p-4 md:p-6 bg-gray-100">
        <Header />
        {/* Başlık ve arama butonu */}
        <div className="bg-white shadow-md rounded-md p-4 md:p-6 mt-5">
          <div className="flex flex-col md:flex-row justify-between items-center mb-2">
            <h2 className="text-xl md:text-2xl font-semibold text-neutral-600">Interview List</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 md:mt-0">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search interviews..." />
              <Button icon={<MdPostAdd className="text-2xl md:text-3xl text-[#5C7C98]" />} onClick={() => setIsModalOpen(true)} />
            </div>
          </div>
        </div>

        {/* Interview Card'ların listelenmesi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
          {currentInterviews.map((interview) => (
            <InterviewCard key={interview._id} interview={interview} />
          ))}
        </div>
        <PaginationComponent page={page} totalPages={totalPages} setPage={setPage}/>
      </div>
     
     {/* Modal'ın Açık olup olmadığını kontrol ediyoruz */}
      {isModalOpen && (
        <AddInterviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onInterviewAdded={handleInterviewAdded}
        />
      )}
    </div>
  );
};

export default InterviewList;
