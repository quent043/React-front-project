import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../../services/authService";

const ProtectedRoute = ({ component: Component, render, ...rest }) => {
    console.log("Protected route: rest", rest);
  return (
    <Route
      {...rest}
      render={props => {
        if (!auth.getCurrentUser() || !Component)
          return (
            <Redirect
                /*'to' peut prendre un objet avec propriété 'state', on y accède après via
                * this.props.location.state ; On lui passe props.location pour que Login sache si on a été redirrigé
                * vers login ou si on se connecte juste */
              to={{
                pathname: "/login",
                state: { from: props.location.pathname }
              }}
            />
          );
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
