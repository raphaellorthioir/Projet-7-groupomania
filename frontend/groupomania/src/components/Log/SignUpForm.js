import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUpForm = (props) => {
  const pseudo = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const confirmPsw = useRef(null);

  const [errorPswMatch, setErrorPswMatch] = useState(null);
  const [errorsPsw, setErrorsPsw] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);

  const logging = props.logging;
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (errorsPsw) setErrorsPsw(null);
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
          console.log('on test logging');
          logging();
          navigate('/');
        })
        .catch((res) => {
          console.log(res);
          if (res.response.data.passwordErrorList) {
            setErrorsPsw(res.response.data.passwordErrorList);
          }
          if (res.response.data.errors.email)
            setErrorEmail('Cette adresse est déjà liée à un compte existant');
          /* if (res.response.data.errors) {
              if (res.response.data.errors.pseudo) {
                pseudoError.innerHTML = 'Ce pseudo est déjà pris';
              }
              if (res.response.data.errors.email) {
                emailError.innerHTML = 'Cet email est déjà utilisé';
              }
            }
  
            if (res.response.data.passwordErrorList) {
              let dataPassword = res.response.data.passwordErrorList;
              let ul = document.createElement('ul');
              ul.setAttribute('id', 'passwordErrorsList');
              ul.setAttribute('class', 'txt-al-j');
              let li;
              passwordErrors.appendChild(ul);
  
              dataPassword.forEach((dataList) => {
                li = document.createElement('li');
                ul.appendChild(li);
                li.textContent = `${dataList.message}`;
              });
            }*/
        });
    }
  };

  return (
    <form action="" onSubmit={handleRegister}>
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
      <div className=" error errorPseudo"></div>
      <label htmlFor="email">Email</label>
      <br />
      <input type="email" name="email" id="email" ref={email} />
      {errorEmail && <div className=" error errorEmail"> {errorEmail}</div>}

      <label htmlFor="password">Mot de passe</label>
      <br />

      <input type="password" name="password" id="password" ref={password} />
      {errorsPsw &&
        errorsPsw.map((item) => (
          <div className=" error passwordErrors"> {item.message}</div>
        ))}

      <br />
      <label htmlFor="password-conf">Confirmer mot de passe</label>
      <br />
      <input
        type="password"
        name="password-conf"
        id="password-conf"
        ref={confirmPsw}
      />
      {errorPswMatch && (
        <div className="error passwordConfirmError">
          Les mot de passe ne correspondent pas
        </div>
      )}

      <br />
      <input
        type="submit"
        value="Valider inscription"
        onSubmit={handleRegister}
      />
    </form>
  );
};

export default SignUpForm;
