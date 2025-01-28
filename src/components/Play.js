import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styling/Play.css";
import home from "../icons/home.png";
import share from "../icons/share.png";
import retry from "../icons/reload.png";
import { fetchRandomWords, fetchTranslation } from "../utils/utils";
import ProgressBar from "./ProgressBar";
import Summary from "./Summary";
import useLobbyListener from "../utils/useLobbyListener";
import { useAuth } from "../utils/authContext";
import useUserListener from "../utils/useUserListener";
import useLobbyActions from "../utils/useLobbyActions";
import useUserActions from "../utils/useUserActions";

function Play() {
  const navigate = useNavigate();

  //local
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [closeGuessCounter, setCloseGuessCounter] = useState(0);

  //lobby
  const [finished, setFinished] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);

  const inputRef = useRef(null);
  const progressBarRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  const { lobbyData, lobbyDataLoading } = useLobbyListener();
  const { userData, userDataLoading } = useUserListener();
  const { currentUser } = useAuth();
  const { updateLobbyData } = useLobbyActions();
  const { updateUserData } = useUserActions();

  const handleUpdateLobbyData = async (updatedFields) => {
    try {
      await updateLobbyData(updatedFields);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateUserData = async (updatedFields) => {
    try {
      await updateUserData(updatedFields);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(lobbyData);
  const handleFinished = () => {
    handleUpdateLobbyData({
      [`players.${currentUser.uid}.finished`]: finished,
    });
    if (finished) {
      let scoreSum = 0;

      Object.values(lobbyData.players[currentUser.uid]?.scores).forEach((myScore) => {
        scoreSum += myScore;
      });
      handleUpdateLobbyData({ [`players.${currentUser.uid}.score`]: scoreSum });

      if (scoreSum > userData.highScores[lobbyData.settings.wordCount]) {
        handleUpdateUserData({ [`highScores.${lobbyData.settings.wordCount}`]: scoreSum });
        handleUpdateLobbyData({ [`players.${currentUser.uid}.isNewPb`]: true });
      }
    }
  };
  useEffect(() => {
    handleFinished();
  }, [finished]);

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

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (guess !== "") {
      if (guess.trim().toLowerCase() === lobbyData.words[currentIndex]?.toLowerCase()) {
        setFeedback("correct!");

        if (progressBarRef.current) {
          let timeLeft = progressBarRef.current.getTimeLeft();
          handleUpdateLobbyData({
            [`players.${currentUser.uid}.scores.${currentIndex}`]:
              (timeLeft / 100).toFixed(0) * 90 + 1000,
            [`players.${currentUser.uid}.times.${currentIndex}`]: (
              (10000 - timeLeft) /
              100
            ).toFixed(0),
          });
        }
        setGuess("");
        setCloseGuessCounter(0);
        handleUpdateLobbyData({
          [`players.${currentUser.uid}.guesses.${currentIndex}`]: guess,
        });

        if (currentIndex < lobbyData.translation?.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setFinished(true);
          setFeedback("");
        }
      } else if (
        guess
          .trim()
          .toLowerCase()
          .includes(
            lobbyData.words[currentIndex]?.toLowerCase().substring(0, 3),
            lobbyData.words[currentIndex]?.toLowerCase().substring(3, 6)
          )
      ) {
        setFeedback("close!");

        if (closeGuessCounter === 0 && progressBarRef.current) {
          handleUpdateLobbyData({
            [`players.${currentUser.uid}.guesses.${currentIndex}`]: guess,
          });
          if (progressBarRef.current) {
            let timeLeft = progressBarRef.current.getTimeLeft();
            handleUpdateLobbyData({
              [`players.${currentUser.uid}.scores.${currentIndex}`]:
                ((timeLeft / 100).toFixed(0) * 90 + 1000) / 2,
              [`players.${currentUser.uid}.times.${currentIndex}`]: (
                (10000 - timeLeft) /
                100
              ).toFixed(0),
            });
            setCloseGuessCounter(closeGuessCounter + 1);
          }
        }
        setGuess("");
      } else {
        setFeedback("incorrect!");
        if (closeGuessCounter === 0) {
          handleUpdateLobbyData({
            [`players.${currentUser.uid}.guesses.${currentIndex}`]: guess,
          });
        }
        setGuess("");
      }
    }
  };

  const handleSkip = () => {
    if (currentIndex < lobbyData.translation.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setGuess("");
      setFeedback("skipped!");
      setCloseGuessCounter(0);
    } else {
      setFinished(true);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const handleHome = () => {
    navigate("/");
  };
  const handleRetry = async () => {
    setRetryLoading(true);
    setCloseGuessCounter(0);
    setFeedback("");
    setGuess("");
    handleUpdateLobbyData({
      [`players.${currentUser.uid}.score`]: 0,
      [`players.${currentUser.uid}.scores`]: Array(lobbyData.settings.wordCount).fill(0),
      [`players.${currentUser.uid}.times`]: Array(lobbyData.settings.wordCount).fill(0),
      [`players.${currentUser.uid}.guesses`]: Array(lobbyData.settings.wordCount).fill(0),
      [`players.${currentUser.uid}.isNewPb`]: false,
    });
    let wordsFetched = [];
    let translationFetched = [];
    try {
      wordsFetched = await fetchRandomWords(lobbyData.settings.wordCount);
      translationFetched = await fetchTranslation(
        wordsFetched,
        lobbyData.settings.sourceLang,
        lobbyData.settings.targetLang
      );
    } catch (error) {
      console.error("Error during the play process:", error);
    } finally {
      if (wordsFetched.length > 0 && translationFetched.length > 0) {
        setCurrentIndex(0);
        setRetryLoading(false);
        setFinished(false);
        handleUpdateLobbyData({
          [`players.${currentUser.uid}.finished`]: false,
          words: wordsFetched,
          translation: translationFetched,
        });
      } else {
        console.error("Failed to fetch data for play.");
      }
    }
  };
  if (lobbyDataLoading || userDataLoading || !lobbyData) {
    return (
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }
  return (
    <div className="container">
      {!lobbyData.players[currentUser.uid]?.finished ? (
        <>
          <div className="container page shadow">
            <div className="row align-items-center">
              <div className="col-9 col-sm-9 col-lg-10">
                <ProgressBar
                  ref={progressBarRef}
                  handleSkip={handleSkip}
                  currentIndex={currentIndex}
                  finished={lobbyData.players[currentUser.uid]?.finished}
                />
              </div>
              <div className="col-3 col-sm-3 col-lg-2">
                <div className="progressNumber">
                  {currentIndex + 1}/{lobbyData.settings.wordCount}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="translation">{lobbyData.translation[currentIndex]}</div>
            </div>
            <div className="row">
              <form onSubmit={handleGuessSubmit}>
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
            <div className="row d-flex flex-nowrap justify-content-between gap-3">
              <button className="homeButton col-lg-3 col" onClick={handleHome}>
                <img className="home" src={home} alt="home"></img>
              </button>
              <button className="skipButton col-lg-3 col" onClick={handleSkip}>
                <img className="skip" src={share} alt="skip"></img>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="container page shadow">
            <Summary lobbyData={lobbyData} userData={userData} currentUser={currentUser} />
          </div>

          <div className="container">
            <div className="row d-flex flex-nowrap justify-content-between gap-3">
              <button className="homeButton col-lg-3 col" onClick={handleHome}>
                <img className="home" src={home} alt="home"></img>
              </button>
              <button className="retryButton col-lg-3 col" onClick={handleRetry}>
                {retryLoading ? (
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <img className="retry" src={retry} alt="retry"></img>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Play;
