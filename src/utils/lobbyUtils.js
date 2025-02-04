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
} from "firebase/firestore";
import { fetchRandomWords, fetchTranslation } from "./utils";

export const searchOpenLobby = async (settings, setLobbyId, currentUser, userData) => {
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
    setLobbyId(currentDoc.id);
    await setDoc(
      doc(db, "lobbies", currentDoc.id),
      {
        players: {
          ...{
            [currentUser.uid]: {
              name: userData.name,
              score: 0,
              guesses: {},
              scores: {},
              times: {},
              isNewPb: false,
              finished: false,
              retry: false,
              highScores: userData.highScores,
            },
          },
        },
        isOpen: false,
      },
      { merge: true }
    );
    return true;
  } else {
    return false;
  }
};

export const createNewLobby = async (settings, setLobbyId, currentUser, userData) => {
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
  const docRef = await addDoc(collection(db, "lobbies"), {
    players: {
      [currentUser.uid]: {
        name: userData.name,
        score: 0,
        guesses: {},
        scores: {},
        times: {},
        isNewPb: false,
        finished: false,
        retry: false,
        highScores: userData.highScores,
      },
    },
    settings: settings,
    isOpen: settings.gamemode !== 0,
    maxPlayers: settings.gamemode === 0 ? 1 : settings.gamemode === 1 ? 2 : 8,
    words: wordsFetched,
    translation: translationFetched,
    retryCount: 0,
    finishedRetryLoading: false,
  });
  setLobbyId(docRef.id);
};

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
export const updateLobbyData = async (lobbyId, updatedFields) => {
  try {
    await updateDoc(doc(db, "lobbies", lobbyId), updatedFields);
  } catch (error) {
    console.log(error);
  }
}; //handleRetry and player data updates

export const joinLobbyWithCode = async () => {};
export const deleteLobby = async (lobbyId) => {
  try {
    const docRef = await getDoc(doc(db, "lobbies", lobbyId));
    if (docRef.exists()) {
      await deleteDoc(doc(db, "lobbies", lobbyId));
    }
  } catch (error) {
    console.log(error);
  }
};
export const deletePlayerFromLobby = async (currentUser, lobbyData, lobbyId) => {
  try {
    const docRef = await getDoc(doc(db, "lobbies", lobbyId));
    if (docRef.exists()) {
      if (lobbyData.players[currentUser.uid].finished && lobbyData.finishCount > 0) {
        await updateDoc(doc(db, "lobbies", lobbyId), {
          finishCount: increment(-1),
        });
      }
      if (lobbyData.players[currentUser.uid].retry && lobbyData.retryCount > 0) {
        await updateDoc(doc(db, "lobbies", lobbyId), {
          retryCount: increment(-1),
        });
      }
      await updateDoc(doc(db, "lobbies", lobbyId), {
        [`players.${currentUser.uid}`]: deleteField(),
      });
    }
  } catch (error) {
    console.log(error);
  }
};
