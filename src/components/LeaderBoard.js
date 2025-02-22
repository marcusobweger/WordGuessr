import React, { useEffect, useState } from "react";
import { getLeaderboardData } from "../utils/userUtils";
import { wordCounts, types, gamemodes } from "../utils/utils";
import Loading from "./Loading";
import "../styling/Leaderboard.css";

const LeaderBoard = () => {
  // loading state
  const [isLoading, setIsLoading] = useState(true);
  // the data displayed on the leaderboard which is fetched from the database
  const [leaderboardData, setLeaderboardData] = useState([]);
  // states for setting which data to fetch from the database and in what order
  const [selectedType, setSelectedType] = useState("highScores");
  const [selectedWordCount, setSelectedWordCount] = useState(3);
  const [selectedGamemode, setSelectedGamemode] = useState(0);
  // handler for fetching the data
  const handleGetLeaderboardData = async () => {
    setIsLoading(true);
    // see userUtils.js since it fetches from the users collection on firebase
    const data = await getLeaderboardData(selectedType, selectedWordCount, selectedGamemode);
    setLeaderboardData(data);
    setIsLoading(false);
  };
  // fetch up-to-date data on mount and everytime a different setting is selected
  useEffect(() => {
    handleGetLeaderboardData();
  }, [selectedType, selectedWordCount, selectedGamemode]);
  // generates the buttons for selecting the wordCount
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
  // generates the buttons for selecting the type
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
  // generates the buttons for selecting the gamemode
  const GamemodeButtons = () => {
    return Array.from({ length: gamemodes.length }, (_, index) => (
      <button
        key={index}
        className={`playerNavBarButtons selection-buttons col ${
          selectedGamemode === gamemodes[index] ? "selected" : ""
        }`}
        onClick={() => setSelectedGamemode(gamemodes[index])}
        disabled={selectedType === "highScores"}>
        {gamemodes[index] === 0 ? "Solo" : gamemodes[index] === 1 ? "Online" : "Private"}
      </button>
    ));
  };
  // displays the table on the leaderboard page which displayed the top 50 users in the selected category
  const LeaderboardContent = () => {
    return (
      <table className="table-container">
        <thead>
          <tr className="header-row">
            <th scope="col">Rank</th>
            <th scope="col">Name</th>
            <th scope="col">{selectedType === "highScores" ? "Score" : "Wins"}</th>
          </tr>
        </thead>
        <tbody>
          {!isLoading ? (
            <>
              {Array.from({ length: leaderboardData?.length }, (_, index) => (
                <tr key={index}>
                  <td scope="row">{index + 1}</td>
                  <td>{leaderboardData[index]?.data()?.name}</td>
                  {selectedType === "highScores" ? (
                    <td>{leaderboardData[index]?.data()?.highScores[selectedWordCount]}</td>
                  ) : (
                    <td>
                      {leaderboardData[index]?.data()?.wins[selectedGamemode][selectedWordCount]}
                    </td>
                  )}
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
          <GamemodeButtons />
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
