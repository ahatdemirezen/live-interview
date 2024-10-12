import { create } from 'zustand';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BE_URL; // Backend URL'ini çevresel değişkenden alıyoruz

const useInterviewStore = create((set) => ({
  interviews: [],  // Interview verilerini burada tutacağız
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
