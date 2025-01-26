import { createContext, useContext, useState } from "react";

const LobbyContext = createContext();

export const useLobby = () => {
  return useContext(LobbyContext);
};

export const LobbyProvider = ({ children }) => {
  const [lobby, setLobby] = useState(null);

  const value = {
    lobby,
    setLobby,
  };
  return <LobbyContext.Provider value={value}>{children}</LobbyContext.Provider>;
};
