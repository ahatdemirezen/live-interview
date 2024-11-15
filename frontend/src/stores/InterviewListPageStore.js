import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from './axiosInstance';

const apiUrl = import.meta.env.VITE_BE_URL; // Backend URL'ini çevresel değişkenden alıyoruz

const useInterviewStore = create((set) => ({
  interviews: [],  // Interview verilerini burada tutacağız
  questions: [],
  personalForms: [], // Interview içindeki adayların kişisel bilgilerini tutmak için state
  videoCounts: {},
  loading: false,  // Yükleme durumu
  error: null,     // Hata durumu
  totalForms: 0,   // Toplam form sayısını tutacağız

  isUserInfoModalOpen: false,
  selectedUserInfo: null,

  openUserInfoModal: (userInfo) => set({ isUserInfoModalOpen: true, selectedUserInfo: userInfo }),
  closeUserInfoModal: () => set({ isUserInfoModalOpen: false, selectedUserInfo: null }),

  setVideoCounts: (interviewId, totalVideos, pendingVideos) => {
    set((state) => ({
      videoCounts: {
        ...state.videoCounts,
        [interviewId]: { totalVideos, pendingVideos },
      },
    }));
  },

  // Interview'ları getiren fonksiyon
  fetchInterviews: async () => {
    set({ loading: true });
    try {
        const response = await axiosInstance.get(`${apiUrl}/interview`, {
            withCredentials: true,
        });

        // Gelen veriyi güncelleme
        const interviewsWithPackages = response.data.map(interview => ({
            ...interview,
            packageId: interview.packageId.map(pkg => ({ _id: pkg._id, title: pkg.title })),
        }));

        set({ interviews: interviewsWithPackages, loading: false });
    } catch (error) {
        set({ error: error.message, loading: false });
    }
},
  getQuestionsByInterview: async (interviewId) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/interview/${interviewId}/packages/questions`, {
        withCredentials: true,
      });

      const packages = response.data?.packages || [];
      let allQuestions = [];
      packages.forEach((pkg) => {
        const sortedQuestions = pkg.questions.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        allQuestions.push(...sortedQuestions);
      });
      set({ questions: allQuestions });
    } catch (error) {
      console.error("Error fetching questions:", error);
      set({ questions: [] });
    }
  },

  // Interview'daki adayların kişisel bilgilerini getiren fonksiyon
  getPersonalFormsByInterview: async (interviewId, page = 1, limit = 12) => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/interview/${interviewId}/personal-forms`, {
        params: { page, limit },
        withCredentials: true,
      });
      
      // `personalForms` ve `totalForms` değerlerini güncelleme
      set({
        personalForms: response.data.personalInformationForms,
        totalForms: response.data.totalCount,  // Backend’den dönen toplam sayıyı kaydediyoruz
      });
    } catch (error) {
      console.error('Error fetching personal forms:', error);
      set({ personalForms: [] });
    }
  },

  deleteInterview: async (interviewId) => {
    try {
      await axiosInstance.delete(`${apiUrl}/interview/${interviewId}`, {
        withCredentials: true,
      });
      set((state) => ({
        interviews: state.interviews.filter((interview) => interview._id !== interviewId),
      }));
    } catch (error) {
      console.error('Error deleting interview:', error);
    }
  },

  deleteCandidateAndMedia: async (formId, videoId = null) => {
    try {
      // API'ye gönderilecek veriyi videoId varlığına göre ayarla
      const requestData = videoId ? { formId, videoId } : { formId };
      
      const response = await axiosInstance.delete(`${apiUrl}/upload/delete-candidate-media`, {
        data: requestData,
        withCredentials: true,
      });
      
      // Durumu güncelle ve ilgili formu sil
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
      const response = await axiosInstance.patch(`${apiUrl}/candidate/status`, {
        formId: formId,
        status: newStatus,
      }, {
        withCredentials: true,
      });
      set((state) => ({
        personalForms: state.personalForms.map((form) =>
          form._id === formId ? { ...form, status: newStatus } : form
        ),
      }));
      return response.data;
    } catch (error) {
      console.error('Error updating candidate status:', error);
    }
  },

  updateCandidateNote: async (formId, note) => {
    try {
      const response = await axiosInstance.patch(`${apiUrl}/candidate/${formId}/note`, {
        note: note,
      }, {
        withCredentials: true,
      });
      set((state) => ({
        personalForms: state.personalForms.map((form) =>
          form._id === formId ? { ...form, note } : form
        ),
      }));
      return response.data;
    } catch (error) {
      console.error('Error updating candidate note:', error);
    }
  },

}));

export default useInterviewStore;
