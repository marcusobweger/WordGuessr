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
  // navigate from react-router
  const navigate = useNavigate();
  // data from context
  const { userData, lobbyData, lobbyId } = useFirebaseContext();
  // get the currentUser object from firebase auth
  const { currentUser } = useAuth();
  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // handles the functionality when the user presses the sign out button
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      // save the user before he logs out since currentUser will be null when no user is logged in
      const prevUser = currentUser;
      // if the user was an anonymous user, delete the user
      await deleteAnonymousUser(prevUser);
      // sign out all other users
      await doSignOut();

      if (lobbyData) {
        // delete lobby if only one player left and this player is the current player, also in solo mode
        if (
          Object.keys(lobbyData?.players).includes(prevUser.uid) &&
          Object.keys(lobbyData?.players).length === 1 &&
          Object.keys(lobbyData?.players)[0] === prevUser.uid
        ) {
          try {
            deleteLobby(lobbyId);
          } catch (error) {}
        } else {
          try {
            deletePlayerFromLobby(prevUser, lobbyData, lobbyId);
          } catch (error) {}
        }
      }
      setIsLoading(false);
      navigate("/");
    } catch (error) {}
  };
  // display a loader on the button while loading
  const SignOutButtonContent = () => {
    if (isLoading) {
      return <Loading />;
    } else {
      return "Sign Out";
    }
  };
  // navigate to the edit the username
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
        <div className="row page profile-page pb-0">
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
