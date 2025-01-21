import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ja from "../icons/japan.png";
import ko from "../icons/south-korea.png";
import de from "../icons/germany.png";
import it from "../icons/italy.png";
import fr from "../icons/france.png";
import es from "../icons/spain.png";
import "../styling/Home.css";
import { AppContext } from "../App";
import { fetchRandomWords, fetchTranslation } from "../utils/utils";
import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import db from "../utils/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Home() {
  const { setHomeState } = useContext(AppContext);
  const [gamemode, setGamemode] = useState(0);
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ja");
  const [wordCount, setWordCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [lobbyFound, setLobbyFound] = useState(false);

  const targetLanguages = ["ja", "ko", "de", "it", "fr", "es"];
  const wordCounts = [3, 5, 10, 15];

  const navigate = useNavigate();
  const auth = getAuth();
  let newUser;

  useEffect(() => {
    const savedGamemode = localStorage.getItem("gamemode");
    if (savedGamemode) setGamemode(parseInt(savedGamemode));
    const savedSourceLang = localStorage.getItem("sourceLang");
    if (savedSourceLang) setSourceLang(savedSourceLang);
    const savedTargetLang = localStorage.getItem("targetLang");
    if (savedTargetLang) setTargetLang(savedTargetLang);
    const savedWordCount = localStorage.getItem("wordCount");
    if (savedWordCount) setWordCount(parseInt(savedWordCount));
  }, []);

  useEffect(() => {
    setHomeState(isLoading);
  }, [isLoading]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      newUser = user;
    } else {
      console.log("user signed out");
    }
  });
  const iconMap = {
    ja: ja,
    ko: ko,
    de: de,
    it: it,
    fr: fr,
    es: es,
  };

  const savePreferences = () => {
    localStorage.setItem("gamemode", gamemode);
    localStorage.setItem("sourceLang", sourceLang);
    localStorage.setItem("targetLang", targetLang);
    localStorage.setItem("wordCount", wordCount);
  };
  const addLobby = async (words, translation) => {
    try {
      const docRef = await addDoc(collection(db, "lobbies"), {
        players: [newUser.uid],
        isOpen: true,
        gamemode: gamemode,
        sourceLang: sourceLang,
        targetLang: targetLang,
        wordCount: wordCount,
        words: words,
        translation: translation,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const searchOpenLobby = async () => {
    const q = query(
      collection(db, "lobbies"),
      where("isOpen", "==", true),
      where("gamemode", "==", gamemode),
      where("sourceLang", "==", sourceLang),
      where("targetLang", "==", targetLang),
      where("wordCount", "==", wordCount)
    );
    let currentDoc;
    let currentDocData;
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      currentDoc = querySnapshot.docs[0];
      currentDocData = currentDoc.data();
      console.log(currentDocData.sourceLang);
      const docRef = doc(db, "lobbies", currentDoc.id);
      const unsub = onSnapshot(docRef, (doc) => {
        console.log("Current data: ", doc.data());
      });
      console.log("lobbyfound", newUser.uid);
      await updateDoc(docRef, {
        players: arrayUnion(newUser.uid),
        isOpen: false,
      });
      setLobbyFound(true);
      console.log(currentDocData.players);
      navigate("/play", {
        state: {
          gamemode: currentDocData.gamemode,
          sourceLang: currentDocData.sourceLang,
          targetLang: currentDocData.targetLang,
          wordCount: currentDocData.wordCount,
          words: currentDocData.words,
          translation: currentDocData.translation,
        },
      });
    } else {
      setLobbyFound(false);
    }
  };
  const handlePlay = async () => {
    setIsLoading(true);
    if (gamemode === 1) {
      searchOpenLobby();
      if (!lobbyFound) {
        let wordsFetched = [];
        let translationFetched = [];
        try {
          wordsFetched = await fetchRandomWords(wordCount);
          translationFetched = await fetchTranslation(wordsFetched, sourceLang, targetLang);
        } catch (error) {
          console.error("Error during the play process:", error);
        } finally {
          if (wordsFetched.length > 0 && translationFetched.length > 0) {
            savePreferences();
            if (gamemode === 1) {
              addLobby(wordsFetched, translationFetched);
            }
            navigate("/play", {
              state: {
                gamemode: gamemode,
                sourceLang: sourceLang,
                targetLang: targetLang,
                wordCount: wordCount,
                words: wordsFetched,
                translation: translationFetched,
              },
            });
          } else {
            console.error("Failed to fetch data for play.");
          }
        }
      }
    }
  };
  const LanguageButtons = () => {
    return Array.from({ length: targetLanguages.length }, (_, index) => (
      <button
        key={index}
        className={`col ${targetLang === targetLanguages[index] ? "clicked" : ""}`}
        disabled={isLoading}
        onClick={() => setTargetLang(targetLanguages[index])}>
        <img
          className="icons"
          src={iconMap[targetLanguages[index]]}
          alt={`${targetLang} icon`}></img>
      </button>
    ));
  };
  const WordCountButtons = () => {
    return Array.from({ length: wordCounts.length }, (_, index) => (
      <button
        key={index}
        className={`col ${wordCount === wordCounts[index] ? "clicked" : ""}`}
        disabled={isLoading}
        onClick={() => setWordCount(wordCounts[index])}>
        {wordCounts[index]}
      </button>
    ));
  };
  const Settings = () => {
    return (
      <>
        <div className="row buttonGaps">
          <LanguageButtons />
        </div>
        <div className="row buttonGaps">
          <WordCountButtons />
        </div>
      </>
    );
  };
  const Gamemode = () => {
    return (
      <>
        <div className="row buttonGaps">
          <button
            className={`col ${gamemode === 0 ? "clicked" : ""}`}
            onClick={() => setGamemode(0)}
            disabled={isLoading}>
            Solo
          </button>
          <button
            className={`col ${gamemode === 1 ? "clicked" : ""}`}
            onClick={() => setGamemode(1)}
            disabled={isLoading}>
            Online
          </button>
          <button
            className={`col-12 col-sm ${gamemode === 2 ? "clicked" : ""}`}
            onClick={() => setGamemode(2)}
            disabled={isLoading}>
            Private
          </button>
        </div>
      </>
    );
  };
  const PlayButtonContent = () => {
    if (!isLoading) {
      if (gamemode === 1) {
        return "Join Queue";
      } else if (gamemode === 2) {
        return "Create Lobby";
      } else if (gamemode === 0) {
        return "Play";
      }
    } else {
      return (
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      );
    }
  };

  return (
    <div className="container">
      <div className="container">
        <Gamemode />
        <Settings />
        <div className="play row buttonGaps">
          <button className="col" onClick={handlePlay} disabled={isLoading}>
            <PlayButtonContent />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
