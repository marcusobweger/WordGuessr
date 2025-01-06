import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import japan from "../icons/japan.png";
import korea from "../icons/south-korea.png";
import germany from "../icons/germany.png";
import italy from "../icons/italy.png";
import france from "../icons/france.png";
import spain from "../icons/spain.png";
import "../styling/Home.css";
import logo from "../icons/wordguessr_logo1.png";

function Home() {
  const [gamemode, setGamemode] = useState(0);
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ja");
  const [wordCount, setWordCount] = useState(3);

  const [words, setWords] = useState([]);
  const [translation, setTranslation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchRandomWords = async () => {
    try {
      const response = await fetch(
        `https://random-word-api.herokuapp.com/word?length=${
          Math.floor(Math.random() * 6) + 4
        }&number=${wordCount}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching random words:", error);
      return [];
    }
  };
  const fetchTranslation = async (wordsFetched) => {
    const baseUrl = "https://lingva.ml/api/v1";
    const endpoint = `${baseUrl}/${sourceLang}/${targetLang}/${wordsFetched}`;
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      //console.log(data);
      //console.log(data.translation.replace(/\s+/g, "").split(/[、,]/));
      return data.translation.replace(/\s+/g, "").split(/[、,]/);
    } catch (error) {
      console.error("Error fetching translation:", error);
      return [];
    }
  };

  const handlePlay = async () => {
    setIsLoading(true);
    let wordsFetched = [];
    let translationFetched = [];
    try {
      wordsFetched = await fetchRandomWords();
      setWords(wordsFetched);
      translationFetched = await fetchTranslation(wordsFetched);
      setTranslation(translationFetched);
    } catch (error) {
      console.error("Error during the play process:", error);
    } finally {
      if (wordsFetched.length > 0 && translationFetched.length > 0) {
        navigate("/play", {
          state: {
            words: wordsFetched,
            translation: translationFetched,
            wordCount: wordCount,
          },
        });
      } else {
        console.error("Failed to fetch data for play.");
      }
    }
  };

  return (
    <div className="container">
      <div className="header-container">
        <img className="logo" src={logo} alt="logo"></img>
        <h1 className="title">WordGuessr</h1>
      </div>
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
          <button className="col" onClick={handlePlay}>
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
