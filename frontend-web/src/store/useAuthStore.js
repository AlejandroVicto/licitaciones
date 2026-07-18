import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      usuarioActivo: null, // { username, token, permisos, login_timestamp }
      
      login: (userData) => {
        set({ 
          usuarioActivo: {
            ...userData,
            login_timestamp: new Date().getTime()
          }
        });
      },

      logout: () => {
        set({ usuarioActivo: null });
        localStorage.removeItem('auth-storage');
      },

      checkSession: () => {
        const { usuarioActivo, logout } = get();
        if (!usuarioActivo || !usuarioActivo.login_timestamp) return;

        const now = new Date().getTime();
        const diff = now - usuarioActivo.login_timestamp;
        
        // 48 horas en milisegundos: 48 * 60 * 60 * 1000 = 172,800,000
        if (diff > 172800000) {
          logout();
        }
      }
    }),
    {
      name: 'auth-storage', // key in localStorage
    }
  )
);

export default useAuthStore;
