import React, { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import { useFirebaseContext } from "../utils/firebaseContext";
import { updateUserData } from "../utils/userUtils";
import { useAuth } from "../utils/authContext";
import Loading from "./Loading";
import home from "../icons/home.png";
import "../styling/Lobby.css";
import { replace, useNavigate } from "react-router-dom";
import { increment } from "firebase/firestore";
import { updateLobbyData } from "../utils/lobbyUtils";

function Lobby() {
  const [leave, setLeave] = useState(false);
  const [disableReady, setDisableReady] = useState(false);

  const { lobbyData, userData, lobbyId } = useFirebaseContext();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) return;
    handleUpdateUserData({ state: "lobby" });
  }, []);
  useEffect(() => {
    if (!currentUser || !lobbyData) return;

    if (Object.keys(lobbyData?.players).length === 1) {
      setDisableReady(true);
    } else {
      setDisableReady(false);
    }
  }, [Object.keys(lobbyData?.players).length]);
  useEffect(() => {
    if (lobbyData?.readyCount === Object.keys(lobbyData?.players).length) {
      navigate("/play");
    }
  }, [lobbyData?.readyCount]);
  const handleUpdateLobbyData = async (updatedFields) => {
    try {
      await updateLobbyData(lobbyId, updatedFields);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateUserData = async (updatedFields) => {
    try {
      await updateUserData(currentUser, updatedFields);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(lobbyData);

  const handleHome = () => {
    navigate("/");
  };
  const handleReady = async () => {
    if (
      !lobbyData?.players[currentUser.uid]?.ready &&
      Object.keys(lobbyData?.players).length !== 1
    ) {
      await handleUpdateLobbyData({
        readyCount: increment(1),
        [`players.${currentUser.uid}.ready`]: true,
      });
    } else {
      console.log("cant retry, only one player left");
    }
  };
  if (!currentUser || !lobbyData || !userData) {
    return <Loading />;
  }

  return (
    <div className="container">
      <div className="container page shadow">
        <div className="row">{lobbyId}</div>
        <div className="row">
          <PlayerCard lobbyData={lobbyData} />
        </div>
      </div>
      <div className="container">
        <div className="row buttonRow">
          {!leave ? (
            <button className="homeButton col-lg-3 col-12" onClick={() => setLeave(true)}>
              <img className="home" src={home} alt="home"></img>
            </button>
          ) : (
            <>
              <button className="cancelButton col col-lg-2" onClick={() => setLeave(false)}>
                Cancel
              </button>
              <button className="leaveButton col col-lg-2" onClick={handleHome}>
                Leave
              </button>
            </>
          )}
          <button
            className="skipButton col-lg-3 col-12"
            onClick={handleReady}
            disabled={disableReady}>
            {lobbyData?.readyCount !== 0
              ? lobbyData?.readyCount + " of " + Object.keys(lobbyData?.players).length
              : "Ready"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Lobby;
