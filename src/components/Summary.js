import React, { useState, useRef, useEffect } from "react";

import fire from "../icons/fire.png";
import CountUp from "react-countup";
import WordCard from "./WordCard";
import { useNavigate } from "react-router-dom";

import retry from "../icons/reload.png";
import home from "../icons/home.png";

import { fetchRandomWords, fetchTranslation } from "../utils/utils";
import useLobbyListener from "../utils/useLobbyListener";
import useUserListener from "../utils/useUserListener";
import useLobbyActions from "../utils/useLobbyActions";
import useUserActions from "../utils/useUserActions";
import { useAuth } from "../utils/authContext";
import Loading from "./Loading";
import PlayerNavBar from "./PlayerNavBar";

function Summary() {
  const navigate = useNavigate();
  const [retryLoading, setRetryLoading] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState("");

  const { lobbyData, lobbyDataLoading } = useLobbyListener();
  const { userData, userDataLoading } = useUserListener();
  const { currentUser } = useAuth();
  const { updateLobbyData } = useLobbyActions();
  const { updateUserData } = useUserActions();

  useEffect(() => {
    setCurrentPlayer(currentUser.uid);
    return () => {};
  }, []);
  const handleHome = () => {
    navigate("/");
  };
  const handleUpdateLobbyData = async (updatedFields) => {
    try {
      await updateLobbyData(updatedFields);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRetry = async () => {
    setRetryLoading(true);

    let wordsFetched = [];
    let translationFetched = [];
    try {
      wordsFetched = await fetchRandomWords(lobbyData.settings.wordCount);
      translationFetched = await fetchTranslation(
        wordsFetched,
        lobbyData.settings.sourceLang,
        lobbyData.settings.targetLang
      );
    } catch (error) {
      console.error("Error during the play process:", error);
    } finally {
      if (wordsFetched.length > 0 && translationFetched.length > 0) {
        setRetryLoading(false);
        navigate("/play");
        handleUpdateLobbyData({
          words: wordsFetched,
          translation: translationFetched,
          finishCount: 0,
          [`players.${currentUser.uid}.score`]: 0,
          [`players.${currentUser.uid}.scores`]: {},
          [`players.${currentUser.uid}.times`]: {},
          [`players.${currentUser.uid}.guesses`]: {},
          [`players.${currentUser.uid}.isNewPb`]: false,
          [`players.${currentUser.uid}.finished`]: false,
        });
      } else {
        console.error("Failed to fetch data for play.");
      }
    }
  };

  if (lobbyDataLoading || userDataLoading || !lobbyData) {
    return <Loading />;
  } else if (
    lobbyData.finishCount !== Object.keys(lobbyData.players).length &&
    lobbyData.players[currentUser.uid].finished
  ) {
    return (
      <div className="container">
        <div className="title">Waiting for players</div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="container page playerNavBar shadow">
        <PlayerNavBar lobbyData={lobbyData} setCurrentPlayer={setCurrentPlayer} />
      </div>
      <div className="container page shadow">
        <div className="container">
          <div className="row">
            <div className="score col-12 col-sm-12 col-lg-6">
              Score:&nbsp;
              <CountUp end={lobbyData.players[currentPlayer]?.score} duration={3} separator="" />
              {lobbyData.players[currentPlayer]?.isNewPb && (
                <img src={fire} className="fire" alt="new highScore"></img>
              )}
            </div>
            <div className="score col-12 col-sm-12 col-lg-6">
              Best:&nbsp;
              {lobbyData.players[currentPlayer]?.isNewPb ? (
                <>
                  <CountUp
                    end={userData.highScores[lobbyData.settings.wordCount]}
                    duration={3}
                    separator=""
                  />
                  <img src={fire} className="fire" alt="new highScore"></img>
                </>
              ) : (
                userData.highScores[lobbyData.settings.wordCount]
              )}
            </div>
          </div>
          <div className="row wordCardRow">
            <WordCard lobbyData={lobbyData} userData={userData} currentPlayer={currentPlayer} />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row d-flex flex-nowrap justify-content-between gap-3">
          <button className="homeButton col-lg-3 col" onClick={handleHome}>
            <img className="home" src={home} alt="home"></img>
          </button>
          <button className="retryButton col-lg-3 col" onClick={handleRetry}>
            {retryLoading ? <Loading /> : <img className="retry" src={retry} alt="retry"></img>}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Summary;
