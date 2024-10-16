import React from 'react';
import VideoRecorder from './RecordVideo';
import QuestionPanel from './QuestionPanel';
import {useParams} from 'react-router-dom';


const InterviewPage = () => { // interviewId prop'u ekleniyor
    const { interviewId } = useParams(); 

    console.log("Interview ID:", interviewId);

 

  return (
    <div className="flex flex-col h-screen">
      <div className="h-10 bg-gray-200 flex items-center justify-center">
        <div className="w-full bg-green-500 h-full" style={{ width: '80%' }}></div> {/* Progress Bar */}
      </div>
      <div className="flex flex-grow">
        <div className="w-1/2 p-4">
          <VideoRecorder />
        </div>
        <div className="w-1/2 p-4">
          <QuestionPanel interviewId={interviewId} /> {/* interviewId prop'u iletiliyor */}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
