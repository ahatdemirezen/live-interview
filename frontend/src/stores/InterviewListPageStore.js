import { create } from 'zustand';
const useInterviewStore = create((set) => ({
  interviews: [],
  currentInterview: {
    interviewTitle: '',  // Title için yeni isimlendirme
    packageId: [],  // Package için yeni isimlendirme
    expireDate: '', // Expire Date için aynı
  },
  // Interview Title için setter
  setInterviewTitle: (interviewTitle) => set((state) => ({
    currentInterview: { ...state.currentInterview, interviewTitle },
  })),
  // Package ID için setter
  setPackageId: (packageId) => set((state) => ({
    currentInterview: { ...state.currentInterview, packageId },
  })),
  // Expire Date için setter
  setExpireDate: (expireDate) => set((state) => ({
    currentInterview: { ...state.currentInterview, expireDate },
  })),
  // Interview ekleme fonksiyonu
  addInterview: () => set((state) => ({
    interviews: [...state.interviews, { ...state.currentInterview, id: state.interviews.length + 1 }],
    currentInterview: {
      interviewTitle: '',  // Interview Title sıfırlanıyor
      packageId: [],  // Package ID sıfırlanıyor
      expireDate: '', // Expire Date sıfırlanıyor
    },
  })),
  // Interview silme fonksiyonu
  removeInterview: (id) => set((state) => ({
    interviews: state.interviews.filter((interview) => interview.id !== id),
  })),
}));
export default useInterviewStore;