import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Play() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);

  const { words, translation } = location.state || {
    words: [],
    translation: [],
  };

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (guess.trim().toLowerCase() === words[currentIndex].toLowerCase()) {
      setFeedback("Correct!");
      setGuess("");

      if (currentIndex < translation.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFinished(true);
      }
    } else {
      setFeedback("Incorrect! Try again.");
      setGuess("");
    }
  };

  return (
    <div>
      {/*testing*/}
      <p>{words[currentIndex]}</p>
      <p>{translation[currentIndex]}</p>
      <div>
        {!finished ? (
          <>
            <p>{translation[currentIndex]}</p>
            <form onSubmit={handleGuessSubmit}>
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="translation"
                autoFocus
              />
            </form>
            <p>{feedback}</p>
          </>
        ) : (
          <div>
            <p>Game Over! Well done!</p>
            {/*
            <>{navigate("/summary", { state: "" })}</>
            */}
          </div>
        )}
      </div>
    </div>
  );
}
export default Play;
