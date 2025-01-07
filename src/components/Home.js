import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import japan from "../icons/japan.png";
import korea from "../icons/south-korea.png";
import germany from "../icons/germany.png";
import italy from "../icons/italy.png";
import france from "../icons/france.png";
import spain from "../icons/spain.png";
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
      translationFetched = await fetchTranslation(
        wordsFetched,
        sourceLang,
        targetLang
      );
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

  return (
    <div className="container">
      <div className="container">
        <div className="row mb-3 gap-3">
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
        <div className="row mb-3 gap-3">
          <button
            className={`col language ${targetLang === "ja" ? "clicked" : ""}`}
            disabled={isLoading}
            onClick={() => setTargetLang("ja")}>
            <img className="icons" src={japan} alt="japanese"></img>
          </button>
          <button
            className={`col language ${targetLang === "ko" ? "clicked" : ""}`}
            disabled={isLoading}
            onClick={() => setTargetLang("ko")}>
            <img className="icons" src={korea} alt="korean"></img>
          </button>
          <button
            className={`col language ${targetLang === "de" ? "clicked" : ""}`}
            disabled={isLoading}
            onClick={() => setTargetLang("de")}>
            <img className="icons" src={germany} alt="german"></img>
          </button>
          <button
            className={`col language ${targetLang === "it" ? "clicked" : ""}`}
            disabled={isLoading}
            onClick={() => setTargetLang("it")}>
            <img className="icons" src={italy} alt="italian"></img>
          </button>
          <button
            className={`col language ${targetLang === "fr" ? "clicked" : ""}`}
            disabled={isLoading}
            onClick={() => setTargetLang("fr")}>
            <img className="icons" src={france} alt="french"></img>
          </button>
          <button
            className={`col language ${targetLang === "es" ? "clicked" : ""}`}
            disabled={isLoading}
            onClick={() => setTargetLang("es")}>
            <img className="icons" src={spain} alt="spanish"></img>
          </button>
        </div>
        <div className="row mb-3 gap-3">
          <button
            className={`col wordCount ${wordCount === 3 ? "clicked" : ""}`}
            disabled={isLoading}
            onClick={() => setWordCount(3)}>
            3
          </button>
          <button
            className={`col wordCount ${wordCount === 5 ? "clicked" : ""}`}
            disabled={isLoading}
            onClick={() => setWordCount(5)}>
            5
          </button>
          <button
            className={`col wordCount ${wordCount === 10 ? "clicked" : ""}`}
            disabled={isLoading}
            onClick={() => setWordCount(10)}>
            10
          </button>
          <button
            className={`col wordCount ${wordCount === 15 ? "clicked" : ""}`}
            disabled={isLoading}
            onClick={() => setWordCount(15)}>
            15
          </button>
        </div>
        <div className="play row mb-3 gap-3 justify-content-md-center">
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
