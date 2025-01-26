import React, { useContext, useEffect, useState } from "react";
import "../styling/Login.css";
import google from "../icons/search.png";
import github from "../icons/github.png";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
  doSignInWithGithub,
} from "../utils/authUtils";
import { useAuth } from "../utils/authContext";
import EnterUserName from "./EnterUserName";
import { useNavigate } from "react-router-dom";
import useUserActions from "../utils/useUserActions";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isError, setIsError] = useState(false);
  const { userLoggedIn } = useAuth();
  const { getCurrentUserData } = useUserActions();
  const navigate = useNavigate();

  useEffect(() => {
    if ((email || password !== "") && isError) {
      setIsError(false);
    }
  }, [email, password]);

  const handleEmailCreate = async (e) => {
    e.preventDefault();
    if (!isCreating) {
      setIsCreating(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
        setIsError(false);
        setIsCreating(false);
      } catch (error) {
        console.log(error);
        setIsError(true);
        setEmail("");
        setPassword("");
        setIsCreating(false);
      }
    }
  };
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isCreating) {
      setIsCreating(true);
      try {
        await doSignInWithGoogle();
        setIsCreating(false);
      } catch (error) {
        console.log(error);
        setIsCreating(false);
      }
    }
  };
  const handleGithubSignIn = async (e) => {
    e.preventDefault();
    if (!isCreating) {
      setIsCreating(true);
      try {
        await doSignInWithGithub();
        setIsCreating(false);
      } catch (error) {
        console.log(error);
        setIsCreating(false);
      }
    }
  };
  const handleCheckForUserName = async () => {
    const userData = await getCurrentUserData();
    if (userData.name) {
      return true;
    }
    return false;
  };
  const handleNavigateLogin = () => {
    navigate("/login");
  };
  const SignupContent = () => {
    if (!userLoggedIn) {
      return (
        <div className="container col-md-6 col-xl-4">
          <div className="container page shadow">
            <div className="row">
              <div className="col login-text">Welcome!</div>
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
            <div className="row">
              <form onSubmit={handleEmailCreate} className="col">
                <input
                  className={`${isError ? "error" : ""} inputfield login-inputfield row`}
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
            <button className="row create-button" onClick={handleNavigateLogin}>
              Already have an account?
            </button>
          </div>
        </div>
      );
    } else {
      if (handleCheckForUserName()) {
        navigate("/");
      } else {
        return <EnterUserName />;
      }
    }
  };
  return <SignupContent />;
}
export default Signup;
