import React from "react";
import useInterviewStore from "../../stores/InterviewListPageStore";
import Button from "../../components/buttonComponent";

const InterviewCard = ({ interview }) => {
  const removeInterview = useInterviewStore((state) => state.removeInterview);

  return (
    <div className="bg-white p-4 m-4 shadow-md rounded-md relative w-64">
      {/* Soru işareti ve link kısmı */}
      <div className="absolute top-1 left-1 text-gray-600">
      <Button icon="❓" size="sm"/>
      </div>
      
      <div className="absolute top-2 right-1 flex space-x-2">
       <Button icon="🔗" label="Copy Link" size="sm" />
        <Button icon="🗑️"  onClick={() => removeInterview(interview.id)} size="sm"/>
      </div>

      {/* Başlık */}
      <h3 className="text-lg font-bold mb-1 mt-3">{interview.interviewTitle}</h3>

      {/* Aday sayıları */}
      <p className="text-sm text-gray-500 mb-2">Candidates:</p>
      <div className="bg-gray-100 rounded-lg p-2 flex justify-between items-center mb-4">
        <div className="text-center">
          <p className="text-xs text-gray-500">TOTAL</p>
          <p className="text-2xl font-bold">{interview.packageId.length}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">ON HOLD</p>
          <p className="text-2xl font-bold">{Math.floor(Math.random() * 10)}</p>
        </div>
      </div>

      {/* Yayın durumu ve videolar */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">Published</span>
        <button className="text-blue-500">See Videos ➡</button>
      </div>
    </div>
  );
};

export default InterviewCard;