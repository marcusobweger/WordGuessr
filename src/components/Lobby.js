import React, { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import { useFirebaseContext } from "../utils/firebaseContext";
import { updateUserData } from "../utils/userUtils";
import { useAuth } from "../utils/authContext";
import Loading from "./Loading";
import "../styling/Lobby.css";
import { replace, useNavigate } from "react-router-dom";
import { increment } from "firebase/firestore";
import { updateLobbyData } from "../utils/lobbyUtils";
import copy from "../icons/copy.png";
import HomeButton from "./HomeButton";
function Lobby() {
  const [disableReady, setDisableReady] = useState(false);

  const { lobbyData, userData, playerData, lobbyId } = useFirebaseContext();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) return;
    handleUpdateUserData({ state: "lobby" });
  }, []);
  useEffect(() => {
    if (!currentUser || !lobbyData) return;

    if (lobbyData.playerCount === 1) {
      setDisableReady(true);
    } else {
      setDisableReady(false);
    }
  }, [lobbyData?.playerCount]);
  useEffect(() => {
    if (!currentUser || !lobbyData) return;
    if (lobbyData?.readyCount === lobbyData?.playerCount) {
      navigate("/play");
    }
  }, [lobbyData?.readyCount, lobbyData?.playerCount]);
  const handleUpdateLobbyData = async (updatedLobbyFields, updatedPlayerFields) => {
    try {
      await updateLobbyData(lobbyId, currentUser.uid, updatedLobbyFields, updatedPlayerFields);
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

  const handleReady = async () => {
    if (lobbyData?.playerCount !== 1) {
      if (!playerData[currentUser.uid]?.ready) {
        await handleUpdateLobbyData(
          {
            readyCount: increment(1),
          },
          {
            ready: true,
          }
        );
      } else {
        await handleUpdateLobbyData(
          {
            readyCount: increment(-1),
          },
          {
            ready: false,
          }
        );
      }
    }
  };
  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(lobbyId);
  };

  if (!currentUser || !lobbyData || !userData) {
    return <Loading />;
  }

  return (
    <div className="container">
      <div className="container page shadow">
        <div className="container">
          <div className="row lobby-code">
            {lobbyId}
            <button onClick={handleCopyToClipboard} className="copy-button">
              <img src={copy} className="copy" alt="copy"></img>
            </button>
          </div>
          <div className="row player-card-row">
            <PlayerCard lobbyData={lobbyData} playerData={playerData} />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row buttonRow">
          <HomeButton />
          <button
            className={`skipButton ${
              playerData[currentUser.uid]?.ready ? "unready" : "ready"
            } col-lg-3 col-12`}
            onClick={handleReady}
            disabled={disableReady}>
            {playerData[currentUser.uid]?.ready ? "Unready" : "Ready"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Lobby;
