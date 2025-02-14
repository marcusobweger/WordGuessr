import React, { useEffect, useState } from "react";
import { getLeaderboardData } from "../utils/userUtils";
import { wordCounts, types } from "../utils/utils";
import Loading from "./Loading";
import "../styling/Leaderboard.css";

const LeaderBoard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedType, setSelectedType] = useState("highScores");
  const [selectedWordCount, setSelectedWordCount] = useState(3);
  const handleGetLeaderboardData = async () => {
    setIsLoading(true);
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
        className={`playerNavBarButtons selection-buttons col ${
          selectedWordCount === wordCounts[index] ? "selected" : ""
        }`}
        onClick={() => setSelectedWordCount(wordCounts[index])}>
        {wordCounts[index]}
      </button>
    ));
  };
  const TypeButtons = () => {
    return Array.from({ length: types.length }, (_, index) => (
      <button
        key={index}
        className={`playerNavBarButtons selection-buttons col ${
          selectedType === types[index] ? "selected" : ""
        }`}
        onClick={() => setSelectedType(types[index])}>
        {types[index] === "highScores" ? "Scores" : "Wins"}
      </button>
    ));
  };
  //TODO: wip
  const LeaderboardContent = () => {
    return (
      <table className="table-container">
        <thead>
          <tr className="header-row">
            <th scope="col">Rank</th>
            <th scope="col">Name</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>
          {!isLoading ? (
            <>
              {Array.from({ length: leaderboardData?.length }, (_, index) => (
                <tr key={index}>
                  <td scope="row">{index + 1}</td>
                  <td>{leaderboardData[index]?.data()?.name}</td>
                  <td>{leaderboardData[index]?.data()?.highScores[selectedWordCount]}</td>
                </tr>
              ))}
            </>
          ) : (
            <tr>
              <td></td>
              <td>
                <Loading />
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };
  return (
    <div className="container">
      <div className="container leaderboard-page">
        <div className="row leaderboard-title-row">Leaderboard</div>
        <div className="row playerNavBarRow">
          <TypeButtons />
        </div>
        <div className="row playerNavBarRow">
          <WordCountButtons />
        </div>
        <div className="row page">
          <LeaderboardContent />
        </div>
      </div>
    </div>
  );
};
export default LeaderBoard;
