import React from "react"
import "../styling/About.css"
import ja from "../icons/japan.png"
import ko from "../icons/south-korea.png"
import de from "../icons/germany.png"
import it from "../icons/italy.png"
import fr from "../icons/france.png"
import es from "../icons/spain.png"
import en from "../icons/united-states.png"

export default function About() {
  // returns simple static html describing the webapp
  return (
    <div className="container justify-content-center">
      <div className="row about-title">Welcome to WordGuessr!</div>
      <div className="row about-content">
        <p className="col-12">
          The browser game for language learners and for those looking for a fun challenge!
        </p>
        <p className="col-12 col-lg-8">
          WordGuessr can be played Solo, Online in a 1vs1 setting or in a private lobby with up to 8
          people! Be the fastest to translate the words in one of the supported languages to English
          and earn the highest score to win the game.
        </p>
        <p className="col-12 col-lg-8">
          Currently supported languages: Japanese&nbsp;
          <img src={ja} alt="japanese" className="about-language-icons"></img>
          &nbsp;Korean&nbsp;
          <img src={ko} alt="korean" className="about-language-icons"></img>
          &nbsp;German&nbsp;
          <img src={de} alt="german" className="about-language-icons"></img>
          &nbsp;Italian&nbsp;
          <img src={it} alt="italian" className="about-language-icons"></img>
          &nbsp;French&nbsp;
          <img src={fr} alt="french" className="about-language-icons"></img>
          &nbsp;Spanish&nbsp;
          <img src={es} alt="spanish" className="about-language-icons"></img>
        </p>
      </div>
    </div>
  )
}
