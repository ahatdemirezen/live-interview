import { create } from 'zustand';
import axios from 'axios';
import usePackageStore from '../stores/PackagePageStore'; // Paket Store'u import et


// API URL'sini .env dosyasındaki VITE_BE_URL ile alıyoruz
const apiUrl = import.meta.env.VITE_BE_URL;

const useCreatePackage = create((set) => ({
  packageId: null, // Eğer packageId verisi varsa güncelleme yapılabilir
  packageTitle: '',
  questions: [],
  currentQuestion: '',
  currentTime: '2',
  totalQuestions: 0, // Toplam soru sayısını da izliyoruz
  loading: false,
  error: null,

  // Paket başlığını set etme
  setPackageTitle: (title) => set(() => ({
    packageTitle: title
  })),

  // Mevcut soru ve zamanı güncelleme
  setCurrentQuestion: (question) => set(() => ({
    currentQuestion: question
  })),

  setCurrentTime: (time) => set(() => ({
    currentTime: time
  })),

  // Soruları güncellemek için setQuestions fonksiyonu
  setQuestions: (newQuestions) => set(() => ({
    questions: newQuestions,
  })),
  
  createPackage: async () => {
    set({ loading: true, error: null });
    try {
      const state = useCreatePackage.getState();  // Zustand'daki mevcut state'i alıyoruz
      const packageData = {
        title: state.packageTitle,  // Sadece title gönderiyoruz
      };

      // POST isteği ile yeni paket oluşturma
      const response = await axios.post(`${apiUrl}/package`, packageData);

      // Backend'den dönen packageId'yi ve title'ı alıp state'e set ediyoruz
      const newPackageId = response.data._id;
      const newPackageTitle = response.data.title || state.packageTitle;

      set({
        packageId: newPackageId,
        packageTitle: newPackageTitle,
        loading: false,
      });

      // Paketleri tekrar getir (listeyi güncelle)
      const getPackages = usePackageStore.getState().getPackages;
      await getPackages();

      console.log('Package created successfully with ID:', newPackageId);
    } catch (error) {
      set({ error: 'Failed to create package', loading: false });
    }
  },
  // Soru silme fonksiyonu
  deleteQuestion: async (questionId) => {
    set({ loading: true, error: null });
    try {
      const state = useCreatePackage.getState();

      // Silme isteği: packageId URL'den, questionId body'den gönderiliyor
      await axios.delete(`${apiUrl}/package/${state.packageId}/questions`, {
        data: { questionId }, // request body'de questionId'yi gönderiyoruz
      });

      // Silinen soruyu frontende de güncelliyoruz
      const updatedQuestions = state.questions.filter(q => q._id !== questionId);

      set({
        questions: updatedQuestions,
        totalQuestions: updatedQuestions.length,
        loading: false,
      });

      console.log('Question deleted successfully');
    } catch (error) {
      set({ error: 'Failed to delete question', loading: false });
    }
  },

  addQuestion: async () => {
    set({ loading: true, error: null });
    try {
      const state = useCreatePackage.getState();  // Zustand'daki mevcut state'i alıyoruz
  
      // POST isteği ile yeni soru ekleme
      const questionData = {
        questionText: state.currentQuestion,
        timeLimit: parseInt(state.currentTime, 10),
      };
  
      // Backend'e doğrudan questionText ve timeLimit ile POST isteği yapıyoruz
      const response = await axios.post(`${apiUrl}/package/${state.packageId}/questions`, {
        newQuestions: [{  // Burada newQuestions bir array olarak gönderiliyor
          questionText: questionData.questionText,
          timeLimit: questionData.timeLimit,
        }],
      });
      
  
      const updatedPackage = response.data.package;
  
      set({
        questions: updatedPackage.questions,
        totalQuestions: updatedPackage.questions.length,
        currentQuestion: '',  // Soru ekledikten sonra inputları sıfırlıyoruz
        currentTime: '2',
        loading: false,
      });
  
      console.log('Question added successfully:', updatedPackage);
    } catch (error) {
      set({ error: 'Failed to add question', loading: false });
    }
  },
  
  
  // Paket sıfırlama
  resetPackage: () => set(() => ({
    packageId: null,
    packageTitle: '',
    questions: [],
    currentQuestion: '',
    currentTime: '2',
    totalQuestions: 0,
  })),

  // Belirli bir paketi ID'ye göre getirme (GET isteği)
  getPackageById: async (packageId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/package/${packageId}`);
      const { title, questions } = response.data;
      set({
        packageId,
        packageTitle: title,
        questions,
        totalQuestions: questions.length,
        loading: false,
      });
    } catch (error) {
      set({ error: 'Failed to fetch package', loading: false });
    }
  },
}));

export default useCreatePackage;
