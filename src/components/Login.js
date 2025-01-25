import React, { useContext, useEffect, useState } from "react";
import "../styling/Login.css";
import google from "../icons/search.png";
import github from "../icons/github.png";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGithub,
  doSignInWithGoogle,
} from "../utils/authUtils";
import { useAuth } from "../utils/authContext";
import EnterUserName from "./EnterUserName";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailPlaceholder, setEmailPlaceholder] = useState("Email");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (email || (password !== "" && isError)) {
      setIsError(false);
    }
  }, [email, password]);
  useEffect(() => {
    if (isError) {
      setEmail("");
      setPassword("");
      setEmailPlaceholder("An error occurred");
    } else {
      setEmailPlaceholder("Email");
    }
  }, [isError]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        setIsError(false);
        setIsSigningIn(false);
      } catch (error) {
        console.log(error);
        setIsError(true);
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
  const handleGithubSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGithub();
        setIsSigningIn(false);
      } catch (error) {
        console.log(error);
        setIsSigningIn(false);
      }
    }
  };

  const handleNavigateSignup = () => {
    navigate("/signup");
  };

  return (
    <>
      {!userLoggedIn ? (
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
                  placeholder={emailPlaceholder}
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
      ) : (
        <EnterUserName />
      )}
    </>
  );
};
export default Login;
