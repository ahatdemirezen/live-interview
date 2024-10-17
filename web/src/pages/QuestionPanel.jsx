import React, { useState, useEffect, useRef } from 'react';
import useInterviewStore from '../stores/InterviewFetchStore'; // Soruları almak için state
import useMediaStore from '../stores/RecordVideoStore'; // Medya upload fonksiyonu ve fileId

const QuestionPanel = ({ interviewId, formId }) => {
  const { questions, getQuestionsByInterview } = useInterviewStore(); // Soruları almak için state
  const { uploadMedia, isLoading, error, fileId } = useMediaStore(); // Medya upload fonksiyonu ve fileId

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null); // Blob verisini tutmak için state
  const [videoURL, setVideoURL] = useState(null); // Kaydedilen video URL'si
  const [stream, setStream] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const videoRef = useRef(null);

  // Soruları çek ve ilk sorunun süresini ayarla
  useEffect(() => {
    const fetchQuestions = async () => {
      await getQuestionsByInterview(interviewId);
    };
    fetchQuestions();
  }, [interviewId, getQuestionsByInterview]);

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      videoRef.current.srcObject = stream;
      recorder.start();
      setStream(stream);
      setIsRecording(true);

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

    try {
      await uploadMedia(videoBlob, formId); // Videoyu yüklüyoruz

      if (fileId) {
        // Video başarıyla yüklendi ve fileId alındı
        console.log(`File ID ${fileId} başarıyla alındı ve form ile ilişkilendirildi.`);
      } else {
        console.error('Video yüklendi fakat fileId alınamadı.');
      }
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

  return (
    <div className="flex flex-col h-full bg-white">
      {/* İlerleme Çubuğu */}
      <div className="relative h-4 bg-gray-200 flex items-center">
        <div
          className="h-full bg-green-500"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
        {questions.map((_, index) => (
          index !== 0 && (
            <div
              key={index}
              className="absolute h-full border-l border-gray-400"
              style={{ left: `${(index / questions.length) * 100}%` }}
            />
          )
        ))}
      </div>

      <div className="flex h-full p-4 bg-gray-100 rounded shadow-md">
        {/* Sol taraf: Video */}
        <div className="w-1/2 flex items-center justify-center">
          <video ref={videoRef} className="w-full h-auto bg-black" autoPlay muted />
        </div>

        {/* Sağ taraf: Sorular ve butonlar */}
        <div className="w-1/2 p-4 flex flex-col justify-between">
          {questions.length > 0 ? (
            <>
              <div className="mb-4">
                <div className="flex justify-between mb-4">
                  <div>Question: {questions[currentQuestionIndex].questionText}</div>
                  <div>Time Remaining: {formatTime(timeRemaining)}</div>
                </div>
              </div>
              <div className="text-center mt-auto">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleSkip}
                >
                  Skip
                </button>
                {!isRecording ? (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    onClick={handleStartRecording}
                  >
                    Start Recording
                  </button>
                ) : (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                    onClick={handleStopRecording}
                  >
                    Stop Recording
                  </button>
                )}
                {videoBlob && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
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
