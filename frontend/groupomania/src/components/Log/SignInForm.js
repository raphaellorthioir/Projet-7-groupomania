import React, { useState, useRef } from 'react';
import axios from 'axios'; // permet de gérer les fetch dans react

const SignInForm = (props) => {
  const email = useRef(null);
  const password = useRef(null);
  const [emailError, setEmailError] = useState(``);
  const [passwordError, setPasswordError] = useState(``);

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
      .then(() => {
        props.logging();
      })
      .catch((err) => {
        setEmailError(err.response.data.emailError);
        setPasswordError(err.response.data.passwordError);
      });
  };
  const showPassword = () => {
    let result = password.current.type;
    if (result === 'text') {
      password.current.type = 'password';
    } else password.current.type = 'text';
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
            <div className="password">
              <input
                type="password"
                name="password"
                id="password"
                ref={password}
                placeholder="Mot de passe"
              />
              <div onClick={showPassword} className="view">
                <i class="fa-solid fa-eye"></i>
              </div>
            </div>
          </div>
          <br />
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
