import { create } from 'zustand';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BE_URL;


export const useAuthStore = create((set) => ({
  token: null,
  isAuthenticated: localStorage.getItem("auth"),
  error: null,

  login: async (email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, { email, password }, { withCredentials: true });

      if(response){
        localStorage.setItem("auth",true)
      }
      // Başarılı login durumunda token'ı state'e kaydediyoruz
      set({
        token: response.data.token,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      // Hata durumunda error mesajını kaydediyoruz
      set({
        token: null,
        isAuthenticated: false,
        error: error.response ? error.response.data.message : 'An error occurred',
      });
    }
  },

  logout: () => {
    // Token'ı sıfırlayıp kullanıcıyı logout yapıyoruz
    set({
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },
}));