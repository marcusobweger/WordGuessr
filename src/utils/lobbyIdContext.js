import { createContext, useContext, useState } from "react";

const LobbyIdContext = createContext();

export const useLobbyId = () => {
  return useContext(LobbyIdContext);
};

export const LobbyIdProvider = ({ children }) => {
  const [lobbyId, setLobbyId] = useState(null);

  const value = {
    lobbyId,
    setLobbyId,
  };
  return <LobbyIdContext.Provider value={value}>{children}</LobbyIdContext.Provider>;
};
