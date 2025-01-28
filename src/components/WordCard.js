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

const WordCard = ({ lobbyData, userData, currentUser }) => {
  console.log(lobbyData.settings.wordCount);
  const targetLangIcon = iconMap[lobbyData.settings.targetLang];
  const sourceLangIcon = iconMap[lobbyData.settings.sourceLang];
  // error because invalid array index undefined reading '0'
  return Array.from({ length: lobbyData.settings.wordCount }, (_, index) => (
    <div key={index} className="wordCard col-12 col-sm-12 col-md col-lg">
      <div className="row">
        <div className="col wordCardTime">
          <img src={time} className="time" alt="time icon"></img>
          {lobbyData.players[currentUser.uid].times[index] !== 0 ? (
            <>{lobbyData.players[currentUser.uid].times[index] / 10}s</>
          ) : (
            <>-:-</>
          )}
        </div>
        <div className="col wordCardScore">
          <CountUp
            end={lobbyData.players[currentUser.uid].scores[index]}
            duration={3}
            separator=""
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
        {lobbyData.settings.translation[index]}
      </div>
      <div className="row wordCardWords">
        <img
          className="wordCardIcons"
          src={sourceLangIcon}
          alt={`${lobbyData.settings.sourceLang} icon`}></img>
        {lobbyData.settings.words[index]}
      </div>
      <div className="row wordCardWords">
        <img src={user} className="wordCardIcons" alt="user's guess"></img>
        {lobbyData.players[currentUser.uid].guesses[index]}
      </div>
    </div>
  ));
};
export default WordCard;
