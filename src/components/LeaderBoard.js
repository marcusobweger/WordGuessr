import React, { useEffect, useState } from "react";
import { getLeaderboardData } from "../utils/userUtils";
import { wordCounts } from "../utils/utils";

const LeaderBoard = () => {
  const [isLoading, setIsLoading] = useState();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedType, setSelectedType] = useState("highScores");
  const [selectedWordCount, setSelectedWordCount] = useState(3);
  const handleGetLeaderboardData = async () => {
    const data = await getLeaderboardData(selectedType, selectedWordCount);
    setLeaderboardData(data);
    setIsLoading(false);
  };
  useEffect(() => {
    handleGetLeaderboardData();
  }, [selectedType, selectedWordCount]);
  const WordCountButtons = () => {
    return Array.from({ length: wordCounts.length }, (_, index) => (
      <button
        key={index}
        className={`col-2 ${selectedWordCount === wordCounts[index] ? "clicked" : ""}`}
        onClick={() => setSelectedWordCount(wordCounts[index])}>
        {wordCounts[index]}
      </button>
    ));
  };
  //TODO: wip
  const LeaderboardContent = () => {
    return Array.from({ length: leaderboardData?.length }, (_, index) => (
      <div key={index} className="col-12">
        {leaderboardData[index].data().highScores.selectedWordCount}
      </div>
    ));
  };
  return (
    <div className="container">
      <div className="container page leaderboard-page">
        <div className="row">Leaderboard</div>
        <div className="row">
          <button className="col" onClick={() => setSelectedType("highScores")}>
            Highscores
          </button>
          <div className="row">
            <WordCountButtons />
          </div>
          <div className="row">
            <LeaderboardContent />
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeaderBoard;
