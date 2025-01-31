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
import { increment } from "firebase/firestore";
import Loading from "./Loading";
import PlayerNavBar from "./PlayerNavBar";

function Play() {
  const navigate = useNavigate();

  // local
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [closeGuessCounter, setCloseGuessCounter] = useState(0);
  const [retryLoading, setRetryLoading] = useState(false);
  // for summary page
  const [currentPlayer, setCurrentPlayer] = useState("");

  // refs
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

  useEffect(() => {
    console.log(currentUser.uid);
    setCurrentPlayer(currentUser.uid);
    console.log(currentPlayer);
  }, []);
  useEffect(() => {
    if (
      (lobbyData?.players[currentUser.uid]?.score ?? 0) >
      (userData?.highScores[lobbyData.settings.wordCount] ?? 0)
    ) {
      handleUpdateUserData({
        [`highScores.${lobbyData?.settings.wordCount}`]: lobbyData?.players[currentUser.uid]?.score,
      });
      handleUpdateLobbyData({ [`players.${currentUser.uid}.isNewPb`]: true });
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
      if (guess.trim().toLowerCase() === lobbyData.words[currentIndex]?.toLowerCase()) {
        setFeedback("correct!");
        const savedScoreAtIndex = lobbyData?.players[currentUser.uid]?.scores[currentIndex];

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
          if (closeGuessCounter === 1) {
            handleUpdateLobbyData({
              [`players.${currentUser.uid}.score`]: increment(-savedScoreAtIndex),
            });
          }
          handleUpdateLobbyData({
            [`players.${currentUser.uid}.score`]: increment(
              (timeLeft / 100).toFixed(0) * 90 + 1000
            ),
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
          handleUpdateLobbyData({
            [`players.${currentUser.uid}.finished`]: true,
            finishCount: increment(1),
          });

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
              [`players.${currentUser.uid}.score`]: increment(
                ((timeLeft / 100).toFixed(0) * 90 + 1000) / 2
              ),
            });
            setCloseGuessCounter(1);
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

  const handleSkip = async () => {
    if (currentIndex < lobbyData.translation.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setGuess("");
      setFeedback("skipped!");
      setCloseGuessCounter(0);
    } else {
      handleUpdateLobbyData({
        [`players.${currentUser.uid}.finished`]: true,
        finishCount: increment(1),
      });
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
        handleUpdateLobbyData({
          words: wordsFetched,
          translation: translationFetched,
          finishCount: 0,
          [`players.${currentUser.uid}.score`]: 0,
          [`players.${currentUser.uid}.scores`]: {},
          [`players.${currentUser.uid}.times`]: {},
          [`players.${currentUser.uid}.guesses`]: {},
          [`players.${currentUser.uid}.isNewPb`]: false,
          [`players.${currentUser.uid}.finished`]: false,
        });
      } else {
        console.error("Failed to fetch data for play.");
      }
    }
  };
  if (currentPlayer) {
    if (lobbyDataLoading || userDataLoading || !lobbyData) {
      return <Loading />;
    }
    if (
      lobbyData.finishCount !== Object.keys(lobbyData.players).length &&
      lobbyData.players[currentUser.uid].finished
    ) {
      return (
        <div className="container">
          <div className="title">Waiting for players</div>
        </div>
      );
    } else if (!lobbyData.players[currentUser.uid].finished) {
      return (
        <div className="container">
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
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="container page playerNavBar shadow">
            <PlayerNavBar lobbyData={lobbyData} setCurrentPlayer={setCurrentPlayer} />
          </div>
          <div className="container page shadow">
            <Summary lobbyData={lobbyData} userData={userData} currentPlayer={currentPlayer} />
          </div>
          <div className="container">
            <div className="row d-flex flex-nowrap justify-content-between gap-3">
              <button className="homeButton col-lg-3 col" onClick={handleHome}>
                <img className="home" src={home} alt="home"></img>
              </button>
              <button className="retryButton col-lg-3 col" onClick={handleRetry}>
                {retryLoading ? <Loading /> : <img className="retry" src={retry} alt="retry"></img>}
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Play;
