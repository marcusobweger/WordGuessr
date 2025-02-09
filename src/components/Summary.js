import React, { useState, useRef, useEffect } from "react";

import fire from "../icons/fire.png";
import CountUp from "react-countup";
import WordCard from "./WordCard";
import { useNavigate } from "react-router-dom";

import retry from "../icons/reload.png";

import { fetchRandomWords, fetchTranslation } from "../utils/utils";
import { useAuth } from "../utils/authContext";
import Loading from "./Loading";
import PlayerNavBar from "./PlayerNavBar";
import { useFirebaseContext } from "../utils/firebaseContext";
import { updateLobbyData } from "../utils/lobbyUtils";
import { updateUserData } from "../utils/userUtils";
import { increment } from "firebase/firestore";
import "../styling/Summary.css";
import HomeButton from "./HomeButton";

function Summary() {
  const navigate = useNavigate();
  const [retryLoading, setRetryLoading] = useState(false);
  const [disableRetry, setDisableRetry] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const { lobbyData, userData, lobbyId } = useFirebaseContext();

  const { currentUser } = useAuth();

  useEffect(() => {
    console.log(currentUser);
    if (!currentUser || !lobbyData) return;
    handleUpdateUserData({ state: "summary" });
    setCurrentPlayer(currentUser.uid);
  }, []);
  useEffect(() => {
    if (!currentUser || !lobbyData) return;

    if (lobbyData.settings.gamemode !== 0 && lobbyData?.playerCount === 1) {
      setDisableRetry(true);
    }
  }, [lobbyData?.players]);

  const handleUpdateLobbyData = async (updatedLobbyFields, updatedPlayerFields) => {
    try {
      await updateLobbyData(lobbyId, currentUser.uid, updatedLobbyFields, updatedPlayerFields);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateUserData = async (updatedFields) => {
    try {
      await updateUserData(currentUser, updatedFields);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRetryButton = async () => {
    if (lobbyData.settings.gamemode !== 0 && lobbyData?.playerCount !== 1) {
      if (!lobbyData?.players[currentUser.uid]?.retry) {
        await handleUpdateLobbyData(
          {
            retryCount: increment(1),
          },
          {
            retry: true,
          }
        );
      } else {
        await handleUpdateLobbyData(
          {
            retryCount: increment(-1),
          },
          {
            retry: false,
          }
        );
      }
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
    if (lobbyData?.retryCount === lobbyData?.playerCount) {
      setRetryLoading(true);
      if (lobbyData?.players[currentUser?.uid]?.host) {
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
            await handleUpdateLobbyData(
              {
                words: wordsFetched,
                translation: translationFetched,
                finishCount: 0,
                retryCount: 0,
                readyCount: 0,
                finishedRetryLoading: true,
              },
              {
                score: 0,
                scores: {},
                times: {},
                guesses: {},
                isNewPb: false,
                finished: false,
                retry: false,
                ready: false,
              }
            );
          } else {
            console.error("Failed to fetch data for play.");
          }
        }
      } else {
        await handleUpdateLobbyData(
          {},
          {
            score: 0,
            scores: {},
            times: {},
            guesses: {},
            isNewPb: false,
            finished: false,
            retry: false,
            ready: false,
          }
        );
      }
    }
  };
  if (!currentPlayer || !userData || !lobbyData) {
    return <Loading />;
  } else if (
    lobbyData.finishCount !== lobbyData?.playerCount &&
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
            <div className={`row playerNavBarRow ${lobbyData?.playerCount === 1 ? "solo" : ""}`}>
              <PlayerNavBar
                lobbyData={lobbyData}
                setCurrentPlayer={setCurrentPlayer}
                currentPlayer={currentPlayer}
              />
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
            <div className="row buttonRow">
              <HomeButton />
              <button
                className="retryButton col-lg-3 col-12"
                onClick={handleRetryButton}
                disabled={disableRetry}>
                {lobbyData?.retryCount !== 0 ? (
                  lobbyData?.retryCount + " of " + lobbyData?.playerCount
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
