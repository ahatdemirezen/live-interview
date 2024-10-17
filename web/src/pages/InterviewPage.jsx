import React from 'react';
import QuestionPanel from './QuestionPanel';
import { useParams } from 'react-router-dom';

const InterviewPage = () => {
  const { interviewId, formId } = useParams(); // URL'den interviewId ve formId'yi alıyoruz

  return (
    <div className="flex flex-col h-screen bg-white"> {/* Sayfanın tamamına beyaz arka plan ekledik */}
      <div className="flex flex-grow">
        <div className="w-full p-4">
          <QuestionPanel interviewId={interviewId} formId={formId} /> {/* interviewId ve formId'yi geçiriyoruz */}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
