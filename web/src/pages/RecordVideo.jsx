import React, { useRef, useState } from 'react';

const VideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const handleStartRecording = async () => {
    // Kullanıcıdan video ve ses izni isteme
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: 'video/webm',
    });

    // Data elde edildikçe kaydetme
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };

    // Kaydedilen veriyi alıp URL oluşturma
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, {
        type: 'video/webm',
      });
      setVideoURL(URL.createObjectURL(blob));
      recordedChunks.current = [];
    };

    // Kayıt işlemini başlatma
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: '400px' }} />
      <div>
        {!isRecording ? (
          <button onClick={handleStartRecording}>Kayda Başla</button>
        ) : (
          <button onClick={handleStopRecording}>Kaydı Durdur</button>
        )}
      </div>
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
