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
              ready: false,
              host: false,
              highScores: userData.highScores,
              joined: Timestamp.now(),
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
        ready: false,
        host: true,
        highScores: userData.highScores,
        joined: Timestamp.now(),
      },
    },
    settings: settings,
    isOpen: settings.gamemode !== 0,
    maxPlayers: settings.gamemode === 0 ? 1 : settings.gamemode === 1 ? 2 : 8,
    words: wordsFetched,
    translation: translationFetched,
    retryCount: 0,
    finishCount: 0,
    readyCount: 0,
    finishedRetryLoading: false,
  });
  setLobbyId(docRef.id);
};

export const updateLobbyData = async (lobbyId, updatedFields) => {
  try {
    await updateDoc(doc(db, "lobbies", lobbyId), updatedFields);
  } catch (error) {
    console.log(error);
  }
}; //handleRetry and player data updates

export const joinLobbyWithCode = async (code, setLobbyId, currentUser, userData) => {
  try {
    const currentDoc = await getDoc(doc(db, "lobbies", code));
    console.log(currentDoc);
    if (currentDoc.exists()) {
      console.log(currentDoc.id);
      setLobbyId(currentDoc.id);
      if (currentDoc?.data()?.isOpen) {
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
                  ready: false,
                  host: false,
                  highScores: userData.highScores,
                  joined: Timestamp.now(),
                },
              },
            },
          },
          { merge: true }
        );
        if (Object.keys(currentDoc?.data()?.players) === currentDoc?.data()?.maxPlayers) {
          await setDoc(doc(db, "lobbies", currentDoc.id), {
            isOpen: false,
          });
        }
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
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
      const updates = {};
      if (lobbyData.players[currentUser.uid].finished && lobbyData.finishCount > 0) {
        updates.finishCount = increment(-1);
      }
      if (lobbyData.players[currentUser.uid].retry && lobbyData.retryCount > 0) {
        updates.retryCount = increment(-1);
      }
      if (lobbyData.players[currentUser.uid].ready && lobbyData.readyCount > 0) {
        updates.readyCount = increment(-1);
      }
      if (lobbyData.players[currentUser.uid].host) {
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
};
