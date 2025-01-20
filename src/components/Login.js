import React, { useContext, useEffect, useState } from "react";
import "../styling/Login.css";
import google from "../icons/search.png";
import github from "../icons/github.png";
import apple from "../icons/apple-logo.png";
import { getAuth } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="container col-md-6 col-xl-4">
      <div className="container page">
        <div className="row">
          <div className="col login-text">Welcome!</div>
        </div>
        <div className="row buttonGaps sign-in-button-row">
          <button className=" col sign-in-buttons">
            <img src={google} alt="Sign in with Google" className="sign-in-icons"></img>
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
          <form onSubmit={console.log("submitted")} className="col">
            <input
              className="inputfield login-inputfield"
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
              className="inputfield login-inputfield passwordField"
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
              maxLength={25}
            />
          </form>
        </div>

        <div className="row ">
          <button type="submit" className="col submit-button">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
