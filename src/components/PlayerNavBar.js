import React from "react";

const PlayerNavBar = ({ lobbyData, setCurrentPlayer }) => {
  return Array.from({ length: Object.keys(lobbyData.players).length }, (_, index) => (
    <div key={index} className="playerNameCard row">
      <button type="button" onClick={() => setCurrentPlayer(Object.keys(lobbyData.players)[index])}>
        {Object.values(lobbyData.players)[index].name}
      </button>
    </div>
  ));
};
export default PlayerNavBar;
