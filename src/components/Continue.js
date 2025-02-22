import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doSignInAnonymously } from "../utils/authUtils";
import { createNewUser } from "../utils/userUtils";
import Loading from "./Loading";
import { useFirebaseContext } from "../utils/firebaseContext";
import { useAuth } from "../utils/authContext";

export default function Continue() {
  // navigate from react-router
  const navigate = useNavigate();

  // loading states
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFinishedSigningIn, setHasFinishedSigningIn] = useState(false);

  // get the userData object of the current user from the context
  const { userData } = useFirebaseContext();
  // get the currentUser object from firebase auth
  const { currentUser } = useAuth();

  useEffect(() => {
    if (hasFinishedSigningIn) {
      handleCreateNewUser();
    }
  }, [hasFinishedSigningIn]);
  useEffect(() => {
    // exit if there is no user logged in
    if (!currentUser) return;
    if (userData) {
      setIsLoading(false);
      // if the username is still the default Guest, redirect to the /username page
      if (userData.name === "Guest") {
        navigate("/username");
      } else {
        // else start the game
        navigate("/play");
      }
    }
  }, [userData, currentUser]);
  // calls the createNewUser function from the utils file
  const handleCreateNewUser = async () => {
    try {
      await createNewUser(currentUser);
    } catch (error) {}
  };
  // navigate to the login page
  const handleNavigateToLogin = () => {
    navigate("/login");
  };
  // signs the user in anonymously on firebase if he chooses to play as Guest
  const handleContinueAsGuest = async () => {
    if (!isSigningIn) {
      setIsSigningIn(true);
      setIsLoading(true);
      try {
        await doSignInAnonymously();
        setHasFinishedSigningIn(true);
        setIsSigningIn(false);
      } catch (error) {
        setHasFinishedSigningIn(false);
        setIsSigningIn(false);
      }
    }
  };
  // show a loading state on the button if loading is in progress
  const GuestButtonContent = () => {
    if (isLoading) {
      return <Loading />;
    } else {
      return "Continue as Guest";
    }
  };
  return (
    <div className="container col-md-6 col-xl-4">
      <div className="container">
        <div className="row buttonGaps">
          <button className="col" onClick={handleNavigateToLogin} disabled={isLoading}>
            Sign in
          </button>
        </div>
        <div className="row buttonGaps">
          <button className="col" onClick={handleContinueAsGuest} disabled={isLoading}>
            <GuestButtonContent />
          </button>
        </div>
      </div>
    </div>
  );
}
