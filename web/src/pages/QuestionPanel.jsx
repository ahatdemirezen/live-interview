import React, { useState, useEffect } from 'react';
import useInterviewStore from '../stores/InterviewFetchStore'; // Store'u kullanıyoruz

const QuestionPanel = ({ interviewId }) => {
  const { questions, getQuestionsByInterview } = useInterviewStore(); // API'den soruları çekmek için fonksiyon ve state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Soruları çek ve ilk sorunun süresini ayarla
  useEffect(() => {
    const fetchQuestions = async () => {
      await getQuestionsByInterview(interviewId); // API'den soruları çekiyoruz
    };

    fetchQuestions();
  }, [interviewId, getQuestionsByInterview]);

  // Sorular güncellendiğinde, ilk sorunun süresini ayarla (dakikayı saniyeye çeviriyoruz)
  useEffect(() => {
    if (questions.length > 0) {
      setTimeRemaining(questions[0].timeLimit * 60); // Dakikayı saniyeye çeviriyoruz
    }
  }, [questions]);

  // Zamanlayıcı
  useEffect(() => {
    const timer = setInterval(() => {
      if (timeRemaining > 0) {
        setTimeRemaining(timeRemaining - 1);
      } else {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setTimeRemaining(questions[currentQuestionIndex + 1]?.timeLimit * 60 || 0); // Yeni sorunun süresi, dakikayı saniyeye çeviriyoruz
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, currentQuestionIndex, questions]);

  // Skip tuşu ile bir sonraki soruya geçiş
  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeRemaining(questions[currentQuestionIndex + 1]?.timeLimit * 60 || 0); // Yeni sorunun süresi
    }
  };

  // Dakika ve saniye formatına çevirme fonksiyonu
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`; // Dakika:saniye formatı
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md">
      {questions.length > 0 ? (
        <>
          <div className="flex justify-between mb-4">
            <div>Question: {questions[currentQuestionIndex].questionText}</div>
            <div>Time Left: {formatTime(timeRemaining)}</div> {/* Saniyeyi dakika:saniye formatında gösteriyoruz */}
          </div>
          <div className="text-center">
            <button 
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={handleSkip} // Skip tuşuna basıldığında handleSkip çalışacak
            >
              Skip
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded ml-2">Start/Done</button>
          </div>
        </>
      ) : (
        <div>Loading questions...</div>
      )}
    </div>
  );
};

export default QuestionPanel;
