import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { useLobbyId } from "./lobbyIdContext";

const useLobbyListener = () => {
  const { lobbyId } = useLobbyId(); // Get the currently logged-in user
  const [lobbyData, setLobbyData] = useState(null);

  useEffect(() => {
    // Ensure the currentUser is available
    if (!lobbyId) {
      console.error("No lobby available.");
      return;
    }

    const lobbyDocRef = doc(db, "lobbies", lobbyId); // Reference to the user's document

    const unsubscribe = onSnapshot(lobbyDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        console.log("Lobby data updated:", docSnapshot.data());
        setLobbyData(docSnapshot.data()); // Update state with user data
      } else {
        console.error("No lobby document found!");
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [lobbyId]);

  return lobbyData; // Return the user data for consumption in components
};

export default useLobbyListener;
