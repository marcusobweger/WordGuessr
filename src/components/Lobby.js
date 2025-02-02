import React, { useEffect } from "react";
import PlayerCard from "./PlayerCard";
import { useFirebaseContext } from "../utils/firebaseContext";
import { updateUserData } from "../utils/userUtils";
import { useAuth } from "../utils/authContext";
import Loading from "./Loading";

export default function Lobby() {
  const { lobbyData, userData, lobbyId } = useFirebaseContext();
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
    if (!currentUser) return;
    handleUpdateUserData({ state: "playing" });
  }, []);
  if (!currentUser || !lobbyData || !userData) {
    return <Loading />;
  }

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
