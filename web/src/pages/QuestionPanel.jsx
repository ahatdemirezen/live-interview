import React, { useState, useEffect, useRef } from 'react';
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
  const [videoURL, setVideoURL] = useState(null); // Kaydedilen video URL'si
  const [stream, setStream] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const videoRef = useRef(null);
  const previewStreamRef = useRef(null); // Önizleme için stream referansı
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
      // Önizleme modunu kapatıyoruz
      if (isPreviewing && previewStreamRef.current) {
        previewStreamRef.current.getTracks().forEach(track => track.stop()); // Önizleme stream'ini durdur
        setIsPreviewing(false); // Önizleme modunu kapat
      }
      // Kayıt için yeni bir stream başlat
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      videoRef.current.srcObject = stream;
      recorder.start();
      setStream(stream);
      setIsRecording(true);
      // Sorunun süresini kayda başladıktan sonra başlat
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
  // Önizleme fonksiyonu - sadece video göster, kayıt başlama
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
      <div className="relative h-6 bg-gray-300 rounded-lg overflow-hidden shadow-inner"> {/* Yüksekliği ve arka plan rengini değiştirdik */}
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
          <div className="flex justify-center items-center w-4/5 h-[500px] bg-black rounded-lg">
            <video ref={videoRef} className="w-full h-full" autoPlay muted />
          </div>
        </div>
        {/* Sağ taraf: Zaman ve Soru */}
        <div className="w-1/2 p-4 flex flex-col justify-between">
          {questions.length > 0 ? (
            <>
              {/* Zaman alanı */}
              <div className="flex justify-between items-center p-2 mb-4 bg-gray-100 border-b-2 border-gray-300">
                <div>Question Time: {formatTime(timeRemaining)}</div>
              </div>
              {/* Soru alanı */}
              <div className="flex flex-col items-start justify-start mb-4 mt-6">
                <div className="bg-gray-200 p-4 rounded-lg shadow-sm w-full">
                  {/* Sorunun metni */}
                  <p className="mb-2">
                    {questions[currentQuestionIndex].questionText}
                  </p>
                </div>
              </div>
              {/* Butonlar */}
              <div className="text-center mt-auto">
                {!videoBlob && (
                  <>
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                      onClick={handlePreview} // Önizleme butonu
                      disabled={isPreviewing || isRecording} // Önizleme veya kayıt sırasında devre dışı bırak
                    >
                      Preview
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                      onClick={handleSkip}
                      disabled={isRecording === false}
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
                  </>
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