import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        <Link to="/code" className="link">
          <button className="rightNavButtons">Enter Code</button>
        </Link>
        <Link to="/leaderboard" className="link">
          <img src={podium} alt="Leaderboard" className="leaderboard" />
        </Link>
        <Link to="/about" className="link">
          <button className="rightNavButtons">About</button>
        </Link>
        <Link to={`${userLoggedIn ? "/profile" : "/login"}`} className="link">
          <img src={userImage} alt="Profile" className="user" />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
