import React, { useState } from 'react';
import axios from 'axios'; // permet de gérer les fetch dans react
import { useNavigate } from 'react-router-dom';
const SignInForm = () => {
  //création de const usestate pour faire transiter des données danss le composant

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(``);
  const [passwordError, setPasswordError] = useState(``);
  const navigate = useNavigate();

  // Partie logique Login

  const handleLogin = (e) => {
    e.preventDefault(); //permet de ne pas recharger la page à la soumission du formulaire

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_URL}api/auth/login`,
      data: {
        email,
        password,
      },
    })
      .then(() => {
        navigate('/');
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
      <label htmlFor="email">Email</label>
      <br />
      <input
        type="text"
        name="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <div className="emailError">{emailError}</div>
      <br />
      <label htmlFor="password">Mot de passe</label>
      <input
        type="password"
        name="password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <br />
      {/* quand on change ce qui a dans l'input , on stock la valeur de l'input dans email et pareil pour password*/}
      <div className="passwordError">{passwordError}</div>
      <input type="submit" value="Se connecter" />
    </form>
  );
};

export default SignInForm;
