import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styling/Play.css";
import home from "../icons/home.png";
import share from "../icons/share.png";
import retry from "../icons/reload.png";
import { fetchRandomWords, fetchTranslation } from "./utils";
import ProgressBar from "./ProgressBar";
import Summary from "./Summary";

function Play() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);
  const [retryWords, setRetryWords] = useState([]);
  const [retryTranslation, setRetryTranslation] = useState([]);
  const [retryLoading, setRetryLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(100);
  const [score, setScore] = useState(0);
  const [highScore3, setHighScore3] = useState(0);
  const [highScore5, setHighScore5] = useState(0);
  const [highScore10, setHighScore10] = useState(0);
  const [highScore15, setHighScore15] = useState(0);
  const [isNewPb, setIsNewPb] = useState(false);
  const [closeGuess, setCloseGuess] = useState(false);

  const { words, translation, wordCount, gamemode, sourceLang, targetLang } =
    location.state || {
      words: null,
      translation: null,
      wordCount: null,
      gamemode: null,
      sourceLang: null,
      targetLang: null,
    };
  useEffect(() => {
    setRetryWords(words);
    setRetryTranslation(translation);
    const savedHighScore3 = localStorage.getItem("highScore3");
    if (savedHighScore3) setHighScore3(parseInt(savedHighScore3));
    const savedHighScore5 = localStorage.getItem("highScore5");
    if (savedHighScore5) setHighScore5(parseInt(savedHighScore5));
    const savedHighScore10 = localStorage.getItem("highScore10");
    if (savedHighScore10) setHighScore10(parseInt(savedHighScore10));
    const savedHighScore15 = localStorage.getItem("highScore15");
    if (savedHighScore15) setHighScore15(parseInt(savedHighScore15));
  }, []);

  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          handleSkip();
          return 100;
        }
        return prevTime - 1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex, finished]);
  useEffect(() => {
    if (finished) setIsNewPb(false);
    switch (wordCount) {
      case 3:
        if (score > highScore3) {
          setHighScore3(score);
          localStorage.setItem("highScore3", score);
          setIsNewPb(true);
        }
        break;
      case 5:
        if (score > highScore5) {
          setHighScore5(score);
          localStorage.setItem("highScore5", score);
          setIsNewPb(true);
        }
        break;

      case 10:
        if (score > highScore10) {
          setHighScore10(score);
          localStorage.setItem("highScore10", score);
          setIsNewPb(true);
        }
        break;

      case 15:
        if (score > highScore15) {
          setHighScore15(score);
          localStorage.setItem("highScore15", score);
          setIsNewPb(true);
        }
        break;
    }
  }, [finished]);

  const inputRef = useRef(null);

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (
      guess.trim().toLowerCase() === retryWords[currentIndex].toLowerCase() ||
      guess.trim().toLowerCase() === words[currentIndex].toLowerCase()
    ) {
      setFeedback("Correct!");
      setScore(score + (timeLeft * 90 + 1000));
      setGuess("");
      setTimeLeft(100);

      if (
        currentIndex < retryTranslation.length - 1 ||
        currentIndex < translation.length - 1
      ) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFinished(true);
      }
    } else if (
      guess
        .trim()
        .toLowerCase()
        .includes(
          retryWords[currentIndex].toLowerCase().substring(0, 3),
          retryWords[currentIndex].toLowerCase().substring(3, 6)
        ) ||
      guess
        .trim()
        .toLowerCase()
        .includes(
          words[currentIndex].toLowerCase().substring(0, 3),
          words[currentIndex].toLowerCase().substring(3, 6)
        )
    ) {
      setFeedback("Close!");
      setCloseGuess((timeLeft * 90 + 1000) / 2);
      setGuess("");
    } else {
      setFeedback("Incorrect! Try again.");
      setGuess("");
    }
  };

  const handleSkip = () => {
    if (
      currentIndex < retryTranslation.length - 1 ||
      currentIndex < translation.length - 1
    ) {
      if (closeGuess > 0) {
        setScore(score + closeGuess);
        setCloseGuess(0);
      }
      setCurrentIndex(currentIndex + 1);
      setGuess("");
      setTimeLeft(100);
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
    setScore(0);
    setFeedback("");

    let wordsFetched = [];
    let translationFetched = [];
    try {
      wordsFetched = await fetchRandomWords(wordCount);
      setRetryWords(wordsFetched);
      translationFetched = await fetchTranslation(
        wordsFetched,
        sourceLang,
        targetLang
      );
      setRetryTranslation(translationFetched);
    } catch (error) {
      console.error("Error during the play process:", error);
    } finally {
      if (wordsFetched.length > 0 && translationFetched.length > 0) {
        setCurrentIndex(0);
        setRetryLoading(false);
        setFinished(false);
        setTimeLeft(100);
      } else {
        console.error("Failed to fetch data for play.");
      }
    }
  };
  return (
    <div className="container">
      {!finished ? (
        <>
          <div className="container page">
            <div className="row align-items-center">
              <div className="col-10 col-sm-10 col-lg-11">
                <ProgressBar timeLeft={timeLeft} />
              </div>
              <div className="col-2 col-sm-2 col-lg-1">
                <div className="progressNumber">
                  {currentIndex + 1}/{wordCount}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="translation">
                {retryTranslation[currentIndex]}
              </div>
            </div>
            <div className="row">
              <form onSubmit={handleGuessSubmit}>
                <input
                  ref={inputRef}
                  className="inputfield"
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="enter here"
                  autoFocus
                  maxLength={12}
                />
              </form>
            </div>

            <div>{feedback}</div>
          </div>
          <div className="container">
            <div className="row d-flex flex-nowrap justify-content-between">
              <button
                className="homeButton col-lg-3 col-sm-6 col-6"
                onClick={handleHome}>
                <img className="home" src={home} alt="home"></img>
              </button>
              <button
                className="skipButton col-lg-3 col-sm-6 col-6"
                onClick={handleSkip}>
                <img className="skip" src={share} alt="skip"></img>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="container page">
            <Summary
              highScore3={highScore3}
              highScore5={highScore5}
              highScore10={highScore10}
              highScore15={highScore15}
              score={score}
              wordCount={wordCount}
              isNewPb={isNewPb}
            />
          </div>
          <div className="container">
            <div className="row d-flex flex-nowrap justify-content-between">
              <button
                className="homeButton col-lg-3 col-sm-6 col-6"
                onClick={handleHome}>
                <img className="home" src={home} alt="home"></img>
              </button>
              <button
                className="retryButton col-lg-3 col-sm-6 col-6"
                onClick={handleRetry}>
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
