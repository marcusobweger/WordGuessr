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
import { useNavigate } from "react-router-dom";

const useLobbyActions = () => {
  const { settings } = useSettings();
  const { lobbyId, setLobbyId } = useLobbyId();
  const { currentUser } = useAuth();
  const { userData, userDataLoading } = useUserListener();
  const navigate = useNavigate();

  const searchOpenLobby = async () => {
    console.log(lobbyId);
    let querySnapshot;
    console.log();
    switch (settings.gamemode) {
      case 0:
        console.log("play");
        await createNewLobby();
        navigate("/play");
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
                    guesses: {},
                    scores: {},
                    times: {},
                    isNewPb: false,
                    finished: false,
                    retry: false,
                  },
                },
              },
              isOpen: false,
            },
            { merge: true }
          );
          navigate("/play");
        } else {
          await createNewLobby();
          navigate("/play");
        }
        break;
      case 2:
        await createNewLobby();
        navigate("/lobby");
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
      return;
    }

    switch (settings.gamemode) {
      case 0:
        docRef = await addDoc(collection(db, "lobbies"), {
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
            },
          },
          settings: settings,
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
              guesses: {},
              scores: {},
              times: {},
              isNewPb: false,
              finished: false,
              retry: false,
            },
          },
          isOpen: true,
          maxPlayers: 2,
          settings: settings,
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
              guesses: {},
              scores: {},
              times: {},
              isNewPb: false,
              finished: false,
              retry: false,
            },
          },
          isOpen: true,
          maxPlayers: 8,
          settings: settings,
          words: wordsFetched,
          translation: translationFetched,
        });
        break;
    }
    setLobbyId(docRef.id);
  };
  const updateLobbyData = async (updatedFields) => {
    await updateDoc(doc(db, "lobbies", lobbyId), updatedFields);
  }; //handleRetry and player data updates
  const updateLobbyDataMerge = async (updatedFields) => {
    await setDoc(doc(db, "lobbies", lobbyId), updatedFields, { merge: true });
  }; //handleRetry and player data updates

  const joinLobbyWithCode = async () => {};

  return { searchOpenLobby, updateLobbyData, updateLobbyDataMerge };
};
export default useLobbyActions;
