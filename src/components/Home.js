import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ja from "../icons/japan.png";
import ko from "../icons/south-korea.png";
import de from "../icons/germany.png";
import it from "../icons/italy.png";
import fr from "../icons/france.png";
import es from "../icons/spain.png";
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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { userLoggedIn, currentUser } = useAuth();
  const { settings, setSettings } = useSettings();

  const { lobbyData, lobbyId, setLobbyId, userData } = useFirebaseContext();

  // values for generating buttons
  const targetLanguages = ["ja", "ko", "de", "it", "fr", "es"];
  const wordCounts = [3, 5, 10, 15];

  // map icon names to corresponding strings for button generation
  const iconMap = {
    ja: ja,
    ko: ko,
    de: de,
    it: it,
    fr: fr,
    es: es,
  };
  // load preferences from LocalStorage
  useEffect(() => {
    if (userData?.state !== "queueing") {
      if (currentUser) {
        handleUpdateUserData({ state: "idle" });
      }
      // delete lobby or player functionality
      /*
      if (currentUser && lobbyData) {
        // delete lobby if only one player left and this player is the current player, also in solo mode
        if (
          Object.keys(lobbyData?.players).includes(currentUser.uid) &&
          Object.keys(lobbyData?.players).length === 1 &&
          Object.keys(lobbyData?.players)[0] === currentUser.uid
        ) {
          try {
            deleteLobby(lobbyId);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("attempting delete player");
          try {
            deletePlayerFromLobby(currentUser, lobbyData, lobbyId);
          } catch (error) {
            console.log(error);
          }
            
        }
          
      }
        */
    }
    const savedGamemode = localStorage.getItem("gamemode");
    const savedSourceLang = localStorage.getItem("sourceLang");
    const savedTargetLang = localStorage.getItem("targetLang");
    const savedWordCount = localStorage.getItem("wordCount");
    if (savedGamemode && savedSourceLang && savedTargetLang && savedWordCount)
      setSettings({
        ...settings,
        gamemode: parseInt(savedGamemode),
        sourceLang: savedSourceLang,
        targetLang: savedTargetLang,
        wordCount: parseInt(savedWordCount),
      });
    console.log(lobbyData);
  }, []);
  // save preferences to LocalStorage
  const savePreferences = () => {
    localStorage.setItem("gamemode", settings.gamemode);
    localStorage.setItem("sourceLang", settings.sourceLang);
    localStorage.setItem("targetLang", settings.targetLang);
    localStorage.setItem("wordCount", settings.wordCount);
  };

  const handleUpdateUserData = async (updatedFields) => {
    try {
      await updateUserData(currentUser, updatedFields);
    } catch (error) {
      console.log(error);
    }
  };
  // executes when the play button is pressed, if userLoggedIn play directly else go to continue page
  const handlePlay = async () => {
    setIsLoading(true);
    savePreferences();
    if (userLoggedIn) {
      console.log("test");
      switch (settings.gamemode) {
        case 0:
          await createNewLobby(settings, setLobbyId, currentUser.uid, userData);
          navigate("/play");
          break;
        case 1:
          handleUpdateUserData({ state: "queueing" });

          const lobbyFound = await searchOpenLobby(settings, setLobbyId, currentUser.uid, userData);
          if (lobbyFound) {
            console.log("lobby found");
            navigate("/play");
          } else {
            await createNewLobby(settings, setLobbyId, currentUser.uid, userData);

            console.log("lobby created regardless");
          }
          break;
        case 2:
          await createNewLobby(settings, setLobbyId, currentUser.uid, userData);
          navigate("/lobby");
          break;
      }
    } else {
      navigate("/continue");
    }
    setIsLoading(false);
  };
  const handleCancel = async () => {
    handleUpdateUserData({ state: "idle" });
    try {
      //deleteLobby(lobbyId);
    } catch (error) {
      console.log(error);
    }
  };

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
            disabled={isLoading}>
            <PlayButtonContent />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
