import React, { useState, createContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Play from "./components/Play";
import About from "./components/About";
import Summary from "./components/Summary";
import Login from "./components/Login";
import Profile from "./components/Profile";
import LeaderBoard from "./components/LeaderBoard";
import NavBar from "./components/NavBar";
import EnterCode from "./components/EnterCode";
import "../src/styling/App.css";

export const AppContext = createContext();
function App() {
  const [homeState, setHomeState] = useState(false);
  return (
    <AppContext.Provider value={{ setHomeState }}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={homeState ? <Play /> : <Navigate to="/" replace />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/enter-code" element={<EnterCode />} />
          {/*not found*/}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
