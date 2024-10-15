import { create } from "zustand";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BE_URL; // Backend URL

const useInterviewStore = create((set) => ({
  interviewExists: null,   // Başlangıç durumu (true/false/null)
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
}));

export default useInterviewStore;
