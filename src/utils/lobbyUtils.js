import { db } from "./firebase";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  setDoc,
  orderBy,
  deleteDoc,
  deleteField,
  getDoc,
  increment,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { fetchRandomWords, fetchTranslation } from "./utils";

export const searchOpenLobby = async (settings, setLobbyId, currentUserId, userData) => {
  const q = query(
    collection(db, "lobbies"),
    where("isOpen", "==", true),
    where("settings.gamemode", "==", settings.gamemode),
    where("settings.sourceLang", "==", settings.sourceLang),
    where("settings.targetLang", "==", settings.targetLang),
    where("settings.wordCount", "==", settings.wordCount),
    where("maxPlayers", "==", 2)
  );
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot);

  if (!querySnapshot.empty) {
    const currentDoc = querySnapshot.docs[0];
    console.log(currentDoc.id);
    try {
      const batch = writeBatch(db);
      // reference to lobby doc
      const lobbyRef = doc(db, "lobbies", currentDoc.id);

      batch.update(lobbyRef, {
        isOpen: false,
        playerCount: increment(1),
      });
      // reference to players subcollection in lobby doc
      const playerRef = doc(db, "lobbies", currentDoc.id, "players", currentUserId);
      batch.set(
        playerRef,
        {
          name: userData.name,
          score: 0,
          guesses: {},
          scores: {},
          times: {},
          isNewPb: false,
          finished: false,
          retry: false,
          ready: false,
          host: false,
          highScores: userData.highScores,
          joined: Timestamp.now(),
        },
        { merge: true }
      );

      await batch.commit();
      setLobbyId(currentDoc.id);
      console.log("Lobby and Player updated successfully");
    } catch (error) {
      console.log(error);
    }
    return true;
  } else {
    return false;
  }
};

export const createNewLobby = async (settings, setLobbyId, currentUserId, userData) => {
  console.log(userData);
  let wordsFetched = [];
  let translationFetched = [];
  try {
    wordsFetched = await fetchRandomWords(settings.wordCount);
    translationFetched = await fetchTranslation(
      wordsFetched,
      settings.sourceLang,
      settings.targetLang
    );
  } catch (error) {
    console.error("Error during the play process:", error);
    return;
  }
  try {
    const batch = writeBatch(db);
    const lobbyRef = doc(collection(db, "lobbies"));
    const lobbyId = lobbyRef.id;

    batch.set(lobbyRef, {
      settings: settings,
      isOpen: settings.gamemode !== 0,
      maxPlayers: settings.gamemode === 0 ? 1 : settings.gamemode === 1 ? 2 : 8,
      words: wordsFetched,
      translation: translationFetched,
      retryCount: 0,
      finishCount: 0,
      readyCount: 0,
      finishedRetryLoading: false,
      playerCount: 1,
    });

    const playerRef = doc(db, "lobbies", lobbyId, "players", currentUserId);
    batch.set(playerRef, {
      name: userData.name,
      score: 0,
      guesses: {},
      scores: {},
      times: {},
      isNewPb: false,
      finished: false,
      retry: false,
      ready: false,
      host: true,
      highScores: userData.highScores,
      joined: Timestamp.now(),
    });
    await batch.commit();
    setLobbyId(lobbyId);
    console.log("new lobby created");
  } catch (error) {
    console.log(error);
  }
};
/*
export const getPlayersOrderByScore = async (newLobbyId) => {
  try {
    const playersRef = collection(db, "lobbies", newLobbyId, "players");
    const q = query(playersRef, orderBy("score", "desc"));

    const querySnapshot = await getDocs(q);
    const players = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(players);
    return players;
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
};
*/
export const updateLobbyData = async (
  lobbyId,
  currentUserId,
  updatedLobbyFields,
  updatedPlayerFields
) => {
  try {
    const batch = writeBatch(db);
    const lobbyRef = doc(db, "lobbies", lobbyId);
    batch.update(lobbyRef, updatedLobbyFields);
    const playerRef = doc(db, "lobbies", lobbyId, "players", currentUserId);
    batch.update(playerRef, updatedPlayerFields);
    await batch.commit();
    console.log("lobby and player successfully updated");
  } catch (error) {
    console.log(error);
  }
}; //handleRetry and player data updates

export const joinLobbyWithCode = async (code, setLobbyId, currentUserId, userData) => {
  const lobbyRef = doc(db, "lobbies", code);
  const playerRef = doc(db, "lobbies", code, "players", currentUserId);
  try {
    const currentDoc = await getDoc(lobbyRef);
    const batch = writeBatch(db);
    console.log(currentDoc);
    if (currentDoc.exists()) {
      setLobbyId(code);
      if (currentDoc?.data()?.isOpen) {
        batch.set(
          playerRef,
          {
            name: userData.name,
            score: 0,
            guesses: {},
            scores: {},
            times: {},
            isNewPb: false,
            finished: false,
            retry: false,
            ready: false,
            host: false,
            highScores: userData.highScores,
            joined: Timestamp.now(),
          },

          { merge: true }
        );
        batch.update(lobbyRef, { playerCount: increment(1) });
        await batch.commit();
      }
      if (currentDoc?.data()?.playerCount === currentDoc?.data()?.maxPlayers) {
        await setDoc(lobbyRef, {
          isOpen: false,
        });
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
export const deleteLobby = async (lobbyId) => {
  const playersCollectionRef = collection(db, "lobbies", lobbyId, "players");

  try {
    const playersSnapshot = await getDocs(playersCollectionRef);

    // Delete all players
    const deletePlayerPromises = playersSnapshot.docs.map((playerDoc) =>
      deleteDoc(doc(db, "lobbies", lobbyId, "players", playerDoc.id))
    );
    await Promise.all(deletePlayerPromises);

    // Now delete the lobby itself
    await deleteDoc(doc(db, "lobbies", lobbyId));

    console.log("Lobby and all players deleted successfully.");
  } catch (error) {
    console.error("Error deleting lobby and players:", error);
  }
};
export const deletePlayerFromLobby = async (currentUserId, lobbyData, lobbyId) => {
  /*
  try {
    const lobbyRef = doc(db, "lobbies", lobbyId);
    const playerRef = doc(db, "lobbies", lobbyId, "players", currentUserId);
    const lobbySnapshot = await getDoc(lobbyRef);
    const playerSnapshot = await getDoc(playerRef);
    if (lobbySnapshot.exists()&&playerSnapshot.exists()) {
      const updates = {};
      if (playerSnapshot.data().finished && lobbySnapshot.data().finishCount > 0) {
        updates.finishCount = increment(-1);
      }
      if (playerSnapshot.data().retry && lobbySnapshot.data().retryCount > 0) {
        updates.retryCount = increment(-1);
      }
      if (playerSnapshot.data().ready && lobbySnapshot.data().readyCount > 0) {
        updates.readyCount = increment(-1);
      }
      if (playerSnapshot.data().host) {
        const remainingPlayers = Object.keys(lobbyData.players).filter(
          (uid) => uid !== currentUser.uid
        );

        if (remainingPlayers.length > 0) {
          const newHostUid = remainingPlayers[0]; // Select the first available player
          updates[`players.${newHostUid}.host`] = true;
        }
      }
      updates[`players.${currentUser.uid}`] = deleteField();

      await updateDoc(doc(db, "lobbies", lobbyId), updates);
    }
  } catch (error) {
    console.log(error);
  }
    */
};
