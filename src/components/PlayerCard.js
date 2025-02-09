import crown from "../icons/crown2.png";

const PlayerCard = ({ lobbyData }) => {
  return Array.from({ length: lobbyData?.playerCount }, (_, index) => (
    <div key={index} className="col-12 col-xl wordCard player-card">
      <div className="col player-name">
        {Object.values(lobbyData.players)[index].name}
        {Object.values(lobbyData.players)[index].host && (
          <img src={crown} className="host-icon" alt="host"></img>
        )}
      </div>
      <div
        className={`col-5 col-sm-4 col-md-3 ready-indicator ${
          Object.values(lobbyData.players)[index].ready ? "ready" : "unready"
        }`}>
        {Object.values(lobbyData.players)[index].ready ? "Ready" : "Not ready"}
      </div>
    </div>
  ));
};
export default PlayerCard;
