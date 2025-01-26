import React, { useEffect, useState } from "react";
import { doSignOut } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import useUserActions from "../utils/useUserActions";
import { useUser } from "../utils/userContext";
function Profile() {
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();
  const { getCurrentUserData } = useUserActions();

  const handleSignOut = async () => {
    try {
      await doSignOut();
      setUserData(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  // get userData of the current USer stored in "users" and update the global context
  const handleGetUserData = async () => {
    const fetchedUserData = await getCurrentUserData();
    if (fetchedUserData !== null) {
      setUserData(fetchedUserData);
    }
  };
  useEffect(() => {
    // update user Data on every refresh of the home page
    handleGetUserData();
  }, []);

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
