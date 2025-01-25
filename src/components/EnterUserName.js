import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserActions from "../utils/useUserActions";

const EnterUserName = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { createNewUser } = useUserActions();
  const handleSetUserName = async (e) => {
    e.preventDefault();
    await createNewUser(userName);
    navigate("/");
  };

  return (
    <div className="container">
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
    </div>
  );
};
export default EnterUserName;
