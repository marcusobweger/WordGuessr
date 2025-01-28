import React from "react";
import { doSignOut } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import useUserListener from "../utils/useUserListener";
import useUserActions from "../utils/useUserActions";
function Profile() {
  const navigate = useNavigate();
  const { userData, userDataLoading } = useUserListener();
  const { deleteAnonymousUser } = useUserActions();

  const handleSignOut = async () => {
    try {
      await deleteAnonymousUser();
      await doSignOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  if (userDataLoading) {
    return (
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }
  return (
    <div>
      <h1 className="title">{userData.name}</h1> Profile
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
export default Profile;
