import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { updateUserData } from "../utils/userUtils";
import { useAuth } from "../utils/authContext";
import { useFirebaseContext } from "../utils/firebaseContext";

const EnterUserName = () => {
  // state for storing the username the user inputs
  const [userName, setUserName] = useState("");
  // loading state
  const [isLoading, setIsLoading] = useState(false);
  // navigate from react-router
  const navigate = useNavigate();
  // get the currentUser object from firebase auth
  const { currentUser } = useAuth();
  // get the userData from context, can be null if the user is not logged in yet
  const { userData } = useFirebaseContext() || null;
  // do nothing if the user is not signed in
  useEffect(() => {
    if (!currentUser) return;
  }, []);
  // as soon as the userData updates, set the userName to the name saved on the database
  useEffect(() => {
    if (userData) {
      setUserName(userData.name);
    }
  }, [userData]);
  // handles userName updates
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
