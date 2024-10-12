import { create } from 'zustand';
import axios from 'axios';

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
      const response = await axios.get(`${apiUrl}/package`,{
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
      await axios.delete(`${apiUrl}/package/${packageId}` , {
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
}));

export default usePackageStore;
