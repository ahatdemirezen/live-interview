import { create } from 'zustand';
import axiosInstance from './axiosInstance';

// API URL'sini .env dosyasındaki VITE_BE_URL ile alıyoruz
const apiUrl = import.meta.env.VITE_BE_URL;

const usePackageStore = create((set) => ({
  packages: [],
  loading: false,
  error: null,

  // Paketleri API'den getirir
  getPackages: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`${apiUrl}/package`,{
          withCredentials:true
      });
      set({ packages: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch packages', loading: false });
    }
  },

  // Yeni paketi mevcut listeye ekleme fonksiyonu
  addPackage: (newPackage) => set((state) => ({
    packages: [...state.packages, newPackage],
  })),

  // Belirli bir paketi silme
  deletePackage: async (packageId) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`${apiUrl}/package/${packageId}` , {
        withCredentials:true
      });
      set((state) => ({
        packages: state.packages.filter((pkg) => pkg._id !== packageId), // Silinen paketi store'dan kaldır
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete package', loading: false });
    }
  },
  updatePackageOrder: async (packageId, reorderedQuestions) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.post(`${apiUrl}/package/${packageId}/update-order`, {
        questions: reorderedQuestions,
      }, {
        withCredentials: true,  // Çerezleri gönder
      });
      set({ loading: false });
      console.log('Sıralama başarıyla kaydedildi.');
    } catch (error) {
      set({ error: 'Failed to update package order', loading: false });
      console.error('Sıralama kaydedilirken hata oluştu:', error);
    }
  },  
}));

export default usePackageStore;
