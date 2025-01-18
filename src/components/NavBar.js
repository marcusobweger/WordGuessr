import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../icons/wordguessr_logo1.png";
import "../styling/NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="navbar">
      <div className="leftSelection">
        <Link to="/" className="logoLink">
          <img
            src={logo} // Replace with your logo URL
            alt="Logo"
            className="logo"
          />
          <span className="title">WordGuessr</span>
        </Link>
      </div>
      <div className="rightSection">
        <Link to="/login">
          <button className="loginButton">login</button>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
