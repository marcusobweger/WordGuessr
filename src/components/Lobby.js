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
import copy from "../icons/copy.png";
function Lobby() {
  const [disableReady, setDisableReady] = useState(false);
  const [copied, setCopied] = useState(false);

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
  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(lobbyId);
    setCopied(true);
  };

  if (!currentUser || !lobbyData || !userData) {
    return <Loading />;
  }
  const HomeButton = () => {
    const [leave, setLeave] = useState(false);
    return (
      <>
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
      </>
    );
  };

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
