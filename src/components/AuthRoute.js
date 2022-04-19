import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { FirebaseContext } from "../contexts/FirebaseContext";

const AuthRoute = ({ component: Component, inverse, ...rest }) => {
  const { auth } = useContext(FirebaseContext);
  const [user, loading] = useAuthState(auth);
  if (loading) {
    return <></>;
  }
  if (inverse) {
    return (
      <Route
        {...rest}
        render={(props) =>
          user ? <Component {...props} /> : <Redirect to="/login" />
        }
      />
    );
  } else {
    return (
      <Route
        {...rest}
        render={(props) =>
          user ? <Redirect to="/" /> : <Component {...props} />
        }
      />
    );
  }
};

export default AuthRoute;
