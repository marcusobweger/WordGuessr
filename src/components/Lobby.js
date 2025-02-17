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
import check from "../icons/check.png";
import HomeButton from "./HomeButton";
function Lobby() {
  const [disableReady, setDisableReady] = useState(false);

  const { lobbyData, userData, lobbyId } = useFirebaseContext();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser || !lobbyData) return;
    handleUpdateUserData({ state: "lobby" });
  }, []);
  useEffect(() => {
    if (!currentUser || !lobbyData) return;

    if (Object.keys(lobbyData?.players).length === 1) {
      setDisableReady(true);
    } else {
      setDisableReady(false);
    }
  }, [lobbyData?.players]);
  useEffect(() => {
    if (!currentUser || !lobbyData) return;
    if (lobbyData?.readyCount === Object.keys(lobbyData?.players)?.length) {
      navigate("/play");
    }
  }, [lobbyData?.readyCount]);
  const handleUpdateLobbyData = async (updatedFields) => {
    try {
      await updateLobbyData(lobbyId, updatedFields);
    } catch (error) {}
  };
  const handleUpdateUserData = async (updatedFields) => {
    try {
      await updateUserData(currentUser, updatedFields);
    } catch (error) {}
  };

  const handleReady = async () => {
    if (Object.keys(lobbyData?.players).length !== 1) {
      if (!lobbyData?.players[currentUser.uid]?.ready) {
        await handleUpdateLobbyData({
          readyCount: increment(1),
          [`players.${currentUser.uid}.ready`]: true,
        });
      } else {
        await handleUpdateLobbyData({
          readyCount: increment(-1),
          [`players.${currentUser.uid}.ready`]: false,
        });
      }
    }
  };

  const CopyButton = () => {
    const handleCopyToClipboard = async () => {
      await navigator.clipboard.writeText(lobbyId);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    };
    const [copied, setCopied] = useState(false);
    return (
      <button onClick={handleCopyToClipboard} className="copy-button">
        <img src={copied ? check : copy} className="copy" alt="copy"></img>
      </button>
    );
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
            <CopyButton />
          </div>
          <div className="row player-card-row">
            <PlayerCard lobbyData={lobbyData} />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row buttonRow">
          <HomeButton />
          <button
            className={`skipButton ${
              lobbyData?.players[currentUser.uid]?.ready ? "unready" : "ready"
            } col-lg-3 col-12`}
            onClick={handleReady}
            disabled={disableReady}>
            {lobbyData?.players[currentUser.uid]?.ready ? "Unready" : "Ready"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Lobby;
