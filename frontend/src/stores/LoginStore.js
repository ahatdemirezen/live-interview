import { create } from 'zustand';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_BE_URL;

export const useAuthStore = create((set) => ({
  token: null,
  isAuthenticated: localStorage.getItem("auth") === "true", // String kontrolü yaparak boolean'a çeviriyoruz
  error: null,

  login: async (email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, { email, password }, { withCredentials: true });

      if (response) {
        localStorage.setItem("auth", true); // Başarılı login durumunda auth bilgisi localStorage'a kaydediliyor
      }
      
      set({
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      set({
        token: null,
        isAuthenticated: false,
        error: error.response ? error.response.data.message : 'An error occurred',
      });
    }
  },

  logout: async () => {
    try {
      await axios.post(`${apiUrl}/login/logout`, {}, { withCredentials: true });

      // Logout işlemi başarılı olursa localStorage'daki auth durumunu kaldırıyoruz
      localStorage.removeItem("auth");

      set({
        token: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      set({
        error: "Logout failed. Please try again.",
      });
    }
  },
}));
