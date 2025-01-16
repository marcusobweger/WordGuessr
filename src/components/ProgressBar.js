import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const ProgressBar = forwardRef(
  ({ handleSkip, currentIndex, finished }, ref) => {
    const [timeLeft, setTimeLeft] = useState(10000);
    const timerRef = useRef(null);
    const endTimeRef = useRef(null);

    endTimeRef.current = Date.now() + timeLeft;

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

    useEffect(() => {
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }, []);
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
  }
);
export default ProgressBar;
