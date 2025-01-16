import React, { useState, useEffect, useRef } from "react";

export default function CountdownTimer({ onComplete }) {
  const [state, setState] = useState("test");
  const handleSkip = () => {
    setState("skippedState");
  };
  return (
    <div>
      <h1>some text</h1>
      {state}
      <Timer state={state} setState={setState} handleSkip={handleSkip} />
    </div>
  );
}
const Timer = ({ state, setState, handleSkip }) => {
  const [timeLeft, setTimeLeft] = useState(10000); // Initial time in milliseconds (10 seconds)
  const timerRef = useRef(null); // For the interval
  const endTimeRef = useRef(null); // To store the precise end time

  const startCountdown = () => {
    // Calculate when the countdown should end
    endTimeRef.current = Date.now() + timeLeft;

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start a new timer
    timerRef.current = setInterval(() => {
      const newTimeLeft = Math.max(0, endTimeRef.current - Date.now());

      setTimeLeft(newTimeLeft);

      if (newTimeLeft === 0) {
        clearInterval(timerRef.current);
        console.log("complete");
        handleSkip();
      }
    }, 1); // Update every millisecond
  };

  // Cleanup the interval on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format timeLeft to show seconds and milliseconds
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const ms = milliseconds % 1000;
    return `${seconds}.${ms.toString().padStart(3, "0")}s`;
  };

  return (
    <div>
      <h1>Time Left: {formatTime(timeLeft)}</h1>
      <button onClick={startCountdown}>Start Timer</button>
    </div>
  );
};
