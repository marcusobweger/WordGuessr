import React from "react";
import confetti from "../icons/confetti.png";
// the bar at the to of the summary page which allows switching between the results of all players
const PlayerNavBar = ({ lobbyData, setCurrentPlayerIndex, currentPlayerIndex, sortedPlayers }) => {
  return (
    <>
      {sortedPlayers.map((player, index) => (
        <button
          key={index}
          className={`playerNavBarButtons ${
            Object.keys(lobbyData.players).length === 1 ? "col col-md-6" : "col"
          } ${currentPlayerIndex === index ? "selected" : ""}`}
          onClick={() => setCurrentPlayerIndex(index)}>
          {player.name}
          {index === 0 && <img className="confetti" src={confetti} alt="winner"></img>}
        </button>
      ))}
    </>
  );
};
export default PlayerNavBar;
