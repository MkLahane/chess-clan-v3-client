import React, { useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Arena from "./pages/Arena";
import JoinGame from "./pages/JoinGame";
import AuthRoute from "./components/AuthRoute";
import { FirebaseContext } from "./contexts/FirebaseContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { UserContext } from "./contexts/UserContext";
import { GameProvider } from "./contexts/Game";
import Notification from "./components/Notification";
import { NotificationProvider } from "./contexts/NotificationContext";
import "./App.css";
import Games from "./pages/Games";
import SeeGame from "./pages/SeeGame";

function App() {
  const { auth } = useContext(FirebaseContext);
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <UserContext.Provider value={{ user }}>
        <BrowserRouter>
          <GameProvider>
            <NotificationProvider>
              <Navbar />
              <Notification />
              <Switch>
                <Route exact path="/" component={Home} />
                <AuthRoute exact path="/register" component={Register} />
                <AuthRoute exact path="/login" component={Login} />
                <AuthRoute
                  exact
                  path="/games"
                  inverse={true}
                  component={Games}
                />
                <AuthRoute
                  exact
                  path="/arena"
                  inverse={true}
                  component={Arena}
                />
                <AuthRoute
                  exact
                  path="/arena/:id"
                  inverse={true}
                  component={JoinGame}
                ></AuthRoute>
                <AuthRoute
                  exact
                  path="/games/:id"
                  inverse={true}
                  component={SeeGame}
                ></AuthRoute>
              </Switch>
            </NotificationProvider>
          </GameProvider>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
