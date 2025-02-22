import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { iconMap, wordCounts, targetLanguages } from "../utils/utils";
import "../styling/Home.css";
import { useAuth } from "../utils/authContext";
import { useSettings } from "../utils/settingsContext";
import Loading from "./Loading";
import {
  searchOpenLobby,
  createNewLobby,
  deleteLobby,
  deletePlayerFromLobby,
} from "../utils/lobbyUtils";
import { updateUserData } from "../utils/userUtils";
import { useFirebaseContext } from "../utils/firebaseContext";
function Home() {
  // loading state
  const [isLoading, setIsLoading] = useState(false);
  // navigate from react-router
  const navigate = useNavigate();
  // get the currentUser object and userLoggedIn boolean from firebase auth
  const { userLoggedIn, currentUser } = useAuth();
  // get settings state and corresponding setter from settings context
  const { settings, setSettings } = useSettings();
  // get data from the context
  const { lobbyData, lobbyId, setLobbyId, userData } = useFirebaseContext();

  useEffect(() => {
    // if the home page is accessed while the player is not queueing, set state to idle again
    if (userData?.state !== "queueing") {
      if (currentUser) {
        handleUpdateUserData({ state: "idle" });
      }
      if (currentUser && lobbyData) {
        // delete lobby if only one player left and this player is the current player, also in solo mode
        if (
          Object.keys(lobbyData?.players).includes(currentUser.uid) &&
          Object.keys(lobbyData?.players).length === 1 &&
          Object.keys(lobbyData?.players)[0] === currentUser.uid
        ) {
          try {
            deleteLobby(lobbyId);
          } catch (error) {}
          // else remove only the currentPlayer from the lobby if the user leaves
        } else {
          try {
            deletePlayerFromLobby(currentUser, lobbyData, lobbyId);
          } catch (error) {}
        }
      }
    }
    // load preferences from LocalStorage
    const savedGamemode = localStorage.getItem("gamemode");
    const savedSourceLang = localStorage.getItem("sourceLang");
    const savedTargetLang = localStorage.getItem("targetLang");
    const savedWordCount = localStorage.getItem("wordCount");
    // update the settings context with the information from LocalStorage
    if (savedGamemode && savedSourceLang && savedTargetLang && savedWordCount)
      setSettings({
        ...settings,
        gamemode: parseInt(savedGamemode),
        sourceLang: savedSourceLang,
        targetLang: savedTargetLang,
        wordCount: parseInt(savedWordCount),
      });
  }, []);
  // save preferences from settings context to LocalStorage
  const savePreferences = () => {
    localStorage.setItem("gamemode", settings.gamemode);
    localStorage.setItem("sourceLang", settings.sourceLang);
    localStorage.setItem("targetLang", settings.targetLang);
    localStorage.setItem("wordCount", settings.wordCount);
  };
  // handler for updating the users collection on firebase
  const handleUpdateUserData = async (updatedFields) => {
    try {
      await updateUserData(currentUser, updatedFields);
    } catch (error) {}
  };
  // executes when the play button is pressed, if userLoggedIn play directly else go to continue page
  const handlePlay = async () => {
    setIsLoading(true);
    savePreferences();
    if (userLoggedIn) {
      switch (settings.gamemode) {
        // if gamemode is "Solo"
        case 0:
          // simply create a new lobby with solo settings (see lobbyUtils.js), then navigate to play
          await createNewLobby(settings, setLobbyId, currentUser, userData);
          navigate("/play");
          break;
        // if the gamemode is "Online"
        case 1:
          // set the user's state to queueing
          await handleUpdateUserData({ state: "queueing" });
          // check if a fitting lobby is available (see lobbyUtils.js)
          const lobbyFound = await searchOpenLobby(settings, setLobbyId, currentUser, userData);
          // if a lobby is available, go to play
          if (lobbyFound) {
            navigate("/play");
            // if not, create a new lobby with online settings and wait in queue
          } else {
            await createNewLobby(settings, setLobbyId, currentUser, userData);
            setIsLoading(false);
          }
          break;
        // if gamemode is "Private"
        case 2:
          // create a new lobby with private settings (see lobbyUtils.js) and go to the lobby page
          await createNewLobby(settings, setLobbyId, currentUser, userData);
          navigate("/lobby");
          break;
      }
    } else {
      navigate("/continue");
    }
  };
  // handler for canceling the queue
  const handleCancel = async () => {
    // set user's state back from queueing to idle
    handleUpdateUserData({ state: "idle" });
    try {
      // delete the lobby that was created
      deleteLobby(lobbyId);
    } catch (error) {}
  };
  // executes when a player joins the current user's lobby while in queue
  useEffect(() => {
    if (
      lobbyData &&
      currentUser &&
      userData?.state === "queueing" &&
      settings.gamemode === 1 &&
      !lobbyData?.isOpen
    ) {
      navigate("/play");
    }
  }, [lobbyData?.isOpen]);

  // generates the buttons for selecting the targetLanguage setting
  const LanguageButtons = () => {
    return Array.from({ length: targetLanguages.length }, (_, index) => (
      <button
        key={index}
        className={`col ${settings.targetLang === targetLanguages[index] ? "clicked" : ""}`}
        disabled={isLoading || userData?.state === "queueing"}
        onClick={() => setSettings({ ...settings, targetLang: targetLanguages[index] })}>
        <img
          className="icons"
          src={iconMap[targetLanguages[index]]}
          alt={`${settings.targetLang} icon`}></img>
      </button>
    ));
  };
  // generates the buttons for selecting the wordCount setting
  const WordCountButtons = () => {
    return Array.from({ length: wordCounts.length }, (_, index) => (
      <button
        key={index}
        className={`col ${settings.wordCount === wordCounts[index] ? "clicked" : ""}`}
        disabled={isLoading || userData?.state === "queueing"}
        onClick={() => setSettings({ ...settings, wordCount: wordCounts[index] })}>
        {wordCounts[index]}
      </button>
    ));
  };
  // formats the two button rows
  const Settings = () => {
    return (
      <>
        <div className="row buttonGaps">
          <LanguageButtons />
        </div>
        <div className="row buttonGaps">
          <WordCountButtons />
        </div>
      </>
    );
  };
  // returns the 3 buttons for selecting the gamemode at the top of the page
  const Gamemode = () => {
    return (
      <>
        <div className="row buttonGaps">
          <button
            className={`col ${settings.gamemode === 0 ? "clicked" : ""}`}
            onClick={() => setSettings({ ...settings, gamemode: 0 })}
            disabled={isLoading || userData?.state === "queueing"}>
            Solo
          </button>
          <button
            className={`col ${settings.gamemode === 1 ? "clicked" : ""}`}
            onClick={() => setSettings({ ...settings, gamemode: 1 })}
            disabled={isLoading || userData?.state === "queueing"}>
            Online
          </button>
          <button
            className={`col-12 col-sm ${settings.gamemode === 2 ? "clicked" : ""}`}
            onClick={() => setSettings({ ...settings, gamemode: 2 })}
            disabled={isLoading || userData?.state === "queueing"}>
            Private
          </button>
        </div>
      </>
    );
  };
  // returns different content displayed on the play button at the bottom based on the selected gamemode
  const PlayButtonContent = () => {
    if (!isLoading) {
      if (settings.gamemode === 0) {
        return "Play";
      } else if (settings.gamemode === 1) {
        if (userData?.state === "queueing") {
          return (
            <>
              Cancel Queue
              <Loading />
            </>
          );
        } else {
          return "Join Queue";
        }
      } else if (settings.gamemode === 2) {
        return "Create Lobby";
      }
    } else {
      return <Loading />;
    }
  };

  return (
    <div className="container">
      <div className="container">
        <Gamemode />
        <Settings />
        <div className="play row buttonGaps">
          <button
            className="col"
            onClick={userData?.state !== "queueing" ? handlePlay : handleCancel}
            disabled={isLoading || (userLoggedIn && !userData)}>
            <PlayButtonContent />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
