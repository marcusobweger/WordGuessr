import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
// the progress bar displaying the time at the top of the play page
const ProgressBar = forwardRef(({ handleSkip, currentIndex, finished }, ref) => {
  // the time for each word is 10 seconds
  const [timeLeft, setTimeLeft] = useState(10000);
  const timerRef = useRef(null);
  const endTimeRef = useRef(null);

  endTimeRef.current = Date.now() + timeLeft;

  // handle the time functionality
  useEffect(() => {
    setTimeLeft(10000);
    if (finished) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      const newTimeLeft = Math.max(0, endTimeRef.current - Date.now());

      setTimeLeft(newTimeLeft);

      if (newTimeLeft === 0) {
        clearInterval(timerRef.current);
        handleSkip();
      }
    }, 1);
  }, [currentIndex, finished]);

  // clear the previous interval if the component is newly mounted on word switch
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  // expose getTimeLeft to get the current timeLeft from progress bar in other components
  useImperativeHandle(ref, () => ({
    getTimeLeft: () => timeLeft,
  }));

  return (
    <div
      className="progress"
      role="progressbar"
      aria-label="Basic example"
      aria-valuenow={timeLeft}
      aria-valuemin="0"
      aria-valuemax="10000">
      <div
        className="progress-bar"
        style={{
          width: `${timeLeft / 100}%`,
          backgroundColor: "rgb(43, 226, 83)",
          transition: "width ease",
        }}></div>
    </div>
  );
});
export default ProgressBar;
