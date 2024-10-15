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
  
      console.log('Form başarıyla gönderildi:', response.data);
    } catch (error) {
      console.error('Form gönderilirken bir hata oluştu:', error.response ? error.response.data : error.message);
    }
  },
}));

export default useCandidateStore;
