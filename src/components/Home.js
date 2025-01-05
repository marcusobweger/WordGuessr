import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
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
          },
        });
      } else {
        console.error("Failed to fetch data for play.");
      }
    }
  };

  return (
    <div>
      <div className="gamemode">
        <button>Solo</button>
        <button>Online</button>
      </div>
      <div className="language">
        <button onClick={() => setTargetLang("ja")}>ja</button>
        <button onClick={() => setTargetLang("ko")}>ko</button>
        <button onClick={() => setTargetLang("de")}>de</button>
        <button onClick={() => setTargetLang("it")}>it</button>
      </div>
      <div className="wordcount">
        <button onClick={() => setWordCount(3)}>3</button>
        <button onClick={() => setWordCount(5)}>5</button>
        <button onClick={() => setWordCount(10)}>10</button>
        <button onClick={() => setWordCount(15)}>15</button>
      </div>
      <div className="play">
        <button onClick={handlePlay}>PLAY</button>
      </div>
      {isLoading && <div className="loading-icon">Loading...</div>}
    </div>
  );
}

export default Home;
