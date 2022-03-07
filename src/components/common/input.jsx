import React from "react";

const Input = ({ name, label, error, ...rest }) => {
    /*Si les valeurs des props on le même nom que leur prop, passer {...rest} revient à les ecrire toutes
    ça ne marche que pour les valeurs utilisées une fois. Ex la valeur de 'name' est utilisée 3 fois, on doit
     écrire aussi name={name}*/
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input name={name}
             id={name}
             className="form-control"
             {...rest} />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
