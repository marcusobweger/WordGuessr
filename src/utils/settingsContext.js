import { createContext, useContext, useState } from "react";

const SettingsContext = createContext();

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    gamemode: 0,
    sourceLang: "en",
    targetLang: "ja",
    wordCount: 3,
  });

  const value = {
    settings,
    setSettings,
  };
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
