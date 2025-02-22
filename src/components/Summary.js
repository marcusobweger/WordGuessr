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
  // change the user's state to summary on page mount
  useEffect(() => {
    if (!currentUser || !lobbyData) return;
    handleUpdateUserData({ state: "summary" });
  }, []);
  // disable the retry button if the gamemode isn't Solo mode and there is only one player left
  useEffect(() => {
    if (!currentUser || !lobbyData) return;
    if (lobbyData.settings.gamemode !== 0 && Object.keys(lobbyData?.players).length === 1) {
      setDisableRetry(true);
    }
  }, [lobbyData?.players]);
  // sort the players by score on the fly to determine winner and player ranking
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
  // when the game has finished and the winner (the first entry in the sortedPlayers array) is the current user,
  // set the updateWinner state to true
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
  // update the wins count in the users collection
  useEffect(() => {
    if (!lobbyData || !userData) return;
    if (updateWinner) {
      handleUpdateUserData({
        [`wins.${lobbyData?.settings?.gamemode}.${lobbyData?.settings?.wordCount}`]: increment(1),
      });
    }
  }, [updateWinner]);
  // handler for updating the lobbies collection on firebase
  const handleUpdateLobbyData = async (updatedFields) => {
    try {
      await updateLobbyData(lobbyId, updatedFields);
    } catch (error) {}
  };
  // handler for updating the users collection on firebase
  const handleUpdateUserData = async (updatedFields) => {
    try {
      await updateUserData(currentUser, updatedFields);
    } catch (error) {}
  };
  // the logic related to the retry button
  const handleRetryButton = async () => {
    // if the gamemode isn't Solo and there are still more than one players in the lobby
    if (lobbyData.settings.gamemode !== 0 && Object.keys(lobbyData?.players).length !== 1) {
      // if the player hasn't clicked retry yet and clicks retry
      if (!lobbyData?.players[currentUser.uid]?.retry) {
        // increase the lobby's retryCount by 1 and set the players retry toggle to true
        await handleUpdateLobbyData({
          retryCount: increment(1),
          [`players.${currentUser.uid}.retry`]: true,
        });
      } else {
        // decrease the retryCount and set retry to false
        await handleUpdateLobbyData({
          retryCount: increment(-1),
          [`players.${currentUser.uid}.retry`]: false,
        });
      }
      // else if the gamemode is Solo, the lobby should retry when the one player clicks retry
    } else {
      await handleUpdateLobbyData({
        retryCount: increment(1),
        [`players.${currentUser.uid}.retry`]: true,
      });
    }
  };
  // call the actual retry functionality every time the lobby's retryCount changes
  useEffect(() => {
    if (!lobbyData || !userData) return;
    handleRetry();
  }, [lobbyData?.retryCount]);
  // if the lobby has finished resetting and is ready for retry, navigate to play
  useEffect(() => {
    if (!lobbyData || !userData) return;
    if (lobbyData?.finishedRetryLoading) {
      navigate("/play");
    }
  }, [lobbyData?.finishedRetryLoading]);

  // retry logic
  const handleRetry = async () => {
    // if every player in the lobby has clicked retry, the retryCount should be equal to the lobby's player count
    if (lobbyData?.retryCount === Object.keys(lobbyData?.players).length) {
      setRetryLoading(true);
      // check if the current user is the host of the lobby
      // if yes, fetch the new words and translations so that they are only fetched once by the host
      // and not by every player to avoid data conflicts
      if (lobbyData?.players[currentUser?.uid]?.host) {
        let wordsFetched = [];
        let translationFetched = [];
        try {
          // fetch the new data
          wordsFetched = await fetchRandomWords(lobbyData.settings.wordCount);
          translationFetched = await fetchTranslation(
            wordsFetched,
            lobbyData.settings.sourceLang,
            lobbyData.settings.targetLang
          );
        } catch (error) {
        } finally {
          // if the words and translations are populated, update the lobby data
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
            // only set finishedRetryLoading to true if the previous updates have succeeded
            await handleUpdateLobbyData({
              finishedRetryLoading: true,
            });
          } else {
          }
        }
        // every other player that is not the host resets their own stats without fetching the new data
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
  // if no data is preset show a loader
  if (!userData || !lobbyData) {
    return <Loading />;
    // if the current player is finished but not all players in the lobby have finished,
    // show a waiting for players text and a loader
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
  // if the retry logic is processing and has not finished yet show other feedback
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
            {/* show confetti animation if the winning player is selected */}
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
                // add different styling if only one player is in the lobby
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
