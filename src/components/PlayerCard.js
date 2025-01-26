import useLobbyListener from "../utils/useLobbyListener";

const PlayerCard = () => {
  const lobbyData = useLobbyListener();
  console.log(lobbyData);
  return (
    <>
      {lobbyData &&
        Array.from({ length: Object.keys(lobbyData.players).length }, (_, index) => (
          <div key={index} className="col wordCard">
            <div className="row">{Object.values(lobbyData.players)[index].name}</div>
          </div>
        ))}
    </>
  );
};
export default PlayerCard;
