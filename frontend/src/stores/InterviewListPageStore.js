import { create } from 'zustand';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BE_URL; // Backend URL'ini çevresel değişkenden alıyoruz

const useInterviewStore = create((set) => ({
  interviews: [],  // Interview verilerini burada tutacağız
  questions : [],
  loading: false,  // Yükleme durumu
  error: null,     // Hata durumu

  // Interview'ları getiren fonksiyon
  fetchInterviews: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${apiUrl}/interview` , {
        withCredentials: true,
      });  // GET isteği yapılıyor
      set({ interviews: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  getQuestionsByInterview: async (interviewId) => {
    console.log("getQuestionsByInterview fonksiyonu çalışıyor:", interviewId);
    try {
      const response = await axios.get(`${apiUrl}/interview/${interviewId}/packages/questions`, {
        withCredentials: true,
      });
      const packages = response.data?.packages || [];
      const allQuestions = packages.flatMap((pkg) => pkg.questions);
      console.log("Bütün Sorular:", allQuestions);
      // Soruları store'a kaydediyoruz
      set({ questions: allQuestions });
    } catch (error) {
      console.error("Error fetching questions:", error);
      console.log("Hata Detayları:", error.response?.data);
      set({ questions: [] });
    }
  },
  // Interview'ı silen fonksiyon
  deleteInterview: async (interviewId) => {
    try {
      await axios.delete(`${apiUrl}/interview/${interviewId}` , {
        withCredentials: true,
      });  // DELETE isteği
      set((state) => ({
        interviews: state.interviews.filter((interview) => interview._id !== interviewId), // Interview'ı state'den çıkarıyoruz
      }));
    } catch (error) {
      console.error('Error deleting interview:', error);
    }
  },
}));

export default useInterviewStore;
