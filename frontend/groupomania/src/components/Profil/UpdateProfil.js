import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { UserContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';

const UpdateProfil = (props) => {
  const user = useContext(UserContext);
  const formEdit = useRef();
  const formPassword = useRef();
  const [pseudoErrors, setPseudoErrors] = useState();
  const [errorMessageEmail, setErrorMessageEmail] = useState();
  const [emailErrors, setEmailErrors] = useState();
  const [passwordErrors, setPasswordErrors] = useState();
  const [success, setSuccess] = useState({
    pseudo: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const showPassword = () => {
    let result = formPassword.current.elements.password.type;
    if (result === 'text') {
      formPassword.current.elements.password.type = 'password';
    } else formPassword.current.elements.password.type = 'text';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setEmailErrors(null);
    let bio;
    let pseudo;
    let email;
    if (
      formEdit.current[0].value !== formEdit.current[0].innerHTML &&
      formEdit.current[0].value
    ) {
      bio = formEdit.current[0].value;
    }
    if (
      formEdit.current[1].value !== formEdit.current[1].defaultValue &&
      formEdit.current[1].value
    ) {
      pseudo = formEdit.current[1].value;
    }
    if (
      formEdit.current[2].value !== formEdit.current[2].defaultValue &&
      formEdit.current[2].value
    ) {
      email = formEdit.current[2].value;
    }
    await axios
      .put(
        `${process.env.REACT_APP_API_URL}api/auth/updateUserProfil/${user.userId} `,
        {
          bio: bio,
          pseudo: pseudo,
          email: email,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        if (bio || pseudo || email) {
          if (bio && pseudo && email) {
            setSuccess({
              bio: 'Votre biographie à été modifiée',
              pseudo: 'Votre pseudo a bien été modifié.',
              email: 'Votre email a bien été modfié.',
            });
          } else if (bio && pseudo) {
            setSuccess({
              bio: 'Votre biographie a été modifiée',
              pseudo: 'Votre pseudo a bien été modifié.',
            });
          } else if (bio && email) {
            setSuccess({
              bio: 'Votre biographie a été modifiée',
              email: 'Votre email a bien été modfié.',
            });
          } else if (pseudo && email) {
            setSuccess({
              pseudo: 'Votre pseudo a bien été modifié.',
              email: 'Votre email a bien été modfié.',
            });
          } else if (bio) {
            setSuccess({
              bio: 'Votre biographie a été modifiée',
            });
          } else if (email) {
            setSuccess({ email: 'Votre email a bien été modfié.' });
          } else if (pseudo) {
            setSuccess({ pseudo: 'Votre pseudo a bien été modifié.' });
          }
        }
        props.setProfil(res.data);
        formEdit.current.reset();
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            navigate('/error-auth-page');
          }
          if (err.response.status === 500 && err.response.data.errors.pseudo) {
            setPseudoErrors('Ce pseudonyme est déjà pris.');
          }
          if (
            err.response.status === 500 &&
            err.response.data.errors.email.kind
          ) {
            setEmailErrors('Cet email est lié à un compte existant.');
          }
          if (err.response.status === 400 && err.response.data.emailError) {
            setErrorMessageEmail([err.response.data.emailError]);
            setEmailErrors([
              err.response.data.exempleEmail.exemple1,
              err.response.data.exempleEmail.exemple2,
            ]);
          }
        }
      });
  };
  const changePassword = async (e) => {
    e.preventDefault();
    setPasswordErrors(null);
    setSuccess(false);
    let password = formPassword.current[0].value;
    let confirmPassword = formPassword.current[1].value;
    if (password === confirmPassword) {
      await axios
        .put(
          `${process.env.REACT_APP_API_URL}api/auth/changePassword/${user.userId} `,
          {
            password: password,
          },
          { withCredentials: true }
        )
        .then((res) => {
          setSuccess({ password: 'Votre mot de passe a bien été modifié.' });
        })
        .catch((err) => {
          if (err.response.status === 400) {
            setPasswordErrors(
              'Votre mot de passe ne respecte pas les conditions ci dessus'
            );
          }
          if (err.response.status === 401) {
            navigate('/error-auth-page');
          }
          if (err.response.status === 500) {
            navigate('/error-page');
          }
        });
    } else setPasswordErrors('Les mots de passe ne correspondent pas');
  };

  const clear = () => {
    if (pseudoErrors) {
      setPseudoErrors(null);
    }
    if (emailErrors) {
      setEmailErrors(null);
    }
    if (passwordErrors) {
      setPasswordErrors(null);
    }
    if (success) {
      setSuccess(null);
    }
    if (errorMessageEmail) {
      setErrorMessageEmail(null);
    }
  };
  return (
    <div className="edit-form">
      <div id="come-back">
        <i onClick={() => props.stopEdit()} class="fa-solid fa-arrow-left"></i>{' '}
        Profil
      </div>
      <div className="form-container">
        <h1> Modifier votre profil</h1>
        <form ref={formEdit} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="bio">Biographie</label>
            <br />
            <br />
            <div className="textarea-box">
              <TextareaAutosize
                name="bio"
                id="bio"
                placeholder="Présentez vous ( 1000 caractères maximum )"
                minLength={1}
                maxLength={1000}
                minRows={10}
                maxRows={20}
                autoFocus
                defaultValue={props.user.bio}
                spellcheck="false"
              ></TextareaAutosize>
            </div>
            {success && <p className="success">{success.bio}</p>}
          </div>
          <span className="separate-line"></span>
          <label htmlFor="pseudo">
            Modifier votre Pseudo ( 20 caractères maximum )
          </label>
          <br />
          <br />
          <input
            type="text"
            name="pseudo"
            id="pseudo"
            maxLength={20}
            placeholder="Nouveau Pseudo"
            defaultValue={props.user.pseudo}
            onChange={clear}
          />
          {success && <p className="success">{success.pseudo}</p>}
          {pseudoErrors && <p className="error"> {pseudoErrors}</p>}
          <span className="separate-line"></span>
          <div>
            <label htmlFor="email">
              Modifier votre email ("exemple@gmail,yahoo,outlook... (.com; .fr)
              ")
            </label>
            <br />
            <br />
            <input
              defaultValue={props.user.email}
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={clear}
            />
            {success && <p className="success">{success.email}</p>}
            {emailErrors && !errorMessageEmail && (
              <p style={{ marginLeft: '10px' }} className="error">
                {emailErrors}
              </p>
            )}
            {errorMessageEmail && (
              <div style={{ textAlign: 'justify', marginTop: '10px' }}>
                <div className="error error-text">{errorMessageEmail}</div>
                <br />
                <div className=" error error-text">
                  exemple 1 : {emailErrors[0]}
                </div>
                <div className=" error error-text">
                  exemple 2 : {emailErrors[1]}
                </div>
              </div>
            )}
          </div>
          <br />
          <div className="flex row sb ai-center">
            <div>
              <label htmlFor="submit"></label>
              <input
                id="submit"
                name="submit"
                type="submit"
                value={'Enregistrer'}
              ></input>
            </div>
            <br />
            <br />
            <div>
              {success && (
                <p style={{ color: 'green', marginRight: '20px' }}>
                  {success.profil}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
      <div className="form-container">
        <form ref={formPassword} action="" onSubmit={changePassword}>
          <div className="password-container">
            <label htmlFor="password"> Modifier votre mot de passe</label>
            <br />
            <br />
            <ul>
              <li>* Minimum de 8 caractères</li>
              <li>
                * Doit contenir obligatoirement au minimum une majusucle et deux
                chiffres
              </li>
              <li>* Exemple :"Dupont42"</li>
            </ul>
            <br />

            <div className="password">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Mot de passe"
                autoComplete="on"
                onChange={clear}
              />
              <div onClick={showPassword} className="view">
                <i className="fa-solid fa-eye"></i>
              </div>
            </div>
            <br />
            <div className=" flex cl sb">
              <div>
                <label htmlFor="confirm-password">Confirmer mot de passe</label>
                <br />
                <br />
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="Confirmer mot de passe"
                  onChange={clear}
                />
              </div>
              {passwordErrors && <p className="error">{passwordErrors}</p>}
              {success && <p className="success">{success.password}</p>}
              <br />
              <div>
                <label htmlFor="sendPassword"></label>
                <input
                  onClick={changePassword}
                  type="submit"
                  value={'Envoyer'}
                ></input>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfil;
