import React, { useState } from "react";
import useInterviewStore from "../../stores/InterviewListPageStore";
import InterviewCard from "./InterviewCard";
import AddInterviewModal from "./AddInterviewModal";
import SideBar from "../../components/SideBar";
import Button from "../../components/buttonComponent";
import Header from "../../components/header";

const InterviewList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const interviews = useInterviewStore((state) => state.interviews);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideBar />
      <div className="flex-1 md:ml-64 p-4 md:p-6 bg-gray-100">
        <Header />
        <div className="bg-white shadow-md rounded-md p-4 md:p-6 mt-5">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-semibold">Interview List</h2>
            <Button icon="➕" onClick={() => setIsModalOpen(true)} variant="secondary" rounded="rounded-full"/>
          </div>
        </div>
        <div className="flex flex-wrap justify-start mt-5 gap-4">
          {interviews.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <AddInterviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default InterviewList;