import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doSignInAnonymously } from "../utils/authUtils";
import { createNewUser } from "../utils/userUtils";
import Loading from "./Loading";
import { useFirebaseContext } from "../utils/firebaseContext";
import { useAuth } from "../utils/authContext";

export default function Continue() {
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFinishedSigningIn, setHasFinishedSigningIn] = useState(false);
  const { userData } = useFirebaseContext();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (hasFinishedSigningIn) {
      handleCreateNewUser();
    }
  }, [hasFinishedSigningIn]);
  useEffect(() => {
    if (!currentUser) return;
    if (userData) {
      setIsLoading(false);
      if (userData.name === "Guest") {
        navigate("/username");
      } else {
        navigate("/play");
      }
    }
  }, [userData, currentUser]);
  const handleCreateNewUser = async () => {
    try {
      await createNewUser(currentUser);
    } catch (error) {}
  };
  const handleNavigateToLogin = () => {
    navigate("/login");
  };
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
