import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useInterviewStore from "../../stores/InterviewListPageStore"; // Store'dan verileri çekmek için
import axios from "axios";

const InterviewVideosPage = () => {
  const { interviewId } = useParams(); // URL'deki interviewId'yi alıyoruz
  const { getPersonalFormsByInterview, personalForms } = useInterviewStore();

  const [loading, setLoading] = useState(true);
  const [videoURLs, setVideoURLs] = useState({}); // Her videoId için URL'leri tutacak state

  // Belirli bir videoId için video URL'sini getir
  const fetchVideoURL = async (videoId) => {
    if (!videoId) {
      console.error("No videoId provided");
      return null;
    }

    try {
      // Video ID'yi API'ye body'den POST isteğiyle gönderiyoruz
      const response = await axios.post(`http://localhost:5002/api/upload/video-url`, {
        videoId: videoId, // Body'ye videoId ekleniyor
      });
      
      const videoUrl = response.data.videoUrl; // Gelen video URL'sini döndür
      console.log("Video URL fetched for videoId", videoId, videoUrl);
      return videoUrl;
    } catch (error) {
      console.error("Error fetching video URL:", error);
      return null;
    }
  };

  // İlk aşamada interviewId'ye göre personalForms'u çekiyoruz
  useEffect(() => {
    const fetchForms = async () => {
      await getPersonalFormsByInterview(interviewId); // Store'dan verileri çek
    };
    fetchForms();
  }, [interviewId, getPersonalFormsByInterview]);

  // İkinci aşamada personalForms değişince video URL'lerini çekiyoruz
  useEffect(() => {
    const fetchVideos = async () => {
      if (personalForms.length > 0) {
        const urls = {};
        for (const form of personalForms) {
          if (form.videoId) {
            console.log(`Fetching video for ${form.name} ${form.surname}, videoId: ${form.videoId}`);
            const url = await fetchVideoURL(form.videoId); // Her form için videoId'ye göre URL al
            if (url) {
              urls[form.videoId] = url;
            }
          } else {
            console.log(`No videoId available for ${form.name} ${form.surname}`);
          }
        }
        setVideoURLs(urls); // URL'leri state'e kaydet
        setLoading(false); // Yükleme tamamlandı
      }
    };
  
    fetchVideos();
  }, [personalForms]); // Bu effect, sadece personalForms değişince çalışacak
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Interview Videos for {interviewId}</h1>
      <ul>
        {personalForms.map((form) => (
          <li key={form._id}>
            <h2>{form.name} {form.surname}'s video (ID: {form.videoId})</h2>
            {form.videoId && videoURLs[form.videoId] ? (
              <video controls width="600">
                <source src={videoURLs[form.videoId]} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>No video available</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InterviewVideosPage;
