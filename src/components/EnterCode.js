import React, { useEffect, useState } from "react";
import { useFirebaseContext } from "../utils/firebaseContext";
import { useAuth } from "../utils/authContext";
import { joinLobbyWithCode } from "../utils/lobbyUtils";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const EnterCode = () => {
  // the code the user types or pastes into the input field
  const [code, setCode] = useState("");
  // error and loading state
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // state to change the page heading to display feedback based on if an error occurred
  const [feedback, setFeedback] = useState("Enter lobby code");
  // get the userData and the setLobbyId setter from context
  const { userData, setLobbyId } = useFirebaseContext();
  // get the currentUser object from firebase auth
  const { currentUser } = useAuth();
  // navigate from react-router
  const navigate = useNavigate();

  useEffect(() => {
    setIsError(false);
    setFeedback("Enter lobby code");
    if (code !== "") {
      // check if the lobby exists and join the lobby if the lobbyId length
      // which is generated on firebase of 20 characters is met
      if (code.length === 20) {
        handleJoinWithCode();
        setIsLoading(true);
      }
    } else {
      setIsLoading(false);
    }
  }, [code]);
  const handleJoinWithCode = async () => {
    try {
      // check if the lobby with the provided lobbyId exists, then navigate to /lobby else show an error
      const lobbyFound = await joinLobbyWithCode(code, setLobbyId, currentUser, userData);
      setIsLoading(false);
      if (lobbyFound) {
        navigate("/lobby");
      } else {
        setIsError(true);
        setFeedback("Lobby not found!");
      }
    } catch (error) {}
  };

  return (
    <div className="container">
      <div className="container page code-page">
        <div className="row code-title-row">{feedback}</div>
        <div className="row">
          <form onSubmit={(e) => e.preventDefault()} id="code" className="col">
            <input
              className={`inputfield code-inputfield ${isError ? "error errorValue" : ""}`}
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
              autoFocus
              maxLength={20}
              spellCheck={false}
            />
          </form>
        </div>
        <div className="loader">{isLoading && <Loading />}</div>
      </div>
    </div>
  );
};
export default EnterCode;
