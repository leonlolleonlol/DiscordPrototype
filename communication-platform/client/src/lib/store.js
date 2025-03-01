import { create } from "zustand";

export const useUserStore = create(set => ({
  userData:  null,
  setUserData: (newData) => set({ userData : newData }),
}));