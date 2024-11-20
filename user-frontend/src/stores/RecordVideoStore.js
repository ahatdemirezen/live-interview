import { create } from 'zustand';
import axios from 'axios';

const useMediaStore = create((set) => ({
  isLoading: false,
  error: null,
  fileId: null, // fileId'yi yakalamak için state ekliyoruz
  userAlerts: {}, // Kullanıcı uyarı durumları



  // Medya dosyası yükleme fonksiyonu
  uploadMedia: async (mediaFile, formId, fileName) => {  // fileName'i parametre olarak alıyoruz
    set({ isLoading: true, error: null });

    try {
      // FormData oluşturuyoruz
      const formData = new FormData();
      formData.append('file', mediaFile, fileName); // Dinamik olarak oluşturulan fileName'i kullanıyoruz
    
      // Backend API URL (formId'yi URL'ye ekliyoruz)
      const apiUrl = import.meta.env.VITE_BE_URL; // Backend URL
      // POST isteği
      const response = await axios.post(`${apiUrl}/upload/media/${formId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      // Yanıtın tamamını logluyoruz
      console.log('Response from backend:', response.data);
    
      // Backend'den gelen fileId'yi almak
      const fileId = response.data?.updatedForm?.videoId || response.data?.data?.files?.[0]?.fileId;
    
      if (!fileId) {
        // Eğer fileId bulunamazsa, hata fırlatıyoruz
        throw new Error(`Video ID (fileId) alınamadı. Yanıt: ${JSON.stringify(response.data)}`);
      }
    
      console.log('Media upload successful, File ID:', fileId);
      set({ isLoading: false, fileId }); // fileId'yi state'e kaydediyoruz
    } catch (error) {
      console.error('Error uploading media:', error.message || error);
      set({ isLoading: false, error: 'Failed to upload media' });
    }
  },

  // Kullanıcı uyarı durumunu ayarlamak için fonksiyon
  setUserAlert: async (formId, alert) => {
    set({
      userAlerts: { [formId]: alert }, // 'state' kullanmadan direkt olarak güncellenmiş 'userAlerts' değerini atıyoruz
    });
    console.log('setUserAlert çağrıldı, güncellenen userAlerts:', { [formId]: alert });
  
    try {
      // Patch isteği ile alert durumunu güncelleme
      const apiUrl = `http://localhost:5002/api/candidate/${formId}/alert`;
      const response = await axios.patch(apiUrl, { alert });
  
      console.log('Alert status updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating alert status:', error.message || error);
      set({
        error: `Failed to update alert status for user ${formId}`,
      });
    }
  },  
}));

export default useMediaStore;
