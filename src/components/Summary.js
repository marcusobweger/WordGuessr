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
    return (
      <div className="row gap-3">
        <div className="wordCard col">test</div>
        <div className="wordCard col">test</div>
      </div>
    );
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
      <WordCard />
    </div>
  );
};
export default Summary;
