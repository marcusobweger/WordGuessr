import React, { useContext, useEffect, useState } from "react";
import "../styling/Login.css";
import google from "../icons/search.png";
import github from "../icons/github.png";
import apple from "../icons/apple-logo.png";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../utils/authUtils";
import { useAuth } from "../utils/authContext";
import EnterUserName from "./EnterUserName";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { userLoggedIn } = useAuth();

  const handleEmailSignIn = (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        doSignInWithEmailAndPassword();
        setIsSigningIn(false);
      } catch (error) {
        console.log(error);
        setIsSigningIn(false);
      }
    }
  };
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
        setIsSigningIn(false);
      } catch (error) {
        console.log(error);
        setIsSigningIn(false);
      }
    }
  };
  const handleGuestSignIn = () => {};

  return (
    <>
      {!userLoggedIn ? (
        <div className="container col-md-6 col-xl-4">
          <div className="container page">
            <div className="row">
              <div className="col login-text">Welcome!</div>
            </div>
            <div className="row buttonGaps sign-in-button-row">
              <button className=" col sign-in-buttons">
                <img
                  src={google}
                  alt="Sign in with Google"
                  onClick={handleGoogleSignIn}
                  className="sign-in-icons"></img>
              </button>
              <button className=" col sign-in-buttons">
                <img src={apple} alt="Sign in with Google" className="sign-in-icons"></img>
              </button>
              <button className=" col sign-in-buttons">
                <img src={github} alt="Sign in with Google" className="sign-in-icons"></img>
              </button>
            </div>
            <div className="row or-text">or</div>
            <div className="row">
              <form onSubmit={handleEmailSignIn} className="col">
                <input
                  className="inputfield login-inputfield row"
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="Email"
                  autoFocus
                  maxLength={35}
                />
                <input
                  className="inputfield login-inputfield row"
                  type="text"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  placeholder="Password"
                  maxLength={25}
                />
                <button type="submit" className="submit-button row">
                  Continue
                </button>
              </form>
            </div>
            <div className="row or-text">or</div>
            <div className="row">
              <button className="col guest-button" onClick={handleGuestSignIn}>
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      ) : (
        <EnterUserName />
      )}
    </>
  );
};
export default Login;
