import React from "react";
import { doSignOut } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
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
      Profile
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};
export default Profile;
