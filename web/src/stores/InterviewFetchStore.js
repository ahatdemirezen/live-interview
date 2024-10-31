import { create } from "zustand";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BE_URL; // Backend URL

const useInterviewStore = create((set, get) => ({
  interviewExists: null,   // Başlangıç durumu (true/false/null)
  questions: [],
  loading: false,          // Yükleme durumu
  error: null,             // Hata durumu
  canSkip: null,           // canSkip değeri
  showAtOnce: null,        // showAtOnce değeri

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
  
      // Paketlerin sıralı bir şekilde sorularını kaydediyoruz
      let allQuestions = [];
  
      // Paketler sırasına göre her paketin sorularını sıralı olarak ekliyoruz
      packages.forEach((pkg) => {
        const sortedQuestions = pkg.questions.sort((a, b) => a.sequenceNumber - b.sequenceNumber); // Soruları sequenceNumber'a göre sıralıyoruz
        allQuestions.push(...sortedQuestions); // Soruları sona ekliyoruz, ilk paket en üstte olacak şekilde sıralanıyor
      });
  
      console.log("Bütün Sorular (Sıralı, ilk paket en üstte):", allQuestions);
  
      // Soruları store'a kaydediyoruz
      set({ questions: allQuestions });
    } catch (error) {
      console.error("Error fetching questions:", error);
      set({ questions: [] });
    }
  },
  
  fetchInterviewSettings: async (interviewId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/interview/${interviewId}/settings`);
      const { canSkip, showAtOnce } = response.data;
      set({ canSkip, showAtOnce, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

}));

export default useInterviewStore;
