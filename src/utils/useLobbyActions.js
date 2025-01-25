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
import { useLobby } from "./lobbyContext";

const useLobbyActions = () => {
  const { settings, setSettings } = useSettings();
  const { lobby, setLobby } = useLobby();
  const { currentUser } = useAuth();

  const listenToLobbyData = (lobbyId) => {
    onSnapshot(doc(db, "lobbies", lobbyId), (doc) => {
      console.log(doc.data());
      setLobby(doc.data());
    });
  };
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
          where("wordCount", "==", settings.wordCount)
        );
        querySnapshot = await getDocs(q);
        let currentDoc;
        let currentDocData;
        if (!querySnapshot.empty) {
          currentDoc = querySnapshot.docs[0];
          currentDocData = currentDoc.data();
          console.log(currentDoc.id);
          listenToLobbyData(currentDoc.id);
          await updateDoc(doc(db, "lobbies", currentDoc.id), {
            players: arrayUnion(currentUser.uid),
            isOpen: false,
          });
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
          players: [currentUser.uid],
          isOpen: false,
          maxPlayers: 1,
          gamemode: settings.gamemode,
          sourceLang: settings.sourceLang,
          targetLang: settings.targetLang,
          wordCount: settings.wordCount,
          words: wordsFetched,
          translation: translationFetched,
        });
        break;
      case 1:
        docRef = await addDoc(collection(db, "lobbies"), {
          players: [currentUser.uid],
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
          players: [currentUser.uid],
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
    console.log(docRef.id);
    listenToLobbyData(docRef.id);
  };
  const updateLobby = async () => {};
  const createNewUser = async (name) => {
    await setDoc(doc(db, "users", currentUser.uid), {
      name: name,
      lobbyId: "",
      highScores: [],
    });
  };
  const updateUser = async () => {};
  const getUserInformation = () => {};
  return { searchOpenLobby, createNewUser };
};
export default useLobbyActions;
