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

//firebase
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

function Home() {
  const { setHomeState } = useContext(AppContext);
  const [gamemode, setGamemode] = useState(0);
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ja");
  const [wordCount, setWordCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const targetLanguages = ["ja", "ko", "de", "it", "fr", "es"];
  const wordCounts = [3, 5, 10, 15];

  const navigate = useNavigate();

  useEffect(() => {
    const savedGamemode = localStorage.getItem("gamemode");
    if (savedGamemode) setGamemode(parseInt(savedGamemode));
    const savedSourceLang = localStorage.getItem("sourceLang");
    if (savedSourceLang) setSourceLang(savedSourceLang);
    const savedTargetLang = localStorage.getItem("targetLang");
    if (savedTargetLang) setTargetLang(savedTargetLang);
    const savedWordCount = localStorage.getItem("wordCount");
    if (savedWordCount) setWordCount(parseInt(savedWordCount));
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.uid);
        console.log(user.displayName);

        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  useEffect(() => {
    setHomeState(isLoading);
  }, [isLoading]);

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
  const addLobby = async (words, translation, isOpen) => {
    try {
      const docRef = await addDoc(collection(db, "lobbies"), {
        //players: [user.uid],
        isOpen: isOpen,
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

  const handleSolo = async () => {
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
        await addLobby(wordsFetched, translationFetched, false);
        //navigate("/play");
      } else {
        console.error("Failed to fetch data for play.");
      }
    }
  };
  const handlePlay = async () => {
    setIsLoading(true);
    switch (gamemode) {
      case 0:
        handleSolo();
        break;
      case 1:
        break;
      case 2:
        break;
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
