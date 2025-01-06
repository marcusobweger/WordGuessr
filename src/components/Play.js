import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styling/Play.css";
import logo from "../icons/wordguessr_logo1.png";
import home from "../icons/home.png";
import share from "../icons/share.png";

function Play() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);

  const { words, translation, wordCount } = location.state || {
    words: [],
    translation: [],
    wordCount: 0,
  };

  const inputRef = useRef(null);

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (guess.trim().toLowerCase() === words[currentIndex].toLowerCase()) {
      setFeedback("Correct!");
      setGuess("");

      if (currentIndex < translation.length - 1) {
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
    if (currentIndex < translation.length - 1) {
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
  return (
    <div className="container">
      <div className="header-container">
        <img className="logo" src={logo} alt="logo"></img>
        <h1 className="title">WordGuessr</h1>
      </div>
      <div className="container page">
        {!finished ? (
          <>
            <div className="row">
              <div className="progressNumber">
                {currentIndex + 1}/{wordCount}
              </div>
            </div>
            <div className="row">
              <div className="translation">{translation[currentIndex]}</div>
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
            <p>{feedback}</p>
            <p>{words[currentIndex]}</p>
            */}
          </>
        ) : (
          <div>
            <p>Game Over! Well done!</p>
            {/*
            <>{navigate("/summary", { state: "" })}</>
            */}
          </div>
        )}
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
    </div>
  );
}
export default Play;
