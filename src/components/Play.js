import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/Play.css";
import share from "../icons/share.png";
import ProgressBar from "./ProgressBar";
import { useAuth } from "../utils/authContext";
import { increment } from "firebase/firestore";
import Loading from "./Loading";
import { useFirebaseContext } from "../utils/firebaseContext";
import { updateLobbyData } from "../utils/lobbyUtils";
import { updateUserData } from "../utils/userUtils";
import HomeButton from "./HomeButton";

function Play() {
  // local
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [closeGuessCounter, setCloseGuessCounter] = useState(0);

  // refs
  const inputRef = useRef(null);
  const progressBarRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  const { lobbyData, playerData, userData, lobbyId } = useFirebaseContext();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleUpdateLobbyData = async (updatedLobbyFields, updatedPlayerFields) => {
    try {
      await updateLobbyData(lobbyId, currentUser.uid, updatedLobbyFields, updatedPlayerFields);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateUserData = async (updatedFields) => {
    try {
      await updateUserData(currentUser, updatedFields);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(lobbyData);
  console.log(playerData);

  useEffect(() => {
    if (!currentUser || !lobbyData) return;
    handleUpdateUserData({ state: "playing" });
    handleUpdateLobbyData({ finishedRetryLoading: false });
  }, []);

  useEffect(() => {
    if (lobbyData?.players[currentUser.uid]?.finished) {
      navigate("/summary");
    }
  }, [lobbyData?.players[currentUser.uid]?.finished]);
  useEffect(() => {
    if (
      (lobbyData?.players[currentUser.uid]?.score ?? 0) >
      (userData?.highScores[lobbyData?.settings?.wordCount] ?? 0)
    ) {
      handleUpdateUserData({
        [`highScores.${lobbyData?.settings?.wordCount}`]:
          lobbyData?.players[currentUser.uid]?.score,
      });
      handleUpdateLobbyData(
        {},
        {
          isNewPb: true,
          [`highScores.${lobbyData?.settings?.wordCount}`]:
            lobbyData?.players[currentUser.uid]?.score,
        }
      );
    }
  }, [lobbyData?.players[currentUser.uid]?.score]);

  // handle the displayed feedback timeout
  useEffect(() => {
    if (feedback !== "") {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback("");
        feedbackTimeoutRef.current = null;
      }, 2000);
    }
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = null;
      }
    };
  }, [feedback]);

  const handleGuessSubmit = async (e) => {
    e.preventDefault();
    if (guess !== "") {
      if (guess.trim().toLowerCase() === lobbyData?.words[currentIndex]?.toLowerCase()) {
        setFeedback("correct!");
        const savedScoreAtIndex = lobbyData?.players[currentUser.uid]?.scores[currentIndex];

        if (progressBarRef.current) {
          let timeLeft = progressBarRef.current.getTimeLeft();
          handleUpdateLobbyData(
            {},
            {
              [`scores.${currentIndex}`]: (timeLeft / 100).toFixed(0) * 90 + 1000,
              [`times.${currentIndex}`]: ((10000 - timeLeft) / 100).toFixed(0),
            }
          );
          if (closeGuessCounter === 1) {
            handleUpdateLobbyData(
              {},
              {
                score: increment(-savedScoreAtIndex),
              }
            );
          }
          handleUpdateLobbyData(
            {},
            {
              score: increment((timeLeft / 100).toFixed(0) * 90 + 1000),
            }
          );
        }
        setGuess("");
        setCloseGuessCounter(0);
        handleUpdateLobbyData(
          {},
          {
            [`guesses.${currentIndex}`]: guess,
          }
        );

        if (currentIndex < lobbyData?.translation?.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          handleUpdateLobbyData(
            {
              finishCount: increment(1),
            },
            {
              finished: true,
            }
          );

          setFeedback("");
        }
      } else if (
        guess
          .trim()
          .toLowerCase()
          .includes(
            lobbyData?.words[currentIndex]?.toLowerCase().substring(0, 3),
            lobbyData?.words[currentIndex]?.toLowerCase().substring(3, 6)
          )
      ) {
        setFeedback("close!");

        if (closeGuessCounter === 0 && progressBarRef.current) {
          handleUpdateLobbyData(
            {},
            {
              [`guesses.${currentIndex}`]: guess,
            }
          );
          if (progressBarRef.current) {
            let timeLeft = progressBarRef.current.getTimeLeft();
            handleUpdateLobbyData(
              {},
              {
                [`scores.${currentIndex}`]: ((timeLeft / 100).toFixed(0) * 90 + 1000) / 2,
                [`times.${currentIndex}`]: ((10000 - timeLeft) / 100).toFixed(0),
                score: increment(((timeLeft / 100).toFixed(0) * 90 + 1000) / 2),
              }
            );
            setCloseGuessCounter(1);
          }
        }
        setGuess("");
      } else {
        setFeedback("incorrect!");
        if (closeGuessCounter === 0) {
          handleUpdateLobbyData(
            {},
            {
              [`guesses.${currentIndex}`]: guess,
            }
          );
        }
        setGuess("");
      }
    }
  };

  const handleSkip = async () => {
    if (currentIndex < lobbyData?.translation?.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setGuess("");
      setFeedback("skipped!");
      setCloseGuessCounter(0);
    } else {
      handleUpdateLobbyData(
        {
          finishCount: increment(1),
        },
        {
          finished: true,
        }
      );
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!userData || !lobbyData) {
    return <Loading />;
  }
  return (
    <div className="container">
      <div className="container page shadow">
        <div className="row align-items-center">
          <div className="col-9 col-sm-9 col-lg-10">
            <ProgressBar
              ref={progressBarRef}
              handleSkip={handleSkip}
              currentIndex={currentIndex}
              finished={lobbyData?.players[currentUser.uid]?.finished}
            />
          </div>
          <div className="col-3 col-sm-3 col-lg-2">
            <div className="progressNumber">
              {currentIndex + 1}/{lobbyData?.settings?.wordCount}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="translation">{lobbyData?.translation[currentIndex]}</div>
        </div>
        <div className="row">
          <form id="guess" onSubmit={handleGuessSubmit}>
            <input
              ref={inputRef}
              className="inputfield"
              type="text"
              value={guess}
              onChange={(e) => {
                setGuess(e.target.value);
              }}
              placeholder={feedback !== "" ? feedback : "enter here"}
              autoFocus
              maxLength={15}
            />
          </form>
        </div>
      </div>
      <div className="container">
        <div className="row buttonRow">
          <HomeButton />
          <button className="skipButton col-lg-3 col-12" onClick={handleSkip}>
            <img className="skip" src={share} alt="skip"></img>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Play;
