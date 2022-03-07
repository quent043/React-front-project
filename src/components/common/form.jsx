import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";

/* Classe faisant office d'interface, pas de méthode render(), doit être extended.
On extrait toutes les méthodes non spécifiques. Valider les champs, valider les check avant submit, render les éléments d'un form
Les classes qui extendent dette classe devront avoir un schema Joi pour les datas et une méthode 'doSubmit()'
On peut toujours override les fonctions de cette classe si on veut changer un comportement.
*/
class Form extends Component {
  state = {
    data: {},
    errors: {}
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    //item.path[0] ---> Name of the input field
    //item.message ---> Error message
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    //On recrée un schema unique pour la propriété
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {
    //Prevents a full reload of the page (default behaviour)
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  //curentTarget est une prop de l'objet ChangeEven passé automatiquement à (onChange(e))
  handleChange = ({ currentTarget: input }) => {
    /*On récupère une erreur sur l'input ciblé. Si pas d'erreur on delete la value (potentiel mesage d'erreur d'une saisie précédente)
    Si erreur on la set dans 'errors' puis on la set dans le state*/
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    //On récupère la valeur de l'input et on la set dans le state.
    const data = { ...this.state.data };
    //input.name donne le nom de l'input (prop {name} qu'on lui passe) et value sa valeur
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderSelect(name, label, options) {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderInput(name, label, type = "text") {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
}

export default Form;
