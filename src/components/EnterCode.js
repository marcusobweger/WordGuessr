import React, { useEffect, useState } from "react";
import { useFirebaseContext } from "../utils/firebaseContext";
import { useAuth } from "../utils/authContext";
import { joinLobbyWithCode } from "../utils/lobbyUtils";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const EnterCode = () => {
  const [code, setCode] = useState("");
  const [isError, setIsError] = useState(false);
  const { userData, setLobbyId } = useFirebaseContext();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsError(false);
    if (code !== "") {
      const typing = setTimeout(() => {
        handleJoinWithCode();
      }, 1500);
      return () => clearTimeout(typing);
    }
  }, [code]);
  const handleJoinWithCode = async () => {
    try {
      const lobbyFound = await joinLobbyWithCode(code, setLobbyId, currentUser, userData);
      if (lobbyFound) {
        navigate("/lobby");
      } else {
        setIsError(true);
        console.log("lobby not found try again");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="container page">
        <div className="row">
          <form onSubmit={(e) => e.preventDefault()} id="code" className="col">
            <input
              className={`inputfield code-inputfield ${isError ? "error errorValue" : ""}`}
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
              placeholder="enter code"
              autoFocus
              maxLength={20}
              spellCheck={false}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
export default EnterCode;
