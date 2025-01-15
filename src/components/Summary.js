import React from "react";
import fire from "../icons/fire.png";
import CountUp from "react-countup";
import time from "../icons/time.png";
import ja from "../icons/japan.png";
import ko from "../icons/south-korea.png";
import de from "../icons/germany.png";
import it from "../icons/italy.png";
import fr from "../icons/france.png";
import es from "../icons/spain.png";
import en from "../icons/united-states.png";
import user from "../icons/user.png";

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
    }
  }
  const iconMap = {
    ja: ja,
    ko: ko,
    de: de,
    it: it,
    fr: fr,
    es: es,
    en: en,
  };

  const WordCard = () => {
    const targetLangIcon = iconMap[targetLang];
    const sourceLangIcon = iconMap[sourceLang];
    return Array.from({ length: wordCount }, (_, index) => (
      <div key={index} className="wordCard col-12 col-sm-12 col-md col-lg">
        <div className="row">
          <div className="col wordCardTime">
            <img src={time} className="time" alt="time icon"></img>
            {times[index] !== 0 ? <>{times[index] / 10}s</> : <>-:-</>}
          </div>
          <div className="col wordCardScore">
            <CountUp end={scores[index]} duration={3} separator="" />
          </div>
          <div className="col wordCardNumber">
            {index + 1}/{wordCount}
          </div>
        </div>
        <div className="row wordCardWords">
          <img
            className="wordCardIcons"
            src={targetLangIcon}
            alt={`${targetLang} icon`}></img>
          {!retryTranslation ? translation[index] : retryTranslation[index]}
        </div>
        <div className="row wordCardWords">
          <img
            className="wordCardIcons"
            src={sourceLangIcon}
            alt={`${sourceLang} icon`}></img>
          {!retryWords ? words[index] : retryWords[index]}
        </div>
        <div className="row wordCardWords">
          <img src={user} className="wordCardIcons" alt="user's guess"></img>
          {guesses[index]}
        </div>
      </div>
    ));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="title score col-12 col-sm-12 col-lg-6">
          Score:
          {score !== 0 ? (
            <>
              <CountUp end={score} duration={3} separator="" prefix=" " />
            </>
          ) : (
            <>&nbsp;-:-</>
          )}
          {isNewPb && (
            <img src={fire} className="fire" alt="new highScore"></img>
          )}
        </div>
        <div className="title score col-12 col-sm-12 col-lg-6">
          {isNewPb ? (
            <>
              Best:
              <CountUp end={highScore()} duration={3} separator="" prefix=" " />
            </>
          ) : (
            <>{"Best: " + highScore()}</>
          )}
          {isNewPb && (
            <img src={fire} className="fire" alt="new highScore"></img>
          )}
        </div>
      </div>
      <div className="row wordCardRow">
        <WordCard />
      </div>
    </div>
  );
};
export default Summary;
