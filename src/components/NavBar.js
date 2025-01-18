import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../icons/wordguessr_logo1.png";
import user from "../icons/user.png";
import "../styling/NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();

  const [isUser, setIsUser] = useState(false);

  return (
    <nav className="navbar">
      <div className="leftSelection">
        <Link to="/" className="logoLink link">
          <img src={logo} alt="Logo" className="logo" />
          <span className="title">WordGuessr</span>
        </Link>
      </div>
      <div className="rightSection">
        <Link to="/leaderboard" className="link">
          <button className="rightNavButtons">Leaderboard</button>
        </Link>
        <Link to="/about" className="link">
          <button className="rightNavButtons">About</button>
        </Link>
        <Link to={`${isUser ? "/profile" : "/login"}`} className="link">
          <img src={user} alt="Profile" className="user" />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
