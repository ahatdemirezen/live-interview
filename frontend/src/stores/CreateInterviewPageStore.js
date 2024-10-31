import { create } from 'zustand';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BE_URL;

const useCreateInterviewStore = create((set, get) => ({
  currentInterview: {
    interviewTitle: '',
    expireDate: '',
    packageId: [], // Artık sadece id değil, { _id, title } şeklinde obje tutacağız
    canSkip: false, // Varsayılan olarak false
    showAtOnce: false, // Varsayılan olarak false
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
  setCanSkip: (canSkip) => set((state) => ({
    currentInterview: { ...state.currentInterview, canSkip },
  })),
  setShowAtOnce: (showAtOnce) => set((state) => ({
    currentInterview: { ...state.currentInterview, showAtOnce },
  })),

  // Interview oluşturma fonksiyonu
  addInterview: async () => {
    const { interviewTitle, expireDate, packageId, canSkip, showAtOnce } = get().currentInterview;
  
    // Sadece _id'leri gönderiyoruz
    const packageIds = packageId.map(pkg => pkg._id);
  
    try {
      const response = await axios.post(
        `${apiUrl}/interview`,
        {
          interviewTitle,
          expireDate,
          packageIds, // packageId'yi gönderiyoruz
          canSkip,     // canSkip değerini gönderiyoruz
          showAtOnce,  // showAtOnce değerini gönderiyoruz
        },
        {
          withCredentials: true,  // Çerezleri gönder
        }
      );
  
      console.log('Interview created:', response.data);
  
      // İsteğin başarılı olması durumunda state'i sıfırlıyoruz
      set({
        currentInterview: {
          interviewTitle: '',
          expireDate: '',
          packageId: [],
          canSkip: false,
          showAtOnce: false,
        },
      });
    } catch (error) {
      console.error('Error creating interview:', error);
    }
  },
}));

export default useCreateInterviewStore;
