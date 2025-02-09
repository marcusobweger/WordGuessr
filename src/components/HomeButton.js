import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import home from "../icons/home.png";

const HomeButton = () => {
  const [leave, setLeave] = useState(false);
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/");
  };
  return (
    <>
      {!leave ? (
        <button className="homeButton col-lg-3 col-12" onClick={() => setLeave(true)}>
          <img className="home" src={home} alt="home"></img>
        </button>
      ) : (
        <>
          <button className="cancelButton col col-lg-2" onClick={() => setLeave(false)}>
            Cancel
          </button>
          <button className="leaveButton col col-lg-2" onClick={handleHome}>
            Leave
          </button>
        </>
      )}
    </>
  );
};
export default HomeButton;
