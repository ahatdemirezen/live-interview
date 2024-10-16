import { create } from "zustand";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BE_URL; // Backend URL

const useInterviewStore = create((set) => ({
  interviewExists: null,   // Başlangıç durumu (true/false/null)
  questions: [],
  loading: false,          // Yükleme durumu
  error: null,             // Hata durumu

  // Interview ID'yi kontrol etme fonksiyonu
  checkInterviewId: async (interviewId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/interview/ids`);
      const interviewIds = response.data;

      // Gelen interview ID'lerin içinde parametre olarak gönderilen interviewId'nin olup olmadığını kontrol et
      const exists = interviewIds.includes(interviewId);
      
      set({ interviewExists: exists, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchExpireDate: async (interviewId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/interview/${interviewId}/expire-date`, {
      });
      const expireDate = response.data.expireDate;
      set({ expireDate, loading: false });
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


}));

export default useInterviewStore;
