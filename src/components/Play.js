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
  // local states for play functionality
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [closeGuessCounter, setCloseGuessCounter] = useState(0);

  // refs
  const inputRef = useRef(null);
  const progressBarRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);
  // get data from context
  const { lobbyData, userData, lobbyId } = useFirebaseContext();
  // get the currentUser object from firebase auth
  const { currentUser } = useAuth();
  // navigate from react-router
  const navigate = useNavigate();
  // handler for updating the lobbies collection on firebase
  const handleUpdateLobbyData = async (updatedFields) => {
    try {
      await updateLobbyData(lobbyId, updatedFields);
    } catch (error) {}
  };
  // handler for updating the users collection on firebase
  const handleUpdateUserData = async (updatedFields) => {
    try {
      await updateUserData(currentUser, updatedFields);
    } catch (error) {}
  };

  useEffect(() => {
    if (!currentUser) return;
    // on mount, change the user's state to playing
    handleUpdateUserData({ state: "playing" });
    if (lobbyData) {
      // reset the finishedRetryLoading toggle in the lobby to false
      handleUpdateLobbyData({ finishedRetryLoading: false });
    }
  }, []);

  // navigate the current user to the summary page if he has finished
  useEffect(() => {
    if (!userData || !lobbyData) return;
    if (lobbyData?.players[currentUser.uid]?.finished) {
      navigate("/summary");
    }
  }, [lobbyData?.players[currentUser.uid]?.finished]);

  useEffect(() => {
    if (!userData || !lobbyData) return;
    // if the current score of the current user in the lobbies collection is greater than
    // that users highScore saved in the users collection, then update the users highScore
    // in the users and in the lobbies collection as well as the isNewPb field in lobbies
    if (
      (lobbyData?.players[currentUser.uid]?.score ?? 0) >
      (userData?.highScores[lobbyData?.settings?.wordCount] ?? 0)
    ) {
      handleUpdateUserData({
        [`highScores.${lobbyData?.settings?.wordCount}`]:
          lobbyData?.players[currentUser.uid]?.score,
      });
      handleUpdateLobbyData({
        [`players.${currentUser.uid}.isNewPb`]: true,
        [`players.${currentUser.uid}.highScores.${lobbyData?.settings?.wordCount}`]:
          lobbyData?.players[currentUser.uid]?.score,
      });
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

  // runs when the user submits the input form
  const handleGuessSubmit = async (e) => {
    e.preventDefault();
    if (guess !== "") {
      // if the guess matches the correct word exactly
      if (guess.trim().toLowerCase() === lobbyData?.words[currentIndex]?.toLowerCase()) {
        setFeedback("correct!");
        // save score at the current index
        const savedScoreAtIndex = lobbyData?.players[currentUser.uid]?.scores[currentIndex];

        if (progressBarRef.current) {
          // get the timeLeft from the progress bar component
          let timeLeft = progressBarRef.current.getTimeLeft();
          // update the scores and times at the current index with the score and time
          handleUpdateLobbyData({
            [`players.${currentUser.uid}.scores.${currentIndex}`]:
              (timeLeft / 100).toFixed(0) * 90 + 1000,
            [`players.${currentUser.uid}.times.${currentIndex}`]: (
              (10000 - timeLeft) /
              100
            ).toFixed(0),
          });
          // if there already was a close guess before the correct guess, meaning that close score was already added
          // to the score field, remove that score from the score field to avoid adding two scores, one for the close guess
          // and one for the correct guess to the score field, which would give a higher score result than intended
          if (closeGuessCounter === 1) {
            handleUpdateLobbyData({
              [`players.${currentUser.uid}.score`]: increment(-savedScoreAtIndex),
            });
          }
          // add the score of the correct guess to the score field
          handleUpdateLobbyData({
            [`players.${currentUser.uid}.score`]: increment(
              (timeLeft / 100).toFixed(0) * 90 + 1000
            ),
          });
        }
        setGuess("");
        setCloseGuessCounter(0);
        // save the guess to firebase
        handleUpdateLobbyData({
          [`players.${currentUser.uid}.guesses.${currentIndex}`]: guess,
        });
        // if there are still words left to guess, set the index to the next word
        if (currentIndex < lobbyData?.translation?.length - 1) {
          setCurrentIndex(currentIndex + 1);
          // else set the current player as finished on firebase
        } else {
          handleUpdateLobbyData({
            [`players.${currentUser.uid}.finished`]: true,
            finishCount: increment(1),
          });

          setFeedback("");
        }
        // if the guess is a close guess
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
        // update the score as above if there wasn't a close guess yet
        if (closeGuessCounter === 0 && progressBarRef.current) {
          handleUpdateLobbyData({
            [`players.${currentUser.uid}.guesses.${currentIndex}`]: guess,
          });
          if (progressBarRef.current) {
            let timeLeft = progressBarRef.current.getTimeLeft();
            handleUpdateLobbyData({
              // close guesses award half the score a correct guess would award
              [`players.${currentUser.uid}.scores.${currentIndex}`]:
                ((timeLeft / 100).toFixed(0) * 90 + 1000) / 2,
              [`players.${currentUser.uid}.times.${currentIndex}`]: (
                (10000 - timeLeft) /
                100
              ).toFixed(0),
              [`players.${currentUser.uid}.score`]: increment(
                ((timeLeft / 100).toFixed(0) * 90 + 1000) / 2
              ),
            });
            // set the close guess counter to 1 to ensure that only the first close guess,
            // which is the one that awarded the highest score, is saved
            setCloseGuessCounter(1);
          }
        }
        setGuess("");
        // if the guess was neither correct nor close
      } else {
        setFeedback("incorrect!");
        // save the guess if there isn't a close guess yet
        if (closeGuessCounter === 0) {
          handleUpdateLobbyData({
            [`players.${currentUser.uid}.guesses.${currentIndex}`]: guess,
          });
        }
        setGuess("");
      }
    }
  };
  // handler for skipping to the next word
  const handleSkip = async () => {
    // if there are still words left set index to the next word
    if (currentIndex < lobbyData?.translation?.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setGuess("");
      setFeedback("skipped!");
      setCloseGuessCounter(0);
      // else set the current player as finished on firebase
    } else {
      handleUpdateLobbyData({
        [`players.${currentUser.uid}.finished`]: true,
        finishCount: increment(1),
      });
    }
    // always focus the input field again when the word was skipped
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!userData || !lobbyData) {
    return <Loading />;
  }
  return (
    <div className="container">
      {lobbyData && userData && (
        <>
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
        </>
      )}
    </div>
  );
}

export default Play;
