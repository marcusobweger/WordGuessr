import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doSignInAnonymously } from "../utils/authUtils";
import { useAuth } from "../utils/authContext";
import EnterUserName from "./EnterUserName";

export default function Continue() {
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userLoggedIn } = useAuth();

  const handleNavigateToLogin = () => {
    navigate("/login");
  };
  const handleContinueAsGuest = async () => {
    setIsLoading(true);
    if (!isSigningIn) {
      try {
        await doSignInAnonymously();
        setIsSigningIn(true);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
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
    <>
      {!userLoggedIn ? (
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
      ) : (
        <EnterUserName />
      )}
    </>
  );
}
