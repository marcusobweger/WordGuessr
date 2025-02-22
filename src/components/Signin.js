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
  // states for storing email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // error and loading states
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [hasFinishedSigningIn, setHasFinishedSigningIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // get userData from context
  const { userData } = useFirebaseContext();
  // get the currentUser object from firebase auth
  const { currentUser } = useAuth();
  // navigate from react-router
  const navigate = useNavigate();

  // clear the error if isError is true and the user types again
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
  // see if username is the default "Guest" then navigate to username page else navigate to home
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
  // handler for creating a new user doc in the users collection on firebase
  const handleCreateNewUser = async () => {
    try {
      await createNewUser(currentUser);
    } catch (error) {}
  };
  // handler for the sign in with email form
  const handleEmail = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        // check if the type is login or signup
        if (type === "login") {
          // an account already exists, sign the user in
          await doSignInWithEmailAndPassword(email, password);
        } else {
          // no account exists, create a new one
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
  // handler for the sign in with goole button
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
  // handler for the sign in with github button
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
  // switch between login and signup pages
  const handleNavigate = () => {
    setIsError(false);
    if (type === "login") {
      navigate("/signup");
    } else {
      navigate("/login");
    }
  };
  // users should not be able to sign in via /login url if they are already signed in
  if (isLoading || currentUser) {
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
        <div className="row signin-form-row">
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
        <div className="row create-button-row">
          <button className="create-button" onClick={handleNavigate}>
            {type === "login" ? "Don't have an account?" : "Already have an account?"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Signin;
