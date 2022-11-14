import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const SignUpForm = () => {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [controlPassword, setControlPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const pseudoError = document.querySelector('.errorPseudo');
    const emailError = document.querySelector('.errorEmail');
    const passwordErrors = document.querySelector('.passwordErrors');
    const passwordConfirmError = document.querySelector(
      '.passwordConfirmError'
    );
    const ulPasswordErrors = document.querySelector('#passwordErrorsList');

    pseudoError.innerHTML = '';
    emailError.innerHTML = '';
    passwordConfirmError.innerHTML = '';

    if (ulPasswordErrors) {
      ulPasswordErrors.remove();
    }

    if (password !== controlPassword) {
      passwordConfirmError.innerHTML = 'Les mots de passe ne correspondent pas';
    } else {
      axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}api/auth/signup`,
        data: {
          pseudo,
          email,
          password,
        },
      })
        .then((res) => {
          const userData = {
            userId: res.data.user._id,
            isAdmin: res.data.user.isAdmin,
            token: res.data.token,
          };

          console.log(userData);

          localStorage.setItem('userData', JSON.stringify(userData));
          navigate('/');
        })
        .catch((res) => {
          console.log(res);
          if (res.response.data.error) {
            if (res.response.data.error.errors.pseudo) {
              pseudoError.innerHTML = 'Ce pseudo est déjà pris';
            }
            if (res.response.data.error.errors.email) {
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
          }
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
        onChange={(e) => setPseudo(e.target.value)}
        value={pseudo}
      />
      <div className=" error errorPseudo"></div>
      <label htmlFor="email">Email</label>
      <br />
      <input
        type="email"
        name="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <div className=" error errorEmail"></div>
      <label htmlFor="password">Mot de passe</label>
      <br />
      <input
        type="password"
        name="password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <div className=" error passwordErrors"></div>
      <label htmlFor="password-conf">Confirmer mot de passe</label>
      <br />
      <input
        type="password"
        name="password-conf"
        id="password-conf"
        onChange={(e) => setControlPassword(e.target.value)}
        value={controlPassword}
      />
      <div className="error passwordConfirmError"></div>
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
