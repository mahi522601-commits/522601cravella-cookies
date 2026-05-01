import { useEffect } from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/services/firebase";
import { useAuthStore } from "@/store/authStore";

let authBound = false;

const bindAuthListener = () => {
  if (authBound) {
    return;
  }

  authBound = true;
  useAuthStore.getState().setLoading(true);

  onAuthStateChanged(auth, async (user) => {
    try {
      if (!user) {
        const anonymous = await signInAnonymously(auth);
        useAuthStore.getState().setUsers({
          firebaseUser: anonymous.user,
          adminUser: null,
        });
        return;
      }

      useAuthStore.getState().setUsers({
        firebaseUser: user,
        adminUser: user.isAnonymous ? null : user,
      });
    } catch (error) {
      useAuthStore.getState().reset();
    }
  });
};

export const useAuth = () => {
  const state = useAuthStore();

  useEffect(() => {
    bindAuthListener();
  }, []);

  const login = async ({ email, password }) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    useAuthStore.getState().setUsers({
      firebaseUser: credential.user,
      adminUser: credential.user,
    });
    return credential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  return {
    ...state,
    login,
    logout,
  };
};
