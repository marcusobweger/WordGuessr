import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "./firebase";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      initializeUser(user);
    });

    return () => {
      unsubAuth();
    };
  }, []);

  useEffect(() => {
    let unsubscribe;

    if (currentUser) {
      unsubscribe = onSnapshot(doc(db, "users", currentUser.uid), (docSnapshot) => {
        if (docSnapshot.exists()) {
          setUserData(docSnapshot.data());
        }
      });
    } else {
      setUserData(null);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser]);

  const initializeUser = (user) => {
    if (user) {
      setCurrentUser(user);
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  };
  const value = {
    currentUser,
    userLoggedIn,
    loading,
    userData,
  };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
