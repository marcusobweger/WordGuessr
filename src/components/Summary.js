import React, { useState, useRef, useEffect } from "react";

import fire from "../icons/fire.png";
import CountUp from "react-countup";
import WordCard from "./WordCard";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
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
  // navigate from react-router
  const navigate = useNavigate();
  // loading state
  const [retryLoading, setRetryLoading] = useState(false);
  // disable retry button based on conditions
  const [disableRetry, setDisableRetry] = useState(false);
  // state to store what player is currently selected to show the matching results
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  // store players sorted by their score to determine winner
  const [sortedPlayers, setSortedPlayers] = useState([]);
  // state to make sure winner is only set once on database
  const [updateWinner, setUpdateWinner] = useState(false);
  // data from context
  const { lobbyData, userData, lobbyId } = useFirebaseContext();
  // get the currentUser object from firebase auth
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser || !lobbyData) return;
    handleUpdateUserData({ state: "summary" });
  }, []);
  useEffect(() => {
    if (!currentUser || !lobbyData) return;

    if (lobbyData.settings.gamemode !== 0 && Object.keys(lobbyData?.players).length === 1) {
      setDisableRetry(true);
    }
  }, [lobbyData?.players]);
  useEffect(() => {
    if (!lobbyData || !userData) return;
    if (lobbyData?.players) {
      const sorted = Object.entries(lobbyData.players) // Convert object to array
        .map(([id, player]) => ({ id, ...player })) // Add ID to each player object
        .sort(
          (a, b) =>
            (b.score || 0) - (a.score || 0) || (a.joined?.seconds || 0) - (b.joined?.seconds || 0)
        ); // Sort by score then by joined date

      setSortedPlayers(sorted);
    }
  }, [lobbyData]);
  useEffect(() => {
    if (!lobbyData || !userData || sortedPlayers.length === 0) return;
    if (
      lobbyData?.finishCount === Object.keys(lobbyData?.players).length &&
      !lobbyData?.finishedRetryLoading &&
      sortedPlayers.length === Object.keys(lobbyData?.players).length
    ) {
      const winnerId = sortedPlayers[0]?.id;

      if (winnerId === currentUser.uid) {
        setUpdateWinner(true);
      }
    }
  }, [sortedPlayers, lobbyData.finishCount]);
  useEffect(() => {
    if (!lobbyData || !userData) return;
    if (updateWinner) {
      handleUpdateUserData({
        [`wins.${lobbyData?.settings?.gamemode}.${lobbyData?.settings?.wordCount}`]: increment(1),
      });
    }
  }, [updateWinner]);

  const handleUpdateLobbyData = async (updatedFields) => {
    try {
      await updateLobbyData(lobbyId, updatedFields);
    } catch (error) {}
  };
  const handleUpdateUserData = async (updatedFields) => {
    try {
      await updateUserData(currentUser, updatedFields);
    } catch (error) {}
  };
  const handleRetryButton = async () => {
    if (lobbyData.settings.gamemode !== 0 && Object.keys(lobbyData?.players).length !== 1) {
      if (!lobbyData?.players[currentUser.uid]?.retry) {
        await handleUpdateLobbyData({
          retryCount: increment(1),
          [`players.${currentUser.uid}.retry`]: true,
        });
      } else {
        await handleUpdateLobbyData({
          retryCount: increment(-1),
          [`players.${currentUser.uid}.retry`]: false,
        });
      }
    } else {
      await handleUpdateLobbyData({
        retryCount: increment(1),
        [`players.${currentUser.uid}.retry`]: true,
      });
    }
  };
  useEffect(() => {
    if (!lobbyData || !userData) return;
    handleRetry();
  }, [lobbyData?.retryCount]);
  useEffect(() => {
    if (!lobbyData || !userData) return;
    if (lobbyData?.finishedRetryLoading) {
      navigate("/play");
    }
  }, [lobbyData?.finishedRetryLoading]);

  const handleRetry = async () => {
    if (lobbyData?.retryCount === Object.keys(lobbyData?.players).length) {
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
        } finally {
          if (wordsFetched.length > 0 && translationFetched.length > 0) {
            await handleUpdateLobbyData({
              words: wordsFetched,
              translation: translationFetched,
              finishCount: 0,
              retryCount: 0,
              readyCount: 0,
              [`players.${currentUser.uid}.score`]: 0,
              [`players.${currentUser.uid}.scores`]: {},
              [`players.${currentUser.uid}.times`]: {},
              [`players.${currentUser.uid}.guesses`]: {},
              [`players.${currentUser.uid}.isNewPb`]: false,
              [`players.${currentUser.uid}.finished`]: false,
              [`players.${currentUser.uid}.retry`]: false,
              [`players.${currentUser.uid}.ready`]: false,
              [`players.${currentUser.uid}.winner`]: false,
            });
            await handleUpdateLobbyData({
              finishedRetryLoading: true,
            });
          } else {
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
          [`players.${currentUser.uid}.ready`]: false,
          [`players.${currentUser.uid}.winner`]: false,
        });
      }
    }
  };
  if (!userData || !lobbyData) {
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
  if (retryLoading) {
    return (
      <div className="container">
        <div className="title">Retrying</div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="container">
      {!retryLoading && sortedPlayers.length !== 0 && !lobbyData?.finishedRetryLoading && (
        <>
          <div className="container">
            {currentPlayerIndex === 0 && (
              <Confetti
                run={currentPlayerIndex === 0 ? true : false}
                numberOfPieces={200}
                recycle={false}
                initialVelocityY={2}
                gravity={0.09}
                confettiSource={{
                  x: 0,
                  y: window.innerHeight / 15,
                  w: window.innerWidth,
                  h: window.innerHeight,
                }}
                width={window.innerWidth}
                height={window.innerHeight}
                opacity={0.8}
                tweenDuration={500}
              />
            )}
            <div
              className={`row playerNavBarRow ${
                Object.keys(lobbyData.players).length === 1 ? "solo" : ""
              }`}>
              <PlayerNavBar
                lobbyData={lobbyData}
                setCurrentPlayerIndex={setCurrentPlayerIndex}
                currentPlayerIndex={currentPlayerIndex}
                sortedPlayers={sortedPlayers}
              />
            </div>
          </div>
          <div className="container page shadow">
            <div className="container">
              <div className="row">
                <div className="score col-12 col-sm-12 col-lg-6">
                  Score:&nbsp;
                  <CountUp
                    key={currentPlayerIndex}
                    end={sortedPlayers[currentPlayerIndex]?.score}
                    duration={2}
                    separator=""
                    redraw={true}
                  />
                  {sortedPlayers[currentPlayerIndex]?.isNewPb && (
                    <img src={fire} className="fire" alt="new highScore"></img>
                  )}
                </div>
                <div className="score col-12 col-sm-12 col-lg-6">
                  Best:&nbsp;
                  {sortedPlayers[currentPlayerIndex]?.isNewPb ? (
                    <>
                      <CountUp
                        key={currentPlayerIndex}
                        end={
                          sortedPlayers[currentPlayerIndex]?.highScores[
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
                    sortedPlayers[currentPlayerIndex]?.highScores[lobbyData.settings.wordCount]
                  )}
                </div>
              </div>
              <div className="row wordCardRow">
                <WordCard
                  lobbyData={lobbyData}
                  userData={userData}
                  currentPlayerIndex={currentPlayerIndex}
                  sortedPlayers={sortedPlayers}
                />
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
                  lobbyData?.retryCount + " of " + Object.keys(lobbyData?.players).length
                ) : (
                  <img className="retry" src={retry} alt="retry"></img>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default Summary;
