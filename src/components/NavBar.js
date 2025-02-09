import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../icons/wordguessr_logo1.png";
import userImage from "../icons/user.png";
import podium from "../icons/podium.png";
import "../styling/NavBar.css";
import { useAuth } from "../utils/authContext";
import { useFirebaseContext } from "../utils/firebaseContext";

const NavBar = () => {
  const { userLoggedIn } = useAuth();
  const { userData } = useFirebaseContext();

  return (
    <nav className="navbar">
      <div className="leftSelection ">
        <Link
          to={
            userData?.state === "playing"
              ? "/play"
              : userData?.state === "summary"
              ? "/summary"
              : userData?.state === "lobby"
              ? "/lobby"
              : "/"
          }
          className="logoLink link">
          <img src={logo} alt="Logo" className="logo" />
          <span className="title main-title">WordGuessr</span>
        </Link>
      </div>
      <div className="rightSection">
        <NavLink
          to={`${userLoggedIn ? "/code" : "/continue"}`}
          className={({ isActive }) =>
            "link rightNavs" + (isActive && userLoggedIn ? " active" : "")
          }>
          <span className="enter">Enter</span>&nbsp;Code
        </NavLink>
        <NavLink
          to="/leaderboard"
          className={({ isActive }) => "link rightNavs" + (isActive ? " active" : "")}>
          <img src={podium} alt="Leaderboard" className="leaderboard" />
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => "link rightNavs" + (isActive ? " active" : "")}>
          About
        </NavLink>
        <NavLink to={`${userLoggedIn ? "/profile" : "/login"}`} className="link rightNavs">
          <img src={userImage} alt="Profile" className="user" />
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
