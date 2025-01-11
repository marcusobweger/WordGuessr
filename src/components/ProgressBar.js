const ProgressBar = ({ timeLeft }) => {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label="Basic example"
      aria-valuenow={timeLeft}
      aria-valuemin="0"
      aria-valuemax="100">
      <div
        className="progress-bar"
        style={{
          width: `${timeLeft}%`,
          backgroundColor: "rgb(43, 226, 83)",
        }}></div>
    </div>
  );
};
export default ProgressBar;
