import React from "react";
import { doSignOut } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import useUserListener from "../utils/useUserListener";
function Profile() {
  const navigate = useNavigate();
  const userData = useUserListener();

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  if (!userData) {
    return (
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }
  return (
    <div>
      {userData && <h1 className="title">{userData.name}</h1>}
      Profile
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
export default Profile;
