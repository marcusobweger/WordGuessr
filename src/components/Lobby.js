import React, { useEffect } from "react";
import PlayerCard from "./PlayerCard";
import { useFirebaseContext } from "../utils/firebaseContext";
import { updateUserData } from "../utils/userUtils";
import { useAuth } from "../utils/authContext";

export default function Lobby() {
  const { lobbyData, lobbyId } = useFirebaseContext();
  const { currentUser } = useAuth();
  const handleUpdateUserData = async (updatedFields) => {
    try {
      await updateUserData(currentUser, updatedFields);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(lobbyData);

  useEffect(() => {
    handleUpdateUserData({ state: "playing" });
  }, []);

  return (
    <div className="container">
      <div className="container page">
        <div className="row">{lobbyId}</div>
        <div className="row">
          <PlayerCard lobbyData={lobbyData} />
        </div>
      </div>
    </div>
  );
}
