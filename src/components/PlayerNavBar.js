import React from "react";

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
        </button>
      ))}
    </>
  );
};
export default PlayerNavBar;
