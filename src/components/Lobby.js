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
  // state to disable the ready button based on certain conditions
  const [disableReady, setDisableReady] = useState(false);
  // get data from context
  const { lobbyData, userData, lobbyId } = useFirebaseContext();
  // get the currentUser object from firebase auth
  const { currentUser } = useAuth();
  // navigate from react-router
  const navigate = useNavigate();
  // if the page is mounted, set the user's state to lobby
  useEffect(() => {
    if (!currentUser || !lobbyData) return;
    handleUpdateUserData({ state: "lobby" });
  }, []);
  // disable the ready button if only one player is in the lobby to prevent players playing alone
  useEffect(() => {
    if (!currentUser || !lobbyData) return;
    if (Object.keys(lobbyData?.players).length === 1) {
      setDisableReady(true);
    } else {
      setDisableReady(false);
    }
  }, [lobbyData?.players]);
  // if every player in the lobby is ready, start the game and navigate to play
  useEffect(() => {
    if (!currentUser || !lobbyData) return;
    if (lobbyData?.readyCount === Object.keys(lobbyData?.players)?.length) {
      navigate("/play");
    }
  }, [lobbyData?.readyCount]);
  // handler for updating the lobbies collection on firebase
  const handleUpdateLobbyData = async (updatedFields) => {
    try {
      await updateLobbyData(lobbyId, updatedFields);
    } catch (error) {}
  };
  // handler for updating the users collection on firebase
  const handleUpdateUserData = async (updatedFields) => {
    try {
      await updateUserData(currentUser, updatedFields);
    } catch (error) {}
  };
  // handle the update of the readyCount and the individual ready toggle of ever player
  //  in the lobby in the firebase lobbies collection
  const handleReady = async () => {
    // if there are more players than one
    if (Object.keys(lobbyData?.players).length !== 1) {
      // if the player is not ready yet and clicks ready
      if (!lobbyData?.players[currentUser.uid]?.ready) {
        // increase the readyCount by one and set the current users ready toggle to true
        await handleUpdateLobbyData({
          readyCount: increment(1),
          [`players.${currentUser.uid}.ready`]: true,
        });
        // else if the player is ready already and presses the ready button again, decrease the readyCount
        // and set the players ready toggle to false
      } else {
        await handleUpdateLobbyData({
          readyCount: increment(-1),
          [`players.${currentUser.uid}.ready`]: false,
        });
      }
    }
  };
  // the CopyButton component for copying the lobby code at the top of the lobby page
  const CopyButton = () => {
    // state for toggling between two icons if the copy was successful
    const [copied, setCopied] = useState(false);
    const handleCopyToClipboard = async () => {
      // copies the code (which is the lobbyId) to the clipboard
      await navigator.clipboard.writeText(lobbyId);
      // show the check icon to give feedback that the copy was successful
      setCopied(true);
      // change back to the original copy icon after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    };
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
