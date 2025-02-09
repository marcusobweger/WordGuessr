import crown from "../icons/crown2.png";

const PlayerCard = ({ lobbyData, playerData }) => {
  return Array.from({ length: lobbyData?.playerCount }, (_, index) => (
    <div key={index} className="col-12 col-xl wordCard player-card">
      <div className="col player-name">
        {Object.values(playerData)[index].name}
        {Object.values(playerData)[index].host && (
          <img src={crown} className="host-icon" alt="host"></img>
        )}
      </div>
      <div
        className={`col-5 col-sm-4 col-md-3 ready-indicator ${
          Object.values(playerData)[index].ready ? "ready" : "unready"
        }`}>
        {Object.values(playerData)[index].ready ? "Ready" : "Not ready"}
      </div>
    </div>
  ));
};
export default PlayerCard;
