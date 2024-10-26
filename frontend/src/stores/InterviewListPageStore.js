import { create } from 'zustand';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BE_URL; // Backend URL'ini çevresel değişkenden alıyoruz

const useInterviewStore = create((set) => ({
  interviews: [],  // Interview verilerini burada tutacağız
  questions: [],
  personalForms: [], // Interview içindeki adayların kişisel bilgilerini tutmak için state
  loading: false,  // Yükleme durumu
  error: null,     // Hata durumu

  // Interview'ları getiren fonksiyon
  fetchInterviews: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${apiUrl}/interview`, {
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
  

  // Interview'daki adayların kişisel bilgilerini getiren fonksiyon
  getPersonalFormsByInterview: async (interviewId) => {
    try {
      const response = await axios.get(`${apiUrl}/interview/${interviewId}/personal-forms`, {
        withCredentials: true,
      });
      
      // Backend'den gelen personalInformationForms'u alıp store'a kaydediyoruz
      set({ personalForms: response.data.personalInformationForms });
    } catch (error) {
      console.error('Error fetching personal forms:', error);
      set({ personalForms: [] }); // Hata olursa personalForms'u boş yapıyoruz
    }
  },

  // Interview'ı silen fonksiyon
  deleteInterview: async (interviewId) => {
    try {
      await axios.delete(`${apiUrl}/interview/${interviewId}`, {
        withCredentials: true,
      });  // DELETE isteği
      set((state) => ({
        interviews: state.interviews.filter((interview) => interview._id !== interviewId), // Interview'ı state'den çıkarıyoruz
      }));
    } catch (error) {
      console.error('Error deleting interview:', error);
    }
  },

  deleteCandidateAndMedia: async (formId, videoId) => {
    try {
      // Silme isteği, formId ve videoId'yi body'den gönderiyoruz
      const response = await axios.delete(`${apiUrl}/upload/delete-candidate-media`, {
        data: {
          formId,
          videoId,
        },
        withCredentials: true,  // Eğer authentication varsa
      });

      // Store'daki personalForms listesinden silinen adayı çıkarıyoruz
      set((state) => ({
        personalForms: state.personalForms.filter((form) => form._id !== formId),
      }));

      console.log('Aday ve medya başarıyla silindi:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting candidate and media:', error);
    }
  },

  updateCandidateStatus: async (formId, newStatus) => {
    try {
      // PATCH isteği ile adayın status durumunu güncelleme
      const response = await axios.patch(`${apiUrl}/candidate/status`, {
        formId: formId,
        status: newStatus,
      }, {
        withCredentials: true,  // Eğer authentication varsa
      });

      // Backend'den dönen güncellenmiş formu alıp store'daki personalForms listesini güncelliyoruz
      set((state) => ({
        personalForms: state.personalForms.map((form) =>
          form._id === formId ? { ...form, status: newStatus } : form
        ),
      }));

      return response.data;  // İsteğin sonucunu döndürüyoruz
    } catch (error) {
      console.error('Error updating candidate status:', error);
    }
  },
  updateCandidateNote: async (formId, note) => {
    try {
      // PATCH isteği ile adayın not alanını güncelleme
      const response = await axios.patch(`${apiUrl}/candidate/${formId}/note`, {
        note: note,
      }, {
        withCredentials: true,  // Eğer authentication varsa
      });

      // Store'daki personalForms listesini güncelliyoruz
      set((state) => ({
        personalForms: state.personalForms.map((form) =>
          form._id === formId ? { ...form, note } : form
        ),
      }));

      return response.data;  // İsteğin sonucunu döndürüyoruz
    } catch (error) {
      console.error('Error updating candidate note:', error);
    }
  },
}));

export default useInterviewStore;
