import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isAuth: !!localStorage.getItem("token"),

  setUser: (user) => set({ user }),
  
  setToken: (token) => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    set({ token, isAuth: !!token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuth: false });
  },


}));
