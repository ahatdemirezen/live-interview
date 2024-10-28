import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useInterviewStore from '../stores/InterviewFetchStore'; // Soruları almak için state
import useMediaStore from '../stores/RecordVideoStore'; // Medya upload fonksiyonu ve fileId

const QuestionPanel = ({ interviewId, formId }) => {
  const { questions, getQuestionsByInterview } = useInterviewStore(); // Soruları almak için state
  const { uploadMedia, isLoading, error, fileId } = useMediaStore(); // Medya upload fonksiyonu ve fileId
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false); // Önizleme durumu için state
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null); // Blob verisini tutmak için state
  const [_, setVideoURL] = useState(null);
  const [stream, setStream] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(120); // Başlangıç süresi (2 dakika)
  const [totalTime, setTotalTime] = useState(0); // Başlangıçta 0, dinamik olarak belirlenecek
  const [timerInterval, setTimerInterval] = useState(null);
  const [showPopup, setShowPopup] = useState(true); // Pop-up gösterme durumu
  const videoRef = useRef(null);
  const previewStreamRef = useRef(null); // Önizleme için stream referansı
  const navigate = useNavigate();

  // Soruları çek ve ilk sorunun süresini ayarla
  useEffect(() => {
    const fetchQuestions = async () => {
      await getQuestionsByInterview(interviewId);
    };
    fetchQuestions();
  }, [interviewId, getQuestionsByInterview]);

  // Sorular yüklendiğinde `totalTime`'ı hesapla
  useEffect(() => {
    if (questions.length > 0) {
      // Toplam süreyi hesapla
      const calculatedTotalTime = questions.reduce((acc, question) => {
        return acc + (question.timeLimit ? question.timeLimit * 60 : 0);
      }, 0);
      setTotalTime(calculatedTotalTime); // `totalTime`'ı güncelle
    }
  }, [questions]);

  // Mevcut sorunun timeLimit süresini ayarla
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion.timeLimit) {
        setTimeRemaining(currentQuestion.timeLimit * 60); // Dakika cinsinden gelen timeLimit'i saniyeye çevir
      }
    }
  }, [questions, currentQuestionIndex]);

  // Geri sayım başlatma fonksiyonu
  const startTimer = () => {
    if (timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime === 1) {
            clearInterval(interval);
            handleSkip(); // Süre bittiğinde bir sonraki soruya geç
          }
          return prevTime - 1;
        });
        setTotalTime((prevTotal) => prevTotal - 1); // Total zaman güncelleniyor
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval); // Bileşen kapandığında temizle
    }
  };

  // Sorular arasında geçiş
  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      clearInterval(timerInterval);
      setTimeRemaining(questions[currentQuestionIndex + 1].timeLimit * 60 || 0); // Yeni sorunun timeLimit'ini başlat
      startTimer();
    }
  };

  // Video kaydını başlatma fonksiyonu
  const handleStartRecording = async () => {
    try {
      if (isPreviewing && previewStreamRef.current) {
        previewStreamRef.current.getTracks().forEach(track => track.stop()); // Önizleme stream'ini durdur
        setIsPreviewing(false); // Önizleme modunu kapat
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
          setVideoBlob(blob); // Blob'u state'e kaydet
          const videoUrl = URL.createObjectURL(blob);
          setVideoURL(videoUrl); // Video URL'sini oluştur
        }
      };
    } catch (error) {
      console.error('Medya cihazlarına erişim hatası:', error);
    }
  };

  // Önizleme fonksiyonu
  const handlePreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false, // Sadece video, ses yok
      });
      previewStreamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsPreviewing(true); // Önizleme durumunu true yap
    } catch (error) {
      console.error('Önizleme başlatılamadı:', error);
    }
  };

  // Video kaydını durdurma fonksiyonu
  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      stream.getTracks().forEach((track) => track.stop()); // Kamera ve mikrofonu kapat
      videoRef.current.srcObject = null;
      clearInterval(timerInterval);
    }
  };

  // Video upload işlemi
  const handleSubmit = async () => {
    if (!videoBlob) {
      alert('Lütfen önce bir video kaydedin.');
      return;
    }
  
    // Dinamik dosya ismi oluşturuluyor
    const fileName = `video_${Date.now()}.webm`; // Örnek dosya adı; tarih damgası ekliyoruz
  
    try {
      await uploadMedia(videoBlob, formId, fileName); // Videoyu fileName ile yüklüyoruz
      navigate('/submission-success'); // Başarı sayfasına yönlendir
    } catch (err) {
      console.error('Video yüklenirken hata oluştu:', err);
      alert('Video yüklenemedi.');
    }
  };

  // Geri kalan zamanı dakika ve saniye olarak göstermek için formatlama fonksiyonu
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Pop-up kapatma fonksiyonu
  const closePopup = () => setShowPopup(false);

  return (
    <div className="flex flex-col h-full bg-white">
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
      <div className="relative h-3 bg-gray-300 rounded-lg overflow-hidden shadow-inner">
        <div
          className="h-full bg-green-600 transition-all duration-500 ease-out"
          style={{
            width: isRecording && questions.length > 0
              ? `${((currentQuestionIndex + 1) / questions.length) * 100}%`
              : '0%'
          }}
        />
        {questions.map((_, index) => (
          index !== 0 && (
            <div
              key={index}
              className="absolute h-full border-l-2 border-white"
              style={{ left: `${(index / questions.length) * 100}%` }}
            />
          )
        ))}
      </div>

      <div className="flex h-full p-4 bg-gray-100 rounded-lg shadow-md border-4 border-gray-400">
        {/* Sol taraf: Video */}
        <div className="w-1/2 flex items-center justify-center border-r-4 border-gray-300 p-4">
  <div className="flex justify-center items-center w-full h-full bg-black rounded-lg">
    <video
      ref={videoRef}
      className="w-full h-full object-cover" // object-cover sınıfını ekleyin
      autoPlay
      muted
    />
  </div>
</div>


        {/* Sağ taraf: Zaman ve Soru */}
        <div className="w-1/2 p-4 flex flex-col justify-between">
          {questions.length > 0 ? (
            <>
{/* Zaman alanı */}
<div className="flex flex-row md:flex-row justify-center md:justify-between items-center px-4 py-2 mb-4 space-x-4">
  <div className="flex flex-col items-center">
    <div className="bg-[#d0dcea] text-xl font-bold text-gray-900 py-1 px-3 rounded-lg mb-1 shadow-sm">
      {formatTime(timeRemaining)}
    </div>
    <span className="text-md font-semibold text-gray-700 text-center">Question Time</span>
  </div>
  <div className="flex flex-col items-center">
    <div className="bg-[#d0dcea] text-xl font-bold text-gray-900 py-1 px-3 rounded-lg mb-1 shadow-sm">
      {formatTime(totalTime)}
    </div>
    <span className="text-md font-semibold text-gray-700 text-center">Total Time</span>
  </div>
</div>







{/* Soru alanı */}
<div className="flex flex-col items-center justify-center mb-6 md:mb-8 mt-4 md:mt-6">
  <div className="bg-gray-100 py-10 px-6 md:py-16 md:px-10 rounded-lg shadow-lg w-full max-w-xl text-center">
    {/* Soru başlığı */}
    <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-5 text-gray-800">
      Question {currentQuestionIndex + 1} of {questions.length}
    </h2>
    {/* Sorunun metni */}
    <p className="text-lg md:text-xl text-gray-700">
      {questions[currentQuestionIndex].questionText}
    </p>
  </div>
  {/* Soru geçiş göstergesi */}
  <div className="flex mt-3 md:mt-5 space-x-2">
    {questions.map((_, index) => (
      <div
        key={index}
        className={`h-2 w-8 rounded-full ${index === currentQuestionIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
      />
    ))}
  </div>
</div>


{/* Butonlar */}
<div className="text-center mt-4 md:mt-auto">
  {!videoBlob && (
    <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-2">
      <button
        className="bg-gray-500 text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base"
        onClick={handleSkip}
        disabled={isRecording === false}
      >
        Next
      </button>
      {!isRecording ? (
        <>
          <button
            className="bg-[#224064] text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base"
            onClick={handlePreview}
            disabled={isPreviewing}
          >
            Preview
          </button>
          <button
            className="bg-[#224064] text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base"
            onClick={handleStartRecording}
          >
            Start Recording
          </button>
        </>
      ) : (
        <button
          className="bg-red-500 text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base"
          onClick={handleStopRecording}
        >
          Stop Recording
        </button>
      )}
    </div>
  )}
  {videoBlob && (
    <button
      className="bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base mt-2 md:mt-0"
      onClick={handleSubmit}
    >
      Submit Video
    </button>
  )}
</div>


            </>
          ) : (
            <div>Loading questions...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionPanel;
