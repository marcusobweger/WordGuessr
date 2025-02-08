const PlayerCard = ({ lobbyData }) => {
  return Array.from({ length: Object.keys(lobbyData.players).length }, (_, index) => (
    <div key={index} className="col-12 col-lg wordCard player-card">
      <div className="col player-name">{Object.values(lobbyData.players)[index].name}</div>
      <div
        className={`col-5 col-md-4 ready-indicator ${
          Object.values(lobbyData.players)[index].ready ? "ready" : "unready"
        }`}>
        {Object.values(lobbyData.players)[index].ready ? "Ready" : "Not ready"}
      </div>
    </div>
  ));
};
export default PlayerCard;
