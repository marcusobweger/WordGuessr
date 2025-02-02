import React, { useState } from "react";
import { doSignOut } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { deleteAnonymousUser } from "../utils/userUtils";
import { deleteLobby, deletePlayerFromLobby } from "../utils/lobbyUtils";
import { useFirebaseContext } from "../utils/firebaseContext";
import { useAuth } from "../utils/authContext";
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
        if (
          Object.keys(lobbyData?.players).includes(currentUser.uid) &&
          Object.keys(lobbyData?.players).length === 1 &&
          Object.keys(lobbyData?.players)[0] === currentUser.uid
        ) {
          try {
            deleteLobby(lobbyId);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("attempting delete player");
          try {
            deletePlayerFromLobby(currentUser, lobbyId);
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

  if (!userData) {
    return <Loading />;
  }
  return (
    <div>
      <h1 className="title">{userData.name}</h1> Profile
      <button onClick={handleSignOut}>
        <SignOutButtonContent />
      </button>
    </div>
  );
}
export default Profile;
