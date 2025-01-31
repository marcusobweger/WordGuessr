import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../icons/wordguessr_logo1.png";
import userImage from "../icons/user.png";
import podium from "../icons/podium.png";
import "../styling/NavBar.css";
import { useAuth } from "../utils/authContext";

const NavBar = () => {
  const { userLoggedIn } = useAuth();

  return (
    <nav className="navbar">
      <div className="leftSelection">
        <Link to="/" className="logoLink link">
          <img src={logo} alt="Logo" className="logo" />
          <span className="title">WordGuessr</span>
        </Link>
      </div>
      <div className="rightSection">
        <NavLink
          to="/code"
          className={({ isActive }) => "link rightNavs" + (isActive ? " active" : "")}>
          Enter Code
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
