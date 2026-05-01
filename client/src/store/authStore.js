import { create } from "zustand";

export const useAuthStore = create((set) => ({
  firebaseUser: null,
  adminUser: null,
  loading: true,
  initialized: false,
  setUsers: ({ firebaseUser, adminUser }) =>
    set({
      firebaseUser,
      adminUser,
      loading: false,
      initialized: true,
    }),
  setLoading: (loading) => set({ loading }),
  reset: () =>
    set({
      firebaseUser: null,
      adminUser: null,
      loading: false,
      initialized: true,
    }),
}));
