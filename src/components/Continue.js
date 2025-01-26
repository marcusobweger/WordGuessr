import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doSignInAnonymously } from "../utils/authUtils";
import useUserActions from "../utils/useUserActions";
import useUserListener from "../utils/useUserListener";

export default function Continue() {
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFinishedSigningIn, setHasFinishedSigningIn] = useState(false);
  const userData = useUserListener();

  const { createNewUser } = useUserActions();

  useEffect(() => {
    if (hasFinishedSigningIn) {
      handleCreateNewUser();
    }
  }, [hasFinishedSigningIn]);
  useEffect(() => {
    if (userData) {
      setIsLoading(false);
      if (userData.name === "Anonymous") {
        navigate("/username");
      } else {
        navigate("/");
      }
    }
  }, [userData]);
  const handleCreateNewUser = async () => {
    try {
      await createNewUser();
    } catch (error) {
      console.log(error);
    }
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
        console.log(error);
        setHasFinishedSigningIn(false);
        setIsSigningIn(false);
      }
    }
  };
  const GuestButtonContent = () => {
    if (!isLoading) {
      return "Continue as Guest";
    } else {
      return (
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      );
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
