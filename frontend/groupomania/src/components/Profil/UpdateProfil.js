import axios from 'axios';
import React, { useContext, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { UserContext } from '../AppContext';

const UpdateProfil = (props) => {
  const user = useContext(UserContext);
  const formEdit = useRef();
  const formPassword = useRef();
  const [emailErrors, setEmailErrors] = useState();
  const [passwordErrors, setPasswordErrors] = useState();
  const [success, setSuccess] = useState({
    profil: '',
    password: '',
  });
  console.log(formPassword);

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
    console.log('edit');
    let bio;
    let pseudo;
    let email;
    if (formEdit.current[0].value) {
      bio = formEdit.current[0].value;
    }
    if (formEdit.current[1].value) {
      pseudo = formEdit.current[1].value;
    }
    if (formEdit.current[2].value) {
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
        setSuccess({
          profil: 'Votre profil a bien été modifié',
        });
        props.setProfil(res.data)
      })
      .catch((err) => {
        if (err.response.data.errors.email.kind === 'unique') {
          setEmailErrors('Cette email est utilisé par un autre utilisateur');
        }
      });
  };
  const changePassword = async (e) => {
    e.preventDefault();
    console.log(formPassword);
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
          console.log(res);
          setSuccess(true);
        })
        .catch((err) => {
          console.log(err);
          setPasswordErrors(
            'Votre mot de passe ne respecte pas les conditions ci dessus'
          );
        });
    } else setPasswordErrors('Les mots de passe ne correspondent pas');
  };
  return (
    <div className="edit-form">
      <div id='come-back'>
        <i onClick={()=>props.stopEdit()} class="fa-solid fa-arrow-left"></i> Profil
      </div>
      <div className="form-container">
        <h1> Modifier votre profil</h1>
        <form ref={formEdit} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="bio"> Biographie</label>
            <br />
            <br />
            <div className="textarea-box">
              <TextareaAutosize
                name="bio"
                id="bio"
                placeholder="Présentez vous ( 250 caractères maximum )"
                minLength={10}
                maxLength={250}
                minRows={10}
                maxRows={20}
                autoFocus
              >
                {props.bio}
              </TextareaAutosize>
            </div>
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
          />
          <span className="separate-line"></span>
          <div>
            <label htmlFor="email">
              Modifier votre email ("exemple@gmail,yahoo,outlook... (.com; .fr)
              ")
            </label>
            <br />
            <br />
            <div className="flex row ai-center">
              <input
                defaultValue={''}
                type="email"
                name="email"
                id="email"
                placeholder="Email"
              />
              {emailErrors && (
                <p style={{ marginLeft: '10px' }} className="error">
                  {emailErrors}
                </p>
              )}
            </div>
          </div>
          <br />
          <div className="flex row  ai-center">
            <label htmlFor="submit"></label>
            <input
              id="submit"
              name="submit"
              type="submit"
              className="validate"
              value={'Enregistrer'}
            ></input>
            {success && <p style={{ color: 'green' }}>{success.profil}</p>}
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
              />
              <div onClick={showPassword} className="view">
                <i class="fa-solid fa-eye"></i>
              </div>
            </div>
            <br />
            <div className=" flex cl sb">
              <div>
                <label htmlFor="confirm-password">Confirmer mot de passe</label>
                <br />
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="Confirmer mot de passe"
                />
              </div>
              {passwordErrors && <p className="error">{passwordErrors}</p>}
              {success && <p style={{ color: 'green' }}>{success.password}</p>}
              <div>
                <label htmlFor="sendPassword"></label>
                <button
                  onClick={changePassword}
                  type=""
                  className="sendPassword"
                >
                  Envoyer
                </button>
              </div>
            </div>

            <br />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfil;
