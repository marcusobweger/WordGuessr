import React, { useEffect, useState } from "react";
import { useFirebaseContext } from "../utils/firebaseContext";
import { useAuth } from "../utils/authContext";
import { joinLobbyWithCode } from "../utils/lobbyUtils";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const EnterCode = () => {
  const [code, setCode] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("Enter lobby code");
  const { userData, setLobbyId } = useFirebaseContext();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsError(false);
    setFeedback("Enter lobby code");
    if (code !== "") {
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
      const lobbyFound = await joinLobbyWithCode(code, setLobbyId, currentUser, userData);
      setIsLoading(false);
      if (lobbyFound) {
        navigate("/lobby");
      } else {
        setIsError(true);
        setFeedback("Lobby not found!");
        console.log("lobby not found try again");
      }
    } catch (error) {
      console.log(error);
    }
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
