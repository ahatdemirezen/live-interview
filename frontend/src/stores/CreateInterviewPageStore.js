import { create } from 'zustand';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BE_URL;

const useCreateInterviewStore = create((set, get) => ({
  currentInterview: {
    interviewTitle: '',
    expireDate: '',
    packageId: [], // Artık sadece id değil, { _id, title } şeklinde obje tutacağız
  },
  setInterviewTitle: (title) => set((state) => ({
    currentInterview: { ...state.currentInterview, interviewTitle: title },
  })),
  setExpireDate: (date) => set((state) => ({
    currentInterview: { ...state.currentInterview, expireDate: date },
  })),
  setPackageId: (packageIds) => set((state) => ({
    currentInterview: { ...state.currentInterview, packageId: packageIds },
  })),

  // Interview oluşturma fonksiyonu
  addInterview: async () => {
    const { interviewTitle, expireDate, packageId } = get().currentInterview;
  
    // Post isteğinde sadece _id'leri göndereceğiz, title'ları değil
    const packageIds = packageId.map(pkg => pkg._id);
  
    try {
      const response = await axios.post(
        `${apiUrl}/interview`, 
        {
          interviewTitle,
          expireDate,
          packageIds, // packageId'yi gönderiyoruz
        },
        {
          withCredentials: true,  // Çerezleri gönder
        }
      );
      
      console.log('Interview created:', response.data);
  
      // İsteğin başarılı olması durumunda state'i sıfırlayabiliriz
      set({
        currentInterview: {
          interviewTitle: '',
          expireDate: '',
          packageId: [],
        },
      });
    } catch (error) {
      console.error('Error creating interview:', error);
    }
  },
  
}));

export default useCreateInterviewStore;
