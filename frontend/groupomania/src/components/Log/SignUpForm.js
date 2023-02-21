import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUpForm = (props) => {
  const pseudo = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const confirmPsw = useRef(null);

  const [errorPswMatch, setErrorPswMatch] = useState(null);
  const [errorsPsw, setErrorsPsw] = useState();
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPseudo, setErrorPseudo] = useState();

  const logging = props.logging;
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (errorsPsw) setErrorsPsw(null);
    if (errorPseudo) setErrorPseudo(null);
    if (errorPswMatch) setErrorPswMatch(null);
    if (errorEmail) setErrorEmail(null);

    const focusedPseudo = pseudo.current.value;
    const focusedEmail = email.current.value;
    const focusedPassword = password.current.value;
    const focusConfirmedPsw = confirmPsw.current.value;

    if (focusedPassword !== focusConfirmedPsw) {
      setErrorPswMatch('Les mots de passe ne correspondent pas');
    } else {
      axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}api/auth/signup`,
        withCredentials: true,
        data: {
          pseudo: focusedPseudo,
          email: focusedEmail,
          password: focusedPassword,
        },
      })
        .then(() => {
          logging();
          navigate('/', { replace: true });
        })
        .catch((err) => {
          if (err.response.data.passwordErrorList) {
            setErrorsPsw(err.response.data.passwordErrorList);
          }
          if (err.response.data.errors.email)
            setErrorEmail('Cette adresse est déjà liée à un compte existant');
          if (err.response.data.errors.pseudo)
            setErrorPseudo('Ce pseudo est déjà pris');
        });
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <div className=" flex row ac-center">
        <div className="inputs-container flex cl ai-center">
          <div>
            <br />
            <label htmlFor="pseudo">Pseudo</label>
            <br />
            <input
              type="text"
              name="pseudo"
              id="pseudo"
              ref={pseudo}
              placeholder="Votre Pseudo"
              required
            />
          </div>
          {errorPseudo && (
            <div className=" error error-text  ">{errorPseudo}</div>
          )}
          <br />

          <div>
            <label htmlFor="email">Email</label>
            <br />
            <input type="email" name="email" id="email" ref={email} />
          </div>
          {errorEmail && <div className=" error error-text"> {errorEmail}</div>}
          <br />
          <div>
            <label htmlFor="password">Mot de passe</label>
            <br />
            <input
              type="password"
              name="password"
              id="password"
              ref={password}
            />
          </div>
          {errorsPsw && (
            <ul className=" error error-text">
              {errorsPsw.map((item) => (
                <li>{item.message}</li>
              ))}
            </ul>
          )}
          <br />
          <label htmlFor="password-conf">Confirmer mot de passe</label>
          <br />
          <input
            type="password"
            name="password-conf"
            id="password-conf"
            placeholder="Confirmer"
            ref={confirmPsw}
          />
          {errorPswMatch && (
            <div className="error error-text">
              Les mot de passe ne correspondent pas
            </div>
          )}
          <br />
          <br />
          <br />
          <div style={{ margin: 'auto', width: 'fit-content' }}>
            <input
              type="submit"
              value="Valider inscription"
              onSubmit={handleRegister}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
