import React, { useState, useRef, useEffect } from "react";

import fire from "../icons/fire.png";
import CountUp from "react-countup";
import WordCard from "./WordCard";
import { useNavigate } from "react-router-dom";

import retry from "../icons/reload.png";
import home from "../icons/home.png";

import { fetchRandomWords, fetchTranslation } from "../utils/utils";
import { useAuth } from "../utils/authContext";
import Loading from "./Loading";
import PlayerNavBar from "./PlayerNavBar";
import { useFirebaseContext } from "../utils/firebaseContext";
import { updateLobbyData } from "../utils/lobbyUtils";
import { increment } from "firebase/firestore";
import "../styling/Play.css";

function Summary() {
  const navigate = useNavigate();
  const [retryLoading, setRetryLoading] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const { lobbyData, userData, lobbyId } = useFirebaseContext();

  const { currentUser } = useAuth();

  useEffect(() => {
    console.log(currentUser);
    if (!currentUser || !lobbyData) return;
    setCurrentPlayer(currentUser.uid);
  }, []);
  const handleHome = () => {
    navigate("/");
  };
  const handleUpdateLobbyData = async (updatedFields) => {
    try {
      await updateLobbyData(lobbyId, updatedFields);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRetryButton = async () => {
    if (!lobbyData?.players[currentUser.uid]?.retry) {
      await handleUpdateLobbyData({
        retryCount: increment(1),
        [`players.${currentUser.uid}.retry`]: true,
      });
    }
  };
  useEffect(() => {
    handleRetry();
  }, [lobbyData?.retryCount]);
  useEffect(() => {
    if (lobbyData?.finishedRetryLoading) {
      setRetryLoading(false);
      navigate("/play");
    }
  }, [lobbyData?.finishedRetryLoading]);

  const handleRetry = async () => {
    if (lobbyData?.retryCount === Object.keys(lobbyData?.players).length) {
      setRetryLoading(true);
      if (Object.keys(lobbyData?.players)[0] === currentUser.uid) {
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
            await handleUpdateLobbyData({
              words: wordsFetched,
              translation: translationFetched,
              finishCount: 0,
              retryCount: 0,
              finishedRetryLoading: true,
              [`players.${currentUser.uid}.score`]: 0,
              [`players.${currentUser.uid}.scores`]: {},
              [`players.${currentUser.uid}.times`]: {},
              [`players.${currentUser.uid}.guesses`]: {},
              [`players.${currentUser.uid}.isNewPb`]: false,
              [`players.${currentUser.uid}.finished`]: false,
              [`players.${currentUser.uid}.retry`]: false,
            });
          } else {
            console.error("Failed to fetch data for play.");
          }
        }
      } else {
        await handleUpdateLobbyData({
          [`players.${currentUser.uid}.score`]: 0,
          [`players.${currentUser.uid}.scores`]: {},
          [`players.${currentUser.uid}.times`]: {},
          [`players.${currentUser.uid}.guesses`]: {},
          [`players.${currentUser.uid}.isNewPb`]: false,
          [`players.${currentUser.uid}.finished`]: false,
          [`players.${currentUser.uid}.retry`]: false,
        });
      }
    }
  };
  if (!currentPlayer || !userData || !lobbyData) {
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
      {!retryLoading ? (
        <>
          <div className="container">
            <div className="row gap-0 playerNavBarRow">
              <PlayerNavBar lobbyData={lobbyData} setCurrentPlayer={setCurrentPlayer} />
            </div>
          </div>
          <div className="container page shadow">
            <div className="container">
              <div className="row">
                <div className="score col-12 col-sm-12 col-lg-6">
                  Score:&nbsp;
                  <CountUp
                    key={currentPlayer}
                    end={lobbyData?.players[currentPlayer]?.score}
                    duration={2}
                    separator=""
                    redraw={true}
                  />
                  {lobbyData?.players[currentPlayer]?.isNewPb && (
                    <img src={fire} className="fire" alt="new highScore"></img>
                  )}
                </div>
                <div className="score col-12 col-sm-12 col-lg-6">
                  Best:&nbsp;
                  {lobbyData?.players[currentPlayer]?.isNewPb ? (
                    <>
                      <CountUp
                        key={currentPlayer}
                        end={
                          lobbyData?.players[currentPlayer]?.highScores[
                            lobbyData.settings.wordCount
                          ]
                        }
                        duration={2}
                        separator=""
                        redraw={true}
                      />
                      <img src={fire} className="fire" alt="new highScore"></img>
                    </>
                  ) : (
                    lobbyData?.players[currentPlayer]?.highScores[lobbyData.settings.wordCount]
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
              <button className="retryButton col-lg-3 col" onClick={handleRetryButton}>
                {lobbyData?.retryCount !== 0 ? (
                  lobbyData?.retryCount + "/" + Object.keys(lobbyData?.players).length
                ) : (
                  <img className="retry" src={retry} alt="retry"></img>
                )}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="title">Retrying</div>
          <Loading />
        </>
      )}
    </div>
  );
}
export default Summary;
