import React, { useRef, useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

// useState (Hook) pemrmet de manipuler une variable dans le composant( une valeur, un objet , un booléen etc ),
//puis d'y appliquer une fonction afin de changer son état dans le composant et de le garder en mémoire
// const [variable, "fonction"] = useState
const Log = (props) => {
  const [signUpModal, setSignUpModal] = useState(true);
  const [signInModal, setSignInModal] = useState(false);
  const logging = props.logging.logging;

  const windowSize = useRef([window.innerWidth]);
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
    <div className="connection-form ">
      <div className="form-container">
        <div className="logo-container">
          {windowSize.current[0] >= 900 && (
            <img
              src={require('../../images/icon-left-font.-signing-page.png')}
              alt="Groupomania"
            />
          )}
          {windowSize.current[0] > 570 && windowSize.current[0] < 900 && (
            <img
              src={require('../../images/icon-left-font.-signing-page 400p.png')}
              alt="Groupomania"
            />
          )}
          {windowSize.current[0] <= 570 && (
            <img
              src={require('../../images/icon-left-font.-signing-page300p.png')}
              alt="Groupomania"
            />
          )}
        </div>

        <div className="flex row space-around ai-center select-container">
          <div className="select">
            <div
              onClick={handleModals}
              id="register"
              className={signUpModal ? 'active-btn ' : 'blue'}
            >
              {/* on peut mettre une condition pour décider de mettre les attributs selon certains événements  */}
              S'inscrire
            </div>
          </div>

          <div className="select">
            <div
              onClick={handleModals}
              id="login"
              className={signInModal ? 'active-btn' : 'blue'}
            >
              Se connecter
            </div>
          </div>
        </div>
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
