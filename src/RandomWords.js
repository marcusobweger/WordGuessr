import React, { useState } from "react";

const RandomWords = () => {
  const [words, setWords] = useState([]);
  const [wordCount, setWordCount] = useState(3);

  const fetchRandomWords = async (count = 1) => {
    try {
      const response = await fetch(
        `https://random-word-api.herokuapp.com/word?number=${count}`
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

  return (
    <div>
      <button onClick={() => setWordCount(4)}>4</button>
      <button onClick={() => fetchRandomWords(wordCount)}>
        Get Random Words
      </button>
      <ul>
        {words.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
    </div>
  );
};

export default RandomWords;
