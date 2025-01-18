import React, { useEffect } from "react";
import fire from "../icons/fire.png";
import CountUp from "react-countup";
import WordCard from "./WordCard";

const Summary = ({
  highScore3,
  highScore5,
  highScore10,
  highScore15,
  wordCount,
  score,
  isNewPb,
  words,
  retryWords,
  translation,
  retryTranslation,
  guesses,
  scores,
  times,
  sourceLang,
  targetLang,
}) => {
  function highScore() {
    switch (wordCount) {
      case 3:
        return highScore3;
      case 5:
        return highScore5;
      case 10:
        return highScore10;
      case 15:
        return highScore15;
      default:
        return null;
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="score col-12 col-sm-12 col-lg-6">
          Score:
          {score !== 0 ? (
            <>
              <CountUp end={score} duration={3} separator="" prefix=" " />
            </>
          ) : (
            <>&nbsp;-:-</>
          )}
          {isNewPb && <img src={fire} className="fire" alt="new highScore"></img>}
        </div>
        <div className="score col-12 col-sm-12 col-lg-6">
          {isNewPb ? (
            <>
              Best:
              <CountUp end={highScore()} duration={3} separator="" prefix=" " />
            </>
          ) : (
            <>{"Best: " + highScore()}</>
          )}
          {isNewPb && <img src={fire} className="fire" alt="new highScore"></img>}
        </div>
      </div>
      <div className="row wordCardRow">
        <WordCard
          words={words}
          retryWords={retryWords}
          translation={translation}
          retryTranslation={retryTranslation}
          guesses={guesses}
          scores={scores}
          times={times}
          sourceLang={sourceLang}
          targetLang={targetLang}
          wordCount={wordCount}
        />
      </div>
    </div>
  );
};
export default Summary;
