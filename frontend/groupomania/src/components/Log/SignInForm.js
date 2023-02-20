import React, { useState, useRef } from 'react';
import axios from 'axios'; // permet de gérer les fetch dans react
import { useNavigate } from 'react-router-dom';

const SignInForm = (props) => {
  //création de const usestate pour faire transiter des données danss le composant
  console.log(props);
  const email = useRef(null);
  const password = useRef(null);
  const [emailError, setEmailError] = useState(``);
  const [passwordError, setPasswordError] = useState(``);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const focusedEmail = email.current.value;
    const focusedPsw = password.current.value;
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_URL}api/auth/login`,
      withCredentials: true,
      data: {
        email: focusedEmail,
        password: focusedPsw,
      },
    })
      .then((res) => {
        console.log(res);
        props.logging();
      })
      .catch((res) => {
        console.log(res);
        setEmailError(res.response.data.emailError);
        setPasswordError(res.response.data.passwordError);
      });
  };

  return (
    <form
      action=""
      className="flex cl ai-center"
      onSubmit={handleLogin}
      id="sign-up-form"
    >
      <div className=" flex row ac-center">
        <div className="inputs-container flex cl ai-center">
          <br />
          <div>
            <label htmlFor="email">Email</label>
            <br />
            <input
              type="text"
              name="email"
              id="email"
              ref={email}
              placeholder="Email"
            />
          </div>

          {emailError && <div className="error">{emailError}</div>}
          <br />
          <div>
          <label htmlFor="password">Mot de passe</label>
          <br />
          <input
            type="password"
            name="password"
            id="password"
            ref={password}
            placeholder="Mot de passe"
          />
          </div>
          <br />
          {/* quand on change ce qui a dans l'input , on stock la valeur de l'input dans email et pareil pour password*/}
          {passwordError && <div className=" error">{passwordError}</div>}
          <br />
          <input type="submit" value="Se connecter" />
          <br />
        </div>
      </div>
    </form>
  );
};

export default SignInForm;
