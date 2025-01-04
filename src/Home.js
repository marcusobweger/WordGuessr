import React, { useState } from "react";

function Home() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("de");
  const [translation, setTranslation] = useState("");
  const [wordCount, setWordCount] = useState(3);

  const [words, setWords] = useState([]);

  const fetchRandomWords = async () => {
    try {
      const response = await fetch(
        `https://random-word-api.herokuapp.com/word?length=5&number=${wordCount}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setWords(data);
    } catch (error) {
      console.error("Error fetching random words:", error);
    }
  };

  const fetchTranslation = async () => {
    const baseUrl = "https://lingva.ml/api/v1";
    const endpoint = `${baseUrl}/${sourceLang}/${targetLang}/${words}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setTranslation(data.translation);
    } catch (error) {
      console.error("Error fetching translation:", error.message);
    }
  };

  console.log(words);
  console.log(translation);
  return (
    <div>
      <button onClick={() => setWordCount(3)}>3</button>
      <button onClick={() => setWordCount(5)}>5</button>
      <button onClick={() => setWordCount(10)}>10</button>
      <button onClick={() => setWordCount(15)}>15</button>
      <button
        onClick={() => {
          fetchRandomWords();
          fetchTranslation();
        }}>
        Play
      </button>
    </div>
  );
}

export default Home;
