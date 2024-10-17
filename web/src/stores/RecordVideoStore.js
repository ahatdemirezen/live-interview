import { create } from 'zustand';
import axios from 'axios';

const useMediaStore = create((set) => ({
  isLoading: false,
  error: null,

  // Medya dosyası yükleme fonksiyonu
  uploadMedia: async (mediaFile, formId) => {  // formId'yi parametre olarak ekliyoruz
    set({ isLoading: true, error: null });

    try {
      // FormData oluşturuyoruz
      const formData = new FormData();
      formData.append('file', mediaFile , 'video24.webm');

      // Backend API URL (formId'yi URL'ye ekliyoruz)
      const apiUrl = `http://localhost:5002/api/upload/media/${formId}`;

      // POST isteği
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Media upload successful', response.data);
      set({ isLoading: false });
    } catch (error) {
      console.error('Error uploading media:', error);
      set({ isLoading: false, error: 'Failed to upload media' });
    }
  },
}));

export default useMediaStore;
