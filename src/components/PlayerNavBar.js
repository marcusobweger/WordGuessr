import React from "react";
import confetti from "../icons/confetti.png";

const PlayerNavBar = ({ lobbyData, setCurrentPlayerIndex, currentPlayerIndex, sortedPlayers }) => {
  console.log(document.body.scrollHeight);
  return (
    <>
      {sortedPlayers.map((player, index) => (
        <button
          key={index}
          className={`playerNavBarButtons ${
            Object.keys(lobbyData.players).length === 1 ? "col col-md-6" : "col"
          } ${currentPlayerIndex === index ? "selected" : ""}`}
          onClick={() => setCurrentPlayerIndex(index)}>
          {player.name}&nbsp;
          {player.winner && <img className="confetti" src={confetti} alt="winner"></img>}
        </button>
      ))}
    </>
  );
};
export default PlayerNavBar;
