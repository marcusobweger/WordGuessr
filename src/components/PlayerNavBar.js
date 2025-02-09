import React from "react";

const PlayerNavBar = ({ lobbyData, setCurrentPlayer, currentPlayer }) => {
  return Array.from({ length: lobbyData?.playerCount }, (_, index) => (
    <button
      key={index}
      className={`playerNavBarButtons ${lobbyData?.playerCount === 1 ? "col col-md-6" : "col"} ${
        currentPlayer === Object.keys(lobbyData.players)[index] ? "selected" : ""
      }`}
      onClick={() => setCurrentPlayer(Object.keys(lobbyData.players)[index])}>
      {Object.values(lobbyData.players)[index].name}
    </button>
  ));
};
export default PlayerNavBar;
