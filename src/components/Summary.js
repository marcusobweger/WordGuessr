import React from "react";
import fire from "../icons/fire.png";
import CountUp from "react-countup";

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
    }
  }
  const WordCard = () => {
    return Array.from({ length: wordCount }, (_, index) => (
      <div key={index} className="wordCard col">
        <div className="row align-items-center justify-content-between">
          <div className="col-2 col-sm-2 col-lg-1 wordCardTime">
            {times[index] !== 0 ? (
              <>time:&nbsp;{times[index] / 10}s</>
            ) : (
              <>&nbsp;</>
            )}
          </div>
          <div className="col-2 col-sm-2 col-lg-1 wordCardNumber">
            {index + 1}/{wordCount}
          </div>
        </div>
        <div>
          {!retryTranslation ? translation[index] : retryTranslation[index]}
        </div>
        <div>{!retryWords ? words[index] : retryWords[index]}</div>
        <div>your guess:&nbsp;{guesses[index]}</div>
        <div>score:&nbsp;{scores[index]}</div>
      </div>
    ));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="title score col-12 col-sm-12 col-lg-6">
          Score:&nbsp; <CountUp end={score} duration={3} separator="" />
          {isNewPb && (
            <img src={fire} className="fire" alt="new highScore"></img>
          )}
        </div>
        <div className="title score col-12 col-sm-12 col-lg-6">
          {isNewPb ? (
            <>
              Best:&nbsp;
              <CountUp end={highScore()} duration={3} separator="" />
            </>
          ) : (
            <>{"Best: " + highScore()}</>
          )}
          {isNewPb && (
            <img src={fire} className="fire" alt="new highScore"></img>
          )}
        </div>
      </div>
      <div className="row gap-3 wordCardRow">
        <WordCard />
      </div>
    </div>
  );
};
export default Summary;
