import React, { useState } from "react";
import { doSignOut } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { deleteAnonymousUser } from "../utils/userUtils";
import { deleteLobby, deletePlayerFromLobby } from "../utils/lobbyUtils";
import { useFirebaseContext } from "../utils/firebaseContext";
import { useAuth } from "../utils/authContext";
import edit from "../icons/edit.png";
import "../styling/Profile.css";
function Profile() {
  const navigate = useNavigate();
  const { userData, lobbyData, lobbyId } = useFirebaseContext();
  const { currentUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const prevUser = currentUser;
      await doSignOut();
      await deleteAnonymousUser(prevUser);

      if (lobbyData) {
        // delete lobby if only one player left and this player is the current player, also in solo mode
        console.log("lobbyData");
        if (
          Object.keys(lobbyData?.players).includes(prevUser.uid) &&
          Object.keys(lobbyData?.players).length === 1 &&
          Object.keys(lobbyData?.players)[0] === prevUser.uid
        ) {
          console.log("if");
          try {
            deleteLobby(lobbyId);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("attempting delete player");
          try {
            deletePlayerFromLobby(prevUser, lobbyData, lobbyId);
          } catch (error) {
            console.log(error);
          }
        }
      }
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const SignOutButtonContent = () => {
    if (isLoading) {
      return <Loading />;
    } else {
      return "Sign Out";
    }
  };
  const handleNavigateUsername = () => {
    navigate("/username");
  };

  if (!userData || !currentUser) {
    return <Loading />;
  }
  return (
    <div className="container">
      <div className="container">
        <div className="row leaderboard-title-row">Profile</div>
        <div className="row page">
          {userData.name}
          <button className="edit-username-button" onClick={handleNavigateUsername}>
            <img src={edit} className="edit" alt="edit username"></img>
          </button>
        </div>
        <div className="row profile-button-row">
          <button className="signout-button" onClick={handleSignOut}>
            <SignOutButtonContent />
          </button>
        </div>
      </div>
    </div>
  );
}
export default Profile;
