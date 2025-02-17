import React, { useContext, useEffect, useState } from "react";
import "../styling/Signin.css";
import google from "../icons/search.png";
import github from "../icons/github.png";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSignInWithGithub,
  doSignInWithGoogle,
} from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { useFirebaseContext } from "../utils/firebaseContext";
import { createNewUser } from "../utils/userUtils";
import { useAuth } from "../utils/authContext";

function Signin({ type }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [hasFinishedSigningIn, setHasFinishedSigningIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useFirebaseContext();
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if ((email || password !== "") && isError) {
      setIsError(false);
    }
  }, [email, password]);
  useEffect(() => {
    if (hasFinishedSigningIn) {
      setIsLoading(true);
      handleCreateNewUser();
    }
  }, [hasFinishedSigningIn]);
  useEffect(() => {
    if (!currentUser || currentUser.isAnonymous) return;
    if (userData) {
      setIsLoading(false);
      if (userData.name === "Guest") {
        navigate("/username");
      } else {
        navigate("/");
      }
    }
  }, [userData, currentUser]);
  const handleCreateNewUser = async () => {
    try {
      await createNewUser(currentUser);
    } catch (error) {}
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        if (type === "login") {
          await doSignInWithEmailAndPassword(email, password);
        } else {
          await doCreateUserWithEmailAndPassword(email, password);
        }
        setHasFinishedSigningIn(true);
        setIsError(false);
        setIsSigningIn(false);
      } catch (error) {
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
        setHasFinishedSigningIn(false);
        setIsSigningIn(false);
      }
    }
  };

  const handleNavigate = () => {
    setIsError(false);
    if (type === "login") {
      navigate("/signup");
    } else {
      navigate("/login");
    }
  };
  //add currentUser if users should not be able to sign in via /login url if they are already signed in
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="container col-md-6 col-xl-4">
      <div className="container page shadow login-page">
        <div className="row">
          <div className="col login-text">{type === "login" ? "Welcome back!" : "Welcome!"}</div>
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
          <form id="signin" onSubmit={handleEmail} className="col">
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
              spellCheck={false}
            />
            <input
              className={`${isError ? "error" : ""} inputfield login-inputfield row`}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
              maxLength={25}
              spellCheck={false}
            />
            <button type="submit" className="submit-button row">
              Continue
            </button>
          </form>
        </div>
        <button className="row create-button" onClick={handleNavigate}>
          {type === "login" ? "Don't have an account?" : "Already have an account?"}
        </button>
      </div>
    </div>
  );
}
export default Signin;
