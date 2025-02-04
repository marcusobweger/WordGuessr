import React from "react";

const PlayerNavBar = ({ lobbyData, setCurrentPlayer, currentPlayer }) => {
  return Array.from({ length: Object.keys(lobbyData.players).length }, (_, index) => (
    <button
      key={index}
      className={`playerNavBarButtons ${
        Object.keys(lobbyData.players).length === 1 ? "col col-md-6" : "col"
      } ${currentPlayer === Object.keys(lobbyData.players)[index] ? "selected" : ""}`}
      onClick={() => setCurrentPlayer(Object.keys(lobbyData.players)[index])}>
      {Object.values(lobbyData.players)[index].name}
    </button>
  ));
};
export default PlayerNavBar;
