import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { updateUserData } from "../utils/userUtils";
import { useAuth } from "../utils/authContext";

const EnterUserName = () => {
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const handleSetUserName = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await updateUserData(currentUser, { name: userName });
    setIsLoading(false);
    navigate("/");
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="container">
      <div className="container page">
        <div className="row">
          <form id="username" onSubmit={handleSetUserName} className="col">
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
