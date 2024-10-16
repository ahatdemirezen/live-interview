import React, { useEffect, useRef } from 'react';
import useInterviewStore from '../stores/InterviewFetchStore'; // Zustand store'dan state'leri çekiyoruz

const VideoRecorder = () => {
  const { isRecording, videoURL } = useInterviewStore(); // Zustand store'dan gerekli state'leri alıyoruz

  const videoRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      // Kayıt başlıyorsa video akışını başlat
      const handleStartRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      };
      handleStartRecording();
    } else {
      // Kayıt durduğunda video akışını durdur
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isRecording]);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: '400px' }} />
      {videoURL && (
        <div>
          <h4>Kayıt:</h4>
          <video src={videoURL} controls style={{ width: '400px' }} />
        </div>
      )}
    </div>
  );
};

export default VideoRecorder;
