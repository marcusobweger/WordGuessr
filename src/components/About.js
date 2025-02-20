import React from "react";
import "../styling/About.css";
// exports the About component
export default function About() {
  // returns simple static html describing the webapp
  return (
    <div className="container">
      <div className="row about-title">Welcome to WordGuessr!</div>
      <div className="about-content">
        Play Solo, Online or with your Friends to see who has the best language-skills!
      </div>
    </div>
  );
}
