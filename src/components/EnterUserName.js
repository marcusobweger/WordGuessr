import React, { useState } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const EnterUserName = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const handleSetUserName = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.displayName = userName;
        navigate("/play");
      } else {
        // User is signed out
        // ...
      }
    });
  };
  return (
    <div className="container page">
      <div className="row">
        <form onSubmit={handleSetUserName} className="col">
          <input
            className="inputfield code-inputfield row"
            type="text"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            placeholder="username"
            autoFocus
            maxLength={20}
          />
        </form>
      </div>
    </div>
  );
};
export default EnterUserName;
