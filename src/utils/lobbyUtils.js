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

// function for Online mode to search for a matching opponent
export const searchOpenLobby = async (settings, setLobbyId, currentUser, userData) => {
  // firebase query to check for any fitting lobbies
  const q = query(
    collection(db, "lobbies"),
    where("isOpen", "==", true), // lobby needs to be open for players
    where("settings.gamemode", "==", settings.gamemode), // the settings have to match the user's settings
    where("settings.sourceLang", "==", settings.sourceLang),
    where("settings.targetLang", "==", settings.targetLang),
    where("settings.wordCount", "==", settings.wordCount),
    where("maxPlayers", "==", 2) // maxPlayers has to be set to 2
  );
  // get all available lobbies
  const querySnapshot = await getDocs(q);
  // if there are lobbies available
  if (!querySnapshot.empty) {
    // choose the first one
    const currentDoc = querySnapshot.docs[0];

    setLobbyId(currentDoc.id);
    // add the player to the lobby
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
        // close the lobby so that no other players can join
        isOpen: false,
      },
      // player should be added to players not overwrite them
      { merge: true }
    );
    return true;
    // if there are no lobbies available with the matching settings, return false
  } else {
    return false;
  }
};
// function for creating new lobby
export const createNewLobby = async (settings, setLobbyId, currentUser, userData) => {
  // fetch words and translations
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
    return;
  }
  // create a new doc in the lobbies collection
  const docRef = await addDoc(collection(db, "lobbies"), {
    // add the player that created the lobby (the current user)
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
    // set the settings based on the current user's settings
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
  // update the context with the new lobbyId
  setLobbyId(docRef.id);
};
// update data in the lobby while playing
export const updateLobbyData = async (lobbyId, updatedFields) => {
  try {
    await updateDoc(doc(db, "lobbies", lobbyId), updatedFields);
  } catch (error) {}
};
// function for joining a lobby with the code (the lobbyId)
export const joinLobbyWithCode = async (code, setLobbyId, currentUser, userData) => {
  try {
    // attempt to get the lobby which has the lobbyId equal to the provided code
    const currentDoc = await getDoc(doc(db, "lobbies", code));
    // if the lobby exits
    if (currentDoc.exists()) {
      // update the context with the new lobbyId
      setLobbyId(currentDoc.id);
      // check if the lobby is still open
      if (currentDoc?.data()?.isOpen) {
        // add the player to the lobby
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
          // add not overwrite
          { merge: true }
        );
        // if the joining player was the last player able to join the lobby, set the isOpen field to false
        if (Object.keys(currentDoc?.data()?.players) === currentDoc?.data()?.maxPlayers) {
          await setDoc(doc(db, "lobbies", currentDoc.id), {
            isOpen: false,
          });
        }
        return true;
        // if the lobby is not open, return false
      } else {
        return false;
      }
      // if the lobby doesn't exist, return false as well
    } else {
      return false;
    }
  } catch (error) {}
};
// function to delete the lobby
export const deleteLobby = async (lobbyId) => {
  try {
    // get the lobby with the provided lobbyId
    const docRef = await getDoc(doc(db, "lobbies", lobbyId));
    // if the lobby exists, delete the lobby
    if (docRef.exists()) {
      await deleteDoc(doc(db, "lobbies", lobbyId));
    }
  } catch (error) {}
};
// function to delete the current user from the lobby
export const deletePlayerFromLobby = async (currentUser, lobbyData, lobbyId) => {
  try {
    // get the lobby with the provided lobbyId
    const docRef = await getDoc(doc(db, "lobbies", lobbyId));
    // if the lobby exists
    if (docRef.exists()) {
      const updates = {};
      // schedule updates
      if (lobbyData.players[currentUser.uid].finished && lobbyData.finishCount > 0) {
        updates.finishCount = increment(-1);
      }
      if (lobbyData.players[currentUser.uid].retry && lobbyData.retryCount > 0) {
        updates.retryCount = increment(-1);
      }
      if (lobbyData.players[currentUser.uid].ready && lobbyData.readyCount > 0) {
        updates.readyCount = increment(-1);
      }
      // logic for transferring the host to another player if the player to be deleted is the current host
      if (lobbyData.players[currentUser.uid].host) {
        const remainingPlayers = Object.keys(lobbyData.players).filter(
          (uid) => uid !== currentUser.uid
        );

        if (remainingPlayers.length > 0) {
          const newHostUid = remainingPlayers[0]; // select the first available player
          updates[`players.${newHostUid}.host`] = true;
        }
      }
      updates[`players.${currentUser.uid}`] = deleteField();
      // execute update
      await updateDoc(doc(db, "lobbies", lobbyId), updates);
    }
  } catch (error) {}
};
