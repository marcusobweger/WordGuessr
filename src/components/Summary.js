import React from "react";
import fire from "../icons/fire.png";

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

  return (
    <div>
      <h1 className="title">Summary</h1>
      <div className="title">
        {"Score: " + score}
        {isNewPb && <img src={fire} className="fire" alt="new highScore"></img>}
      </div>
      <div className="title">
        {"Highscore: " + highScore()}
        {isNewPb && <img src={fire} className="fire" alt="new highScore"></img>}
      </div>
    </div>
  );
};
export default Summary;
