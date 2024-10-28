import React, { useState, useEffect } from "react";
import useInterviewStore from "../../stores/InterviewListPageStore";
import InterviewCard from "./InterviewCard";
import AddInterviewModal from "./AddInterviewModal";
import SideBar from "../../components/SideBar";
import Button from "../../components/buttonComponent";
import Header from "../../components/header";
import { MdPostAdd } from "react-icons/md";
import SearchBar from "../../components/searchBar";

const InterviewList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery]= useState('');
  // Zustand store'dan interviews ve fetchInterviews fonksiyonunu alıyoruz
  const { interviews, fetchInterviews } = useInterviewStore();

  // Component mount olduğunda fetchInterviews fonksiyonunu çağırıyoruz
  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // Modal kapandıktan sonra interview listesini yenileyecek fonksiyon
  const handleInterviewAdded = () => {
    fetchInterviews();  // Yeni interview eklendikten sonra listeyi güncelliyoruz
  };

  const filteredInterviews =interviews.filter((interview)=>
  interview.interviewTitle && interview.interviewTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row bg-gray-100 h-screen">
      <SideBar />
      <div className="flex-1 md:ml-64 p-4 md:p-6 bg-gray-100">
        <Header />
        <div className="bg-white shadow-md rounded-md p-4 md:p-6 mt-5">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-stone-500">Interview List</h2>
            <SearchBar value={searchQuery} onChange={setSearchQuery}/>
            <Button icon={<MdPostAdd className="text-4xl md:text-3xl text-[#92C7CF]" />} onClick={() => setIsModalOpen(true)}  />
          </div>
        </div>

        {/* Interview Card'ların listelenmesi */}
        <div className="flex flex-wrap justify-start mt-5 gap-4">
          {filteredInterviews.map((interview) => (
            <InterviewCard key={interview._id} interview={interview} />
          ))}
        </div>
      </div>

      {/* Modal'ın Açık olup olmadığını kontrol ediyoruz */}
      {isModalOpen && (
        <AddInterviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onInterviewAdded={handleInterviewAdded}  // Modal kapandıktan sonra tetiklenecek fonksiyon
        />
      )}
    </div>
  );
};

export default InterviewList;
