import React, { useState, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Play from "./components/Play";
import About from "./components/About";
import Summary from "./components/Summary";
import logo from "../src/icons/wordguessr_logo1.png";
import "../src/styling/App.css";
export const AppContext = createContext();
function App() {
  const [homeState, setHomeState] = useState(null);
  return (
    <AppContext.Provider value={{ homeState, setHomeState }}>
      <div className="App">
        <div className="header-container">
          <img className="logo" src={logo} alt="logo"></img>
          <h1 className="title">WordGuessr</h1>
        </div>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/play"
              element={homeState ? <Play /> : <Navigate to="/" replace />}
            />
            <Route path="/summary" element={<Summary />} />
            <Route path="/about" element={<About />} />
            {/*not found*/}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </AppContext.Provider>
  );
}

export default App;
