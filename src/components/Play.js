import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styling/Play.css";
import home from "../icons/home.png";
import share from "../icons/share.png";
import retry from "../icons/reload.png";
import { fetchRandomWords, fetchTranslation } from "./utils";

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
  }, []);

  const inputRef = useRef(null);

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (guess.trim().toLowerCase() === retryWords[currentIndex].toLowerCase()) {
      setFeedback("Correct!");
      setGuess("");

      if (currentIndex < retryTranslation.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFinished(true);
      }
    } else {
      setFeedback("Incorrect! Try again.");
      setGuess("");
    }
  };

  const handleSkip = () => {
    if (currentIndex < retryTranslation.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setGuess("");
    } else {
      setFinished(true);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const handleHome = () => {
    setTimeout(() => {
      navigate("/");
    }, 100);
  };
  const handleRetry = async () => {
    setRetryLoading(true);

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
            <div className="row">
              <div className="progressNumber">
                {currentIndex + 1}/{wordCount}
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
            {/*
            <div>{feedback}</div>
            */}
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
        <div className="container">
          <h1>Summary</h1>
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
      )}
    </div>
  );
}
export default Play;
