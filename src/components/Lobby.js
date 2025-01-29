import React from "react";
import useLobbyListener from "../utils/useLobbyListener";
import { useLobbyId } from "../utils/lobbyIdContext";
import PlayerCard from "./PlayerCard";

export default function Lobby() {
  const lobbyData = useLobbyListener();
  const { lobbyId } = useLobbyId();

  return (
    <div className="container">
      <div className="container page">
        <div className="row">{lobbyId}</div>
        <div className="row">
          <PlayerCard lobbyData={lobbyData} />
        </div>
      </div>
    </div>
  );
}
