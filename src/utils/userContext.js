import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const value = {
    userData,
    setUserData,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
