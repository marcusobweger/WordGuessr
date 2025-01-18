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
import { fetchRandomWords, fetchTranslation } from "./utils";

function Home() {
  const { homeState, setHomeState } = useContext(AppContext);
  const [gamemode, setGamemode] = useState(0);
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ja");
  const [wordCount, setWordCount] = useState(3);

  const [words, setWords] = useState([]);
  const [translation, setTranslation] = useState([]);
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

  const handlePlay = async () => {
    setIsLoading(true);
    let wordsFetched = [];
    let translationFetched = [];
    try {
      wordsFetched = await fetchRandomWords(wordCount);
      setWords(wordsFetched);
      translationFetched = await fetchTranslation(wordsFetched, sourceLang, targetLang);
      setTranslation(translationFetched);
    } catch (error) {
      console.error("Error during the play process:", error);
    } finally {
      if (wordsFetched.length > 0 && translationFetched.length > 0) {
        savePreferences();

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
  };
  const LanguageButtons = () => {
    return Array.from({ length: targetLanguages.length }, (_, index) => (
      <button
        key={index}
        className={`col language ${targetLang === targetLanguages[index] ? "clicked" : ""}`}
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
        className={`col wordCount ${wordCount === wordCounts[index] ? "clicked" : ""}`}
        disabled={isLoading}
        onClick={() => setWordCount(wordCounts[index])}>
        {wordCounts[index]}
      </button>
    ));
  };

  return (
    <div className="container">
      <div className="container">
        <div className="row buttonGaps">
          <button
            className={`col gamemode ${gamemode === 0 ? "clicked" : ""}`}
            onClick={() => setGamemode(0)}
            disabled={isLoading}>
            Solo
          </button>
          <button
            className={`col gamemode ${gamemode === 1 ? "clicked" : ""}`}
            onClick={() => setGamemode(1)}
            disabled>
            Online
          </button>
        </div>
        <div className="row buttonGaps">
          <LanguageButtons />
        </div>
        <div className="row buttonGaps">
          <WordCountButtons />
        </div>
        <div className="play row buttonGaps justify-content-md-center">
          <button className="col" onClick={handlePlay} disabled={isLoading}>
            {isLoading ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Play"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
