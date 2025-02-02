import React from "react";

const PlayerNavBar = ({ lobbyData, setCurrentPlayer }) => {
  return Array.from({ length: Object.keys(lobbyData.players).length }, (_, index) => (
    <button
      key={index}
      className="playerNavBarButtons col-sm-6 col-12"
      onClick={() => setCurrentPlayer(Object.keys(lobbyData.players)[index])}>
      {Object.values(lobbyData.players)[index].name}
    </button>
  ));
};
export default PlayerNavBar;
