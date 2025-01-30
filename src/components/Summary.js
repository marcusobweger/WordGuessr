import React, { useEffect } from "react";
import fire from "../icons/fire.png";
import CountUp from "react-countup";
import WordCard from "./WordCard";

const Summary = ({ lobbyData, userData, currentUser }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="score col-12 col-sm-12 col-lg-6">
          Score:&nbsp;
          <CountUp end={lobbyData.players[currentUser.uid]?.score} duration={3} separator="" />
          {lobbyData.players[currentUser.uid]?.isNewPb && (
            <img src={fire} className="fire" alt="new highScore"></img>
          )}
        </div>
        <div className="score col-12 col-sm-12 col-lg-6">
          Best:&nbsp;
          {lobbyData.players[currentUser.uid]?.isNewPb ? (
            <>
              <CountUp
                end={userData.highScores[lobbyData.settings.wordCount]}
                duration={3}
                separator=""
              />
              <img src={fire} className="fire" alt="new highScore"></img>
            </>
          ) : (
            userData.highScores[lobbyData.settings.wordCount]
          )}
        </div>
      </div>
      <div className="row wordCardRow">
        <WordCard lobbyData={lobbyData} userData={userData} currentUser={currentUser} />
      </div>
    </div>
  );
};
export default Summary;
