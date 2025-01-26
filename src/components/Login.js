import React, { useContext, useEffect, useState } from "react";
import "../styling/Login.css";
import google from "../icons/search.png";
import github from "../icons/github.png";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGithub,
  doSignInWithGoogle,
} from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import useUserActions from "../utils/useUserActions";
import useUserListener from "../utils/useUserListener";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [hasFinishedSigningIn, setHasFinishedSigningIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const userData = useUserListener();
  const { createNewUser } = useUserActions();

  const navigate = useNavigate();

  useEffect(() => {
    if ((email || password !== "") && isError) {
      setIsError(false);
    }
  }, [email, password]);
  useEffect(() => {
    if (hasFinishedSigningIn) {
      handleCreateNewUser();
    }
  }, [hasFinishedSigningIn]);
  useEffect(() => {
    if (userData) {
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

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        setHasFinishedSigningIn(true);
        setIsError(false);
        setIsSigningIn(false);
      } catch (error) {
        console.log(error);
        setHasFinishedSigningIn(false);
        setIsError(true);
        setEmail("");
        setPassword("");
        setIsSigningIn(false);
      }
    }
  };
  const handleGoogleSignIn = async () => {
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
        setHasFinishedSigningIn(true);
        setIsSigningIn(false);
      } catch (error) {
        console.log(error);
        setHasFinishedSigningIn(false);
        setIsSigningIn(false);
      }
    }
  };
  const handleGithubSignIn = async () => {
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGithub();
        setHasFinishedSigningIn(true);
        setIsSigningIn(false);
      } catch (error) {
        console.log(error);
        setHasFinishedSigningIn(false);
        setIsSigningIn(false);
      }
    }
  };

  const handleNavigateSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="container col-md-6 col-xl-4">
      <div className="container page shadow">
        <div className="row">
          <div className="col login-text">Welcome back!</div>
        </div>
        <div className="row buttonGaps sign-in-button-row">
          <button className="shadow col sign-in-buttons">
            <img
              src={google}
              alt="Sign in with Google"
              onClick={handleGoogleSignIn}
              className="sign-in-icons"></img>
          </button>
          <button className="shadow col sign-in-buttons">
            <img
              src={github}
              alt="Sign in with Github"
              onClick={handleGithubSignIn}
              className="sign-in-icons"></img>
          </button>
        </div>
        <div className="row or-text">or</div>
        <div className="row ">
          <form onSubmit={handleEmailSignIn} className="col">
            <input
              className={`${isError ? "error" : ""} inputfield login-inputfield row `}
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
              className={`${isError ? "error" : ""} inputfield login-inputfield row`}
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
        <button className="row create-button" onClick={handleNavigateSignup}>
          Don't have an account?
        </button>
      </div>
    </div>
  );
}
export default Login;
