import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

// useState (Hook) pemrmet de manipuler une variable dans le composant( une valeur, un objet , un booléen etc ),
//puis d'y appliquer une fonction afin de changer son état dans le composant et de le garder en mémoire
// const [variable, "fonction"] = useState
const Log = (props) => {
  const [signUpModal, setSignUpModal] = useState(true);
  const [signInModal, setSignInModal] = useState(false);
  const logging = props.logging.logging;
  //e est l'élement cliqué
  const handleModals = (e) => {
    if (e.target.id === 'register') {
      setSignInModal(false);
      setSignUpModal(true);
    } else if (e.target.id === 'login') {
      setSignUpModal(false);
      setSignInModal(true);
    }
  };

  return (
    <div className="connection-form">
      <div className="form-container flex row space-around">
        <ul>
          <li
            onClick={handleModals}
            id="register"
            className={signUpModal ? 'active-btn ' : null}
          >
            {/* on peut mettre une condition pour décider de mettre les attributs selon certains événements  */}
            S'inscrire
          </li>
          <li
            onClick={handleModals}
            id="login"
            className={signInModal ? 'active-btn' : null}
          >
            Se connecter
          </li>
        </ul>
        {/* 
          'rendu conditionnel { "si qqchose" && alors fait apparaître le composant }'*/}
        {signUpModal && <SignUpForm logging={logging} />}
        {/*'si signUpModal  = true alors affiche SignUpForm'*/}
        {signInModal && <SignInForm logging={logging} />}
        {/*'si signInModal  = true alors affiche SignInForm'*/}
      </div>
    </div>
  );
};

export default Log;
