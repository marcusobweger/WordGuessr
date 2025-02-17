import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { updateUserData } from "../utils/userUtils";
import { useAuth } from "../utils/authContext";
import { useFirebaseContext } from "../utils/firebaseContext";

const EnterUserName = () => {
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { userData } = useFirebaseContext() || null;
  useEffect(() => {
    if (!currentUser) return;
  }, []);
  useEffect(() => {
    if (userData) {
      setUserName(userData.name);
    }
  }, [userData]);
  const handleSetUserName = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await updateUserData(currentUser, { name: userName });
    setIsLoading(false);
    navigate("/");
  };
  if (!currentUser) {
    return <Loading />;
  }
  return (
    <div className="container">
      <div className="container page code-page">
        <div className="row justify-content-center">
          {userData ? "Edit username" : "Enter username"}
        </div>
        <div className="row">
          <form id="username" onSubmit={handleSetUserName} className="col">
            <input
              className="inputfield code-inputfield"
              type="text"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              autoFocus
              maxLength={10}
            />
          </form>
        </div>
        <div className="loader">{isLoading && <Loading />}</div>
      </div>
    </div>
  );
};
export default EnterUserName;
