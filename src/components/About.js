import React from "react";
import "../styling/About.css";

export default function About() {
  // returns simple static html describing the webapp
  return (
    <div className="container justify-content-center">
      <div className="row about-title">Welcome to WordGuessr!</div>
      <div className="row about-content">
        <p className="col-12">
          The browser game for language learners and for those looking for a fun challenge!
        </p>
        <p className="col-12 about-info-content">
          WordGuessr can be played Solo, Online in a 1vs1 setting or in a private lobby with up to 8
          people! Be the fastest to translate the words in one of the supported languages to English
          and earn the highest score to win the game. Currently supported languages: Japanese🇯🇵
          Korean🇰🇷 German 🇩🇪 Italian🇮🇹 French🇫🇷 Spanish🇪🇸
        </p>
      </div>
    </div>
  );
}
