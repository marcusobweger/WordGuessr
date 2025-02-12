import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../icons/wordguessr_logo1.png";
import userImage from "../icons/user.png";
import podium from "../icons/podium.png";
import "../styling/NavBar.css";
import { useAuth } from "../utils/authContext";
import { useFirebaseContext } from "../utils/firebaseContext";

const NavBar = () => {
  const { userLoggedIn, currentUser } = useAuth();
  const { userData } = useFirebaseContext();
  const location = useLocation();
  const handleCode = (e) => {
    if (userData && userData?.state !== "idle") {
      e.preventDefault();
    }
  };
  const handleHomeAndProfile = (e) => {
    if (
      userData &&
      userData?.state !== "idle" &&
      userData?.state !== "queueing" &&
      userData?.state !== "summary"
    ) {
      e.preventDefault();
    }
  };
  const handleLeaderboardAndAbout = (e) => {
    if (userData?.state === "playing") {
      e.preventDefault();
    }
  };

  return (
    <nav className="navbar">
      <div className="leftSelection ">
        <Link
          to={userData?.state === "summary" ? "/summary" : "/"}
          onClick={handleHomeAndProfile}
          className="logoLink link">
          <img src={logo} alt="Logo" className="logo" />
          <span className="title main-title">WordGuessr</span>
        </Link>
      </div>
      <div className="rightSection">
        <NavLink
          to={userLoggedIn ? "/code" : "/continue"}
          onClick={handleCode}
          className={({ isActive }) =>
            "link rightNavs" + (userLoggedIn && isActive ? " active" : "")
          }>
          <span className="enter">Enter&nbsp;</span>Code
        </NavLink>
        <NavLink
          to="/leaderboard"
          onClick={handleLeaderboardAndAbout}
          className={({ isActive }) => "link rightNavs" + (isActive ? " active" : "")}>
          <img src={podium} alt="Leaderboard" className="leaderboard" />
        </NavLink>
        <NavLink
          to="/about"
          onClick={handleLeaderboardAndAbout}
          className={({ isActive }) => "link rightNavs" + (isActive ? " active" : "")}>
          About
        </NavLink>
        <NavLink
          to={userLoggedIn ? "/profile" : "/login"}
          onClick={handleHomeAndProfile}
          className={({ isActive }) =>
            "link rightNavs" + (isActive || location.pathname === "/signup" ? " active" : "")
          }>
          <img src={userImage} alt="Profile" className="user" />
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
