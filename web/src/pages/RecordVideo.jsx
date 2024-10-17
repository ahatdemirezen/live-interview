import React, { useEffect, useRef, useState } from 'react';
import useInterviewStore from '../stores/InterviewFetchStore'; // Zustand store'dan state'leri çekiyoruz

const VideoRecorder = () => {
  const { isRecording } = useInterviewStore(); // Zustand store'dan kaydın başlama durumu
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null); // MediaRecorder referansı
  const [recordedChunks, setRecordedChunks] = useState([]); // Kayıt edilen video parçalarını tutmak için
  const streamRef = useRef(null); // Akışı saklamak için ref

  useEffect(() => {
    const handleStartRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // MediaRecorder oluştur ve video kaydına başla
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]); // Video parçalarını biriktiriyoruz
          }
        };

        mediaRecorder.start(); // Kaydı başlatıyoruz
        console.log("Recording started...");
      } catch (error) {
        console.error("Error starting video stream: ", error);
      }
    };

    if (isRecording) {
      handleStartRecording();
    } else {
      // Kayıt durduğunda
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop(); // MediaRecorder kaydını durdur
        console.log("Recording stopped...");
      }

      // Video akışını kapat
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop()); // Kamera ve mikrofon akışını durdur
        streamRef.current = null;
      }

      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        console.log("Video stream stopped...");
      }
    }

    // Cleanup function to stop stream if component is unmounted
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isRecording]);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: '400px' }} />
    </div>
  );
};

export default VideoRecorder;
