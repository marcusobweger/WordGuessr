import React from "react";
import { doSignOut } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";
function Profile() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {userData && <h1 className="title">{userData.name}</h1>}
      Profile
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
export default Profile;
