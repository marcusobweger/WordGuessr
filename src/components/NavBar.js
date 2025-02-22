import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../icons/wordguessr_logo1.png";
import userImage from "../icons/user.png";
import podium from "../icons/podium.png";
import "../styling/NavBar.css";
import { useAuth } from "../utils/authContext";
import { useFirebaseContext } from "../utils/firebaseContext";

const NavBar = () => {
  // get the userLoggedIn boolean from firebase auth
  const { userLoggedIn } = useAuth();
  // get the userData from the context
  const { userData } = useFirebaseContext();
  // location from react-router to know what the current URL is
  const location = useLocation();
  // disable enter code route if the user's state is anything but idle
  // to prevent entering a lobby code if the user is already in a lobby or in game
  const handleCode = (e) => {
    if (userData && userData?.state !== "idle") {
      e.preventDefault();
    }
  };
  // disable home and profile page route if the user is in game or in a lobby
  // to make sure that the user uses the provided home button and the lobby deletion is properly handled
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
  // disable leaderboard and about route if the user's state is playing
  const handleLeaderboardAndAbout = (e) => {
    if (userData?.state === "playing") {
      e.preventDefault();
    }
  };
  return (
    <nav className="navbar">
      <div className="leftSelection ">
        <Link
          // link to the summary page if the user's state is summary else link to the home page
          to={userData?.state === "summary" ? "/summary" : "/"}
          onClick={handleHomeAndProfile}
          className="logoLink link">
          <img src={logo} alt="Logo" className="logo" />
          <span className="title main-title">WordGuessr</span>
        </Link>
      </div>
      <div className="rightSection">
        <NavLink
          // if the user is not logged in link to continue where he can log in first, else link to the code page
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
          // if the user is logged in link to the user's profile, else link to the login page
          to={userLoggedIn ? "/profile" : "/login"}
          onClick={handleHomeAndProfile}
          className={({ isActive }) =>
            // add the active className if the location is login OR signup, since only login is declared in the to={} property
            "link rightNavs" + (isActive || location.pathname === "/signup" ? " active" : "")
          }>
          <img src={userImage} alt="Profile" className="user" />
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
