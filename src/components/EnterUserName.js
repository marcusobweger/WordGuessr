import React, { useState } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged, updateProfile, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const EnterUserName = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const handleSetUserName = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      updateProfile(user, {
        displayName: userName,
      })
        .then(() => {
          console.log("Display name updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating display name:", error);
        });
      navigate("/play");
    } else {
      // User is signed out
      // ...
    }
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
