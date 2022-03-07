import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from "../services/authService";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      //Sets the auth token | async get jwt
      await auth.login(data.username, data.password);

      const { state } = this.props.location;
      console.log("state: ", state);
      console.log("window: ", window.location);
      /*window.location = '/' ou autre url, va reload totalement l'appli.
      * On doit faire ça pour que quand un user se log, 'componentDidMount()' de
      * app.js se lance et update "user". Ce hook ne s'exécute qu'une fois à la création du composant*/
      window.location = state ? state.from : "/";
      /*this.props.location d'est défini que si on vient d'une redirection d'une ProtectedRoute
      * et l'URL d'où on vient on l'a stockée dans 'from.pathname'*/
    } catch (ex) {
      /*On catch des exceptions du serveur, qui utilise aussi Joi, donc on récupère
      un message d'erreur */
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        if(ex.response.data.prop === "email"){
          errors.username = ex.response.data.message;
        } else if(ex.response.data.prop === "password"){
          errors.password = ex.response.data.message;
        } else {
          errors.username = ex.response.data;
        }

        this.setState({ errors });
      }
    }
  };

  render() {
    /*If jwt already in localStorage, redirect to home
    * Pourquoi on ne met pas ça dans le constructeur? ---> Pck lee retour est un render d'un composant <Redirect>, doit être fait
    * dans la méthode Render() donc autant laisser comme ça. */
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
