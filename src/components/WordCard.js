import React from "react";
import CountUp from "react-countup";
import { iconMap } from "../utils/utils";
import time from "../icons/time.png";
import user from "../icons/user.png";

const WordCard = ({ lobbyData, currentPlayerIndex, sortedPlayers }) => {
  const targetLangIcon = iconMap[lobbyData.settings.targetLang];
  const sourceLangIcon = iconMap[lobbyData.settings.sourceLang];
  console.log(lobbyData);
  console.log(currentPlayerIndex);
  return Array.from({ length: lobbyData.settings.wordCount }, (_, index) => (
    <div key={index} className="wordCard col-12 col-sm-12 col-md col-lg">
      <div className="row">
        <div className="col wordCardTime">
          <img src={time} className="time" alt="time icon"></img>
          {sortedPlayers[currentPlayerIndex].times[index] ? (
            <>{sortedPlayers[currentPlayerIndex].times[index] / 10}</>
          ) : (
            0
          )}
          s
        </div>
        <div className="col wordCardScore">
          <CountUp
            key={currentPlayerIndex}
            end={sortedPlayers[currentPlayerIndex].scores[index]}
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
        {sortedPlayers[currentPlayerIndex].guesses[index] ? (
          <>{sortedPlayers[currentPlayerIndex].guesses[index]}</>
        ) : (
          "no guess"
        )}
      </div>
    </div>
  ));
};
export default WordCard;
