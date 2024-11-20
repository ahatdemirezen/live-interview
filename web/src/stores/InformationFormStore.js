import { create } from 'zustand';
import axios from 'axios';

// API endpoint'ini .env'den alıyoruz
const apiUrl = import.meta.env.VITE_BE_URL;

const useCandidateStore = create((set) => ({
  // State
  candidateForm: {
    name: '',
    surname: '',
    email: '',
    phone: '',
  },

  // Aday formundaki verileri güncelleyen fonksiyon
  setCandidateForm: (formData) =>
    set((state) => ({
      candidateForm: { ...state.candidateForm, ...formData },
    })),
//free commit
  // Aday formunu submit eden fonksiyon (POST request)
  submitCandidateForm: async (interviewId) => {
    try {
      const { candidateForm } = useCandidateStore.getState();
      
      // API'ye POST isteği atıyoruz, URL'ye interviewId'yi dahil ediyoruz
      const response = await axios.post(`${apiUrl}/candidate/${interviewId}`, candidateForm, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const savedPersonalInfo = response.data; // Backend'den gelen yanıtı kaydediyoruz
      
      console.log('Form başarıyla gönderildi:', savedPersonalInfo);
      return savedPersonalInfo; // Backend'den dönen `savedPersonalInfo` nesnesini return ediyoruz
    } catch (error) {
      console.error('Form gönderilirken bir hata oluştu:', error.response ? error.response.data : error.message);
      throw error; // Hata oluşursa yakalayıp fırlatıyoruz
    }
  },
  
}));

export default useCandidateStore;
