import { create } from 'zustand';

export const headerStore = create((set) => ({
  user: { name: 'Yıldız' }, // Varsayılan kullanıcı bilgisi (Bu dinamik olarak API'den çekilebilir)
  logout: () => set({ user: null }), // Çıkış işlemi
}));
