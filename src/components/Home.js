import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ja from "../icons/japan.png";
import ko from "../icons/south-korea.png";
import de from "../icons/germany.png";
import it from "../icons/italy.png";
import fr from "../icons/france.png";
import es from "../icons/spain.png";
import "../styling/Home.css";
import { AppContext } from "../App";
import { useAuth } from "../utils/authContext";
import { useSettings } from "../utils/settingsContext";
import useLobbyActions from "../utils/useLobbyActions";
import useLobbyListener from "../utils/useLobbyListener";
import useUserListener from "../utils/useUserListener";
import Loading from "./Loading";
import { useLobbyId } from "../utils/lobbyIdContext";
function Home() {
  const { setHomeState } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const { settings, setSettings } = useSettings();
  const { searchOpenLobby, createNewLobby, deleteLobby } = useLobbyActions();
  const { lobbyData } = useLobbyListener();
  const { lobbyId } = useLobbyId();
  const userDataLoading = useUserListener();
  const [isSearching, setIsSearching] = useState(false);

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
    if (lobbyId) {
      deleteLobby();
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

  useEffect(() => {
    setHomeState(isLoading);
  }, [isLoading]);

  // executes when the play button is pressed, if userLoggedIn play directly else go to continue page
  const handlePlay = async () => {
    setIsLoading(true);
    savePreferences();
    if (userLoggedIn) {
      console.log("test");
      switch (settings.gamemode) {
        case 0:
          await createNewLobby();
          setIsLoading(false);
          navigate("/play");
          break;
        case 1:
          setIsSearching(true);
          const lobbyFound = await searchOpenLobby();
          if (lobbyFound) {
            console.log("lobby found");
            setIsSearching(false);
            setIsLoading(false);
            navigate("/play");
          } else {
            await createNewLobby();
            console.log("lobby created regardless");
            setIsLoading(false);
          }
          break;
        case 2:
          await createNewLobby();
          setIsLoading(false);
          navigate("/lobby");
          break;
      }
    } else {
      navigate("/continue");
    }
  };

  useEffect(() => {
    if (lobbyData && !lobbyData?.isOpen) {
      setIsSearching(false);
      navigate("/play");
    }
  }, [lobbyData]);

  const LanguageButtons = () => {
    return Array.from({ length: targetLanguages.length }, (_, index) => (
      <button
        key={index}
        className={`col ${settings.targetLang === targetLanguages[index] ? "clicked" : ""}`}
        disabled={isLoading}
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
        disabled={isLoading}
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
            disabled={isLoading}>
            Solo
          </button>
          <button
            className={`col ${settings.gamemode === 1 ? "clicked" : ""}`}
            onClick={() => setSettings({ ...settings, gamemode: 1 })}
            disabled={isLoading}>
            Online
          </button>
          <button
            className={`col-12 col-sm ${settings.gamemode === 2 ? "clicked" : ""}`}
            onClick={() => setSettings({ ...settings, gamemode: 2 })}
            disabled={isLoading}>
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
        if (isSearching) {
          return (
            <>
              In Queue
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
          <button className="col" onClick={handlePlay} disabled={isLoading}>
            <PlayButtonContent />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
