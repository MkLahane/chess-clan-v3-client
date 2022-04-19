import React, { useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Arena from "./pages/Arena";
import Game from "./pages/Game";
import AuthRoute from "./components/AuthRoute";
import { FirebaseContext } from "./contexts/FirebaseContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { UserContext } from "./contexts/UserContext";
import { GameProvider } from "./contexts/Game";
import "./App.css";

function App() {
  const { auth } = useContext(FirebaseContext);
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <UserContext.Provider value={{ user }}>
        <BrowserRouter>
          <GameProvider>
            <Navbar />
            <Switch>
              <Route exact path="/" component={Home} />
              <AuthRoute exact path="/register" component={Register} />
              <AuthRoute exact path="/login" component={Login} />
              <AuthRoute exact path="/arena" inverse={true} component={Arena} />
              <AuthRoute
                exact
                path="/games/:id"
                inverse={true}
                component={Game}
              ></AuthRoute>
            </Switch>
          </GameProvider>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
