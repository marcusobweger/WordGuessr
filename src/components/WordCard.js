import React from "react";
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
const iconMap = {
  ja: ja,
  ko: ko,
  de: de,
  it: it,
  fr: fr,
  es: es,
  en: en,
};

const WordCard = ({ lobbyData, userData, currentPlayer }) => {
  const targetLangIcon = iconMap[lobbyData.settings.targetLang];
  const sourceLangIcon = iconMap[lobbyData.settings.sourceLang];
  console.log(lobbyData);
  console.log(currentPlayer);
  return Array.from({ length: lobbyData.settings.wordCount }, (_, index) => (
    <div key={index} className="wordCard col-12 col-sm-12 col-md col-lg">
      <div className="row">
        <div className="col wordCardTime">
          <img src={time} className="time" alt="time icon"></img>
          {lobbyData.players[currentPlayer].times[index] ? (
            <>{lobbyData.players[currentPlayer].times[index] / 10}</>
          ) : (
            0
          )}
          s
        </div>
        <div className="col wordCardScore">
          <CountUp
            key={currentPlayer}
            end={lobbyData.players[currentPlayer].scores[index]}
            duration={2}
            separator=""
            redraw={true}
          />
        </div>
        <div className="col wordCardNumber">
          {index + 1}/{lobbyData.settings.wordCount}
        </div>
      </div>
      <div className="row wordCardWords">
        <img
          className="wordCardIcons"
          src={targetLangIcon}
          alt={`${lobbyData.settings.targetLang} icon`}></img>
        {lobbyData.translation[index]}
      </div>
      <div className="row wordCardWords">
        <img
          className="wordCardIcons"
          src={sourceLangIcon}
          alt={`${lobbyData.settings.sourceLang} icon`}></img>
        {lobbyData.words[index]}
      </div>
      <div className="row wordCardWords">
        <img src={user} className="wordCardIcons" alt="user's guess"></img>
        {lobbyData.players[currentPlayer].guesses[index] ? (
          <>{lobbyData.players[currentPlayer].guesses[index]}</>
        ) : (
          "no guess"
        )}
      </div>
    </div>
  ));
};
export default WordCard;
