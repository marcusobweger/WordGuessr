import React from "react";

function PlayerNavBar({ lobbyData }) {
  return Array.from({ length: Object.keys(lobbyData.players).length }, (_, index) => (
    <div key={index} className="playerNameCard">
      <div>{Object.values(lobbyData.players)[index].name}</div>
    </div>
  ));
}
export default PlayerNavBar;
