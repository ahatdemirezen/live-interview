import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useInterviewStore from '../stores/InterviewFetchStore';
import useMediaStore from '../stores/RecordVideoStore';

const QuestionPanel = ({ formId }) => {
  const { interviewId } = useParams();
  const { questions, getQuestionsByInterview, fetchInterviewSettings, canSkip, showAtOnce } = useInterviewStore();
  const { uploadMedia, setUserAlert } = useMediaStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [_, setVideoURL] = useState(null);
  const [stream, setStream] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [totalTime, setTotalTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [submitButtonVisible, setSubmitButtonVisible] = useState(false);

  const videoRef = useRef(null);
  const previewStreamRef = useRef(null);
  const navigate = useNavigate();

  // Sekme değişimini yakalayan ve alert durumunu güncelleyen useEffect
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setUserAlert(formId, true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [formId, setUserAlert]);

  // Soruları ve ayarları çekme
  useEffect(() => {
    const fetchQuestionsAndSettings = async () => {
      await getQuestionsByInterview(interviewId);
      await fetchInterviewSettings(interviewId);
    };
    fetchQuestionsAndSettings();
  }, [interviewId, getQuestionsByInterview, fetchInterviewSettings]);

  // Total zamanı hesaplama
  useEffect(() => {
    if (questions.length > 0) {
      const calculatedTotalTime = questions.reduce(
        (acc, question) => acc + (question.timeLimit ? question.timeLimit * 60 : 0),
        0
      );
      setTotalTime(calculatedTotalTime);
    }
  }, [questions]);

  // Mevcut sorunun süresini ayarlama
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion.timeLimit) {
        setTimeRemaining(currentQuestion.timeLimit * 60);
      }
    }
  }, [questions, currentQuestionIndex]);

  // Zamanlayıcı başlatma
  const startTimer = () => {
    if (timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime === 1) {
            clearInterval(interval);
            handleSkip();
          }
          return prevTime - 1;
        });
        setTotalTime((prevTotal) => prevTotal - 1);
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    }
  };

  // Sorular arasında geçiş
  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      clearInterval(timerInterval);
      setTimeRemaining(questions[currentQuestionIndex + 1]?.timeLimit * 60 || 0);
      startTimer();
    }
  };

  // Video kaydını başlatma
  const handleStartRecording = async () => {
    try {
      if (isPreviewing && previewStreamRef.current) {
        previewStreamRef.current.getTracks().forEach((track) => track.stop());
        setIsPreviewing(false);
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      videoRef.current.srcObject = stream;
      recorder.start();
      setStream(stream);
      setIsRecording(true);
      startTimer();
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const blob = new Blob([event.data], { type: 'video/webm' });
          setVideoBlob(blob);
          const videoUrl = URL.createObjectURL(blob);
          setVideoURL(videoUrl);
        }
      };
    } catch (error) {
      console.error('Medya cihazlarına erişim hatası:', error);
    }
  };

  // Önizleme başlatma
  const handlePreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      previewStreamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsPreviewing(true);
    } catch (error) {
      console.error('Önizleme başlatılamadı:', error);
    }
  };

  // Video kaydını durdurma
  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      clearInterval(timerInterval);
      setSubmitButtonVisible(true);
    }
  };

  // Video yükleme
  const handleSubmit = async () => {
    if (!videoBlob) {
      alert('Lütfen önce bir video kaydedin.');
      return;
    }

    const fileName = `video_${Date.now()}.webm`;

    try {
      await uploadMedia(videoBlob, formId, fileName);
      navigate('/submission-success');
    } catch (err) {
      console.error('Video yüklenirken hata oluştu:', err);
      alert('Video yüklenemedi.');
    }
  };

  // Zaman formatlama
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Pop-up kapatma
  const closePopup = () => setShowPopup(false);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-6 sm:p-9 rounded-lg shadow-2xl max-w-xs sm:max-w-lg w-11/12 sm:w-10/12 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 text-gray-800">Information</h2>
            <p className="text-gray-600 mb-5 sm:mb-7 text-base sm:text-lg">
              Please read and answer all questions carefully during the video interview process. Your total interview time is {formatTime(totalTime)}.
            </p>
            <button
              onClick={closePopup}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* İlerleme Çubuğu */}
      <div className="relative h-3 bg-gray-300 rounded-lg overflow-hidden shadow-inner mb-6">
        <div
          className="h-full bg-green-600 transition-all duration-500 ease-out"
          style={{
            width: isRecording && questions.length > 0
              ? `${((currentQuestionIndex + 1) / questions.length) * 100}%`
              : '0%',
          }}
        />
      </div>

      <div className="flex flex-col lg:flex-row h-full gap-6">
        {/* Sol: Video */}
        <div className="flex-1 flex justify-center items-center bg-black rounded-lg shadow-lg p-4">
          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded-lg"
            autoPlay
            muted
          />
        </div>

        {/* Sağ: Sorular ve Zaman */}
        <div className="flex-1 flex flex-col justify-between bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
  {/* Eğer toplu gösterim ayarlanmadıysa veya tek tek gösterim seçildiyse bu alan görünsün */}
     {showAtOnce === true && (
    <div className="text-center">
      <div className="bg-gray-100 text-2xl font-bold text-gray-800 py-2 px-4 rounded-lg shadow-sm">
        {formatTime(timeRemaining)}
      </div>
      <span className="text-sm text-gray-600">Question Time</span>
    </div>
    )}

   {/* Total Time her zaman görüntülenecek */}
  <div className="text-center">
    <div className="bg-gray-100 text-2xl font-bold text-gray-800 py-2 px-4 rounded-lg shadow-sm">
      {formatTime(totalTime)}
    </div>
    <span className="text-sm text-gray-600">Total Time</span>
   </div>
   </div>

          <div
            className={`flex flex-col items-center justify-center space-y-4 overflow-y-auto max-h-[300px] text-center`}
          >
            {questions.length > 0 ? (
              showAtOnce ? (
                <>
             <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-xl">
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                Question {currentQuestionIndex + 1} of {questions.length}
                </h2>
                <p className="text-gray-700 break-words overflow-hidden text-ellipsis max-h-32 line-clamp-5">
                {questions[currentQuestionIndex]?.questionText}
                </p>
             </div>
                  <div className="flex mt-3 space-x-2 justify-center">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-8 rounded-full ${
                          index === currentQuestionIndex ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                questions.map((question, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-xl"
                  >
                  <h2 className="text-lg font-bold text-gray-800 mb-2">
                   Question {index + 1} of {questions.length}
                  </h2>

                 <p className="text-gray-700 break-words overflow-hidden text-ellipsis max-h-32">
                   {question.questionText}
                  </p>
                 </div>
                ))
              )
            ) : (
              <div>Loading questions...</div>
            )}
          </div>

          {/* Butonlar */}
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mt-6 space-y-3 sm:space-y-0 sm:space-x-3">
            {!videoBlob && (
              <>
                {canSkip && showAtOnce && (
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition"
                    onClick={handleSkip}
                    disabled={!isRecording}
                  >
                    Next
                  </button>
                )}
                {!isRecording ? (
                  <>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                      onClick={handlePreview}
                    >
                      Preview
                    </button>
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
                      onClick={handleStartRecording}
                    >
                      Start Recording
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition"
                    onClick={handleStopRecording}
                  >
                    Stop Recording
                  </button>
                )}
              </>
            )}
            {submitButtonVisible && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                onClick={handleSubmit}
              >
                Submit Video
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPanel;
