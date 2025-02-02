import React, { useState, createContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Play from "./components/Play";
import About from "./components/About";
import Summary from "./components/Summary";
import LeaderBoard from "./components/LeaderBoard";
import NavBar from "./components/NavBar";
import EnterCode from "./components/EnterCode";
import Continue from "./components/Continue";
import Lobby from "./components/Lobby";
import Signin from "./components/Signin";
import Profile from "./components/Profile";
import "../src/styling/App.css";
import { AuthProvider } from "./utils/authContext";
import { SettingsProvider } from "./utils/settingsContext";
import { FirebaseProvider } from "./utils/firebaseContext";
import EnterUserName from "./components/EnterUserName";

export const AppContext = createContext();
function App() {
  const [homeState, setHomeState] = useState(false);
  return (
    <AppContext.Provider value={{ setHomeState }}>
      <AuthProvider>
        <SettingsProvider>
          <FirebaseProvider>
            <Router>
              <NavBar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/play" element={<Play />} />
                <Route path="/summary" element={<Summary />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Signin type="login" />} />
                <Route path="/signup" element={<Signin type="signup" />} />
                <Route path="/username" element={<EnterUserName />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/leaderboard" element={<LeaderBoard />} />
                <Route path="/code" element={<EnterCode />} />
                <Route path="/continue" element={<Continue />} />
                <Route path="/lobby" element={<Lobby />} />
                {/*not found*/}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </FirebaseProvider>
        </SettingsProvider>
      </AuthProvider>
    </AppContext.Provider>
  );
}

export default App;
