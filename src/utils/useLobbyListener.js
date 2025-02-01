import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { useLobbyId } from "./lobbyIdContext";

const useLobbyListener = () => {
  const { lobbyId, setLobbyId } = useLobbyId();
  const [lobbyData, setLobbyData] = useState(null);
  const [lobbyDataLoading, setLobbyDataLoading] = useState(null);

  useEffect(() => {
    if (!lobbyId) {
      console.error("No lobby available.");
      return;
    }

    const lobbyDocRef = doc(db, "lobbies", lobbyId);

    const unsubscribe = onSnapshot(lobbyDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        console.log("Listening to lobby data:", docSnapshot.data());
        setLobbyData(docSnapshot.data());
      } else {
        console.error("No lobby document found!");
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [lobbyId]);

  return { lobbyData, lobbyDataLoading };
};

export default useLobbyListener;
