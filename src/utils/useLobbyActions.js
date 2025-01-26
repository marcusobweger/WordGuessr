import { useSettings } from "./settingsContext";
import { db } from "./firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
  getDocs,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { fetchRandomWords, fetchTranslation } from "./utils";
import { useAuth } from "./authContext";
import { useLobbyId } from "./lobbyIdContext";
import useUserListener from "./useUserListener";

const useLobbyActions = () => {
  const { settings } = useSettings();
  const { setLobbyId } = useLobbyId();
  const { currentUser } = useAuth();
  const userData = useUserListener();

  const searchOpenLobby = async () => {
    let querySnapshot;
    switch (settings.gamemode) {
      case 0:
        await createNewLobby();
        break;
      case 1:
        const q = query(
          collection(db, "lobbies"),
          where("isOpen", "==", true),
          where("gamemode", "==", settings.gamemode),
          where("sourceLang", "==", settings.sourceLang),
          where("targetLang", "==", settings.targetLang),
          where("wordCount", "==", settings.wordCount),
          where("maxPlayers", "==", 2)
        );
        querySnapshot = await getDocs(q);
        let currentDoc;
        let currentDocData;
        if (!querySnapshot.empty) {
          currentDoc = querySnapshot.docs[0];
          currentDocData = currentDoc.data();
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
                    guesses: [],
                    scores: [],
                    times: [],
                    finished: false,
                    retry: false,
                  },
                },
              },
              isOpen: false,
            },
            { merge: true }
          );
        } else {
          await createNewLobby();
        }
        break;
      case 2:
        await createNewLobby();
        break;
    }
  };

  const createNewLobby = async () => {
    console.log(userData);
    let docRef;
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
    }

    switch (settings.gamemode) {
      case 0:
        docRef = await addDoc(collection(db, "lobbies"), {
          players: {
            [currentUser.uid]: {
              name: userData.name,
              score: 0,
              guesses: [],
              scores: [],
              times: [],
              finished: false,
              retry: false,
            },
          },
          settings: { settings },
          isOpen: false,
          maxPlayers: 1,
          words: wordsFetched,
          translation: translationFetched,
        });
        break;
      case 1:
        docRef = await addDoc(collection(db, "lobbies"), {
          players: {
            [currentUser.uid]: {
              name: userData.name,
              score: 0,
              guesses: [],
              scores: [],
              times: [],
              finished: false,
              retry: false,
            },
          },
          isOpen: true,
          maxPlayers: 2,
          gamemode: settings.gamemode,
          sourceLang: settings.sourceLang,
          targetLang: settings.targetLang,
          wordCount: settings.wordCount,
          words: wordsFetched,
          translation: translationFetched,
        });
        break;
      case 2:
        docRef = await addDoc(collection(db, "lobbies"), {
          players: {
            [currentUser.uid]: {
              name: userData.name,
              score: 0,
              guesses: [],
              scores: [],
              times: [],
              finished: false,
              retry: false,
            },
          },
          isOpen: true,
          maxPlayers: 8,
          gamemode: settings.gamemode,
          sourceLang: settings.sourceLang,
          targetLang: settings.targetLang,
          wordCount: settings.wordCount,
          words: wordsFetched,
          translation: translationFetched,
        });
        break;
    }
    setLobbyId(docRef.id);
  };
  const updateLobby = async () => {}; //handleRetry

  return { searchOpenLobby };
};
export default useLobbyActions;
