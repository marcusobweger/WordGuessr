import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./authContext";
import { db } from "./firebase";
import { onSnapshot, doc } from "firebase/firestore";

const FirebaseContext = createContext();

export const useFirebaseContext = () => {
  return useContext(FirebaseContext);
};

export const FirebaseProvider = ({ children }) => {
  const [lobbyData, setLobbyData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [lobbyId, setLobbyId] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!lobbyId) {
      return;
    }

    const lobbyDocRef = doc(db, "lobbies", lobbyId);

    const unsubscribe = onSnapshot(lobbyDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setLobbyData(docSnapshot.data());
      } else {
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
      setLobbyData(null);
    };
  }, [lobbyId]);

  useEffect(() => {
    // Ensure the currentUser is available
    if (!currentUser) {
      return;
    }

    const userDocRef = doc(db, "users", currentUser.uid); // Reference to the user's document

    // Add a real-time listener
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setUserData(docSnapshot.data()); // Update state with user data
      } else {
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
      setUserData(null);
    };
  }, [currentUser]);

  const value = {
    lobbyData,
    setLobbyData,
    userData,
    setUserData,
    lobbyId,
    setLobbyId,
  };
  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};
