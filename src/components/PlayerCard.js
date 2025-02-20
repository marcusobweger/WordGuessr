import { useEffect, useState } from "react";
import crown from "../icons/crown.png";

const PlayerCard = ({ lobbyData }) => {
  const [sortedPlayers, setSortedPlayers] = useState([]);
  useEffect(() => {
    if (lobbyData?.players) {
      const sorted = Object.entries(lobbyData.players) // Convert object to array
        .map(([id, player]) => ({ id, ...player })) // Add ID to each player object
        .sort((a, b) => (a.joined?.seconds || 0) - (b.joined?.seconds || 0)); // Sort by timestamp

      setSortedPlayers(sorted);
    }
  }, [lobbyData]);

  return (
    <>
      {sortedPlayers.map((player, index) => (
        <div key={index} className="col-12 col-xl wordCard player-card">
          <div className="col player-name">
            {player.name}
            {player.host && <img src={crown} className="host-icon" alt="host"></img>}
          </div>
          <div
            className={`col-5 col-sm-4 col-md-3 ready-indicator ${
              player.ready ? "ready" : "unready"
            }`}>
            {player.ready ? "Ready" : "Not ready"}
          </div>
        </div>
      ))}
    </>
  );
};
export default PlayerCard;
