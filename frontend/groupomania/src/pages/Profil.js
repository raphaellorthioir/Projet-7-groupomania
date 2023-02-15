import { useContext, useEffect, useRef, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';
import { UserContext } from '../components/AppContext';
//import { useLocation } from "react-router-dom";
const Profil = () => {
  const user = useContext(UserContext);
  const [userProfil, setUserProfil] = useState({});
  const [searchParams] = useSearchParams();
  const [isSettingProfil, setIsSettingProfil] = useState(false);
  const [profilImage, setProfilImage] = useState();
  const image = useRef();
  const form = useRef();
  const param = searchParams.get('user');
  console.log(param);
  useEffect(() => {
    const fetch = async () => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}api/auth/${param}`, {
          withCredentials: true,
        })
        .then((res) => {
          setUserProfil(res.data.docs);
          setProfilImage(res.data.docs.profilPicture);
        })
        .catch((res) => {
          console.log(res);
          setUserProfil(null);
        });
    };

    fetch();
  }, []);

  const fetchProfilImage = () => {
    const data = new FormData();
    data.append('image', image.current.files[0]);
    axios
      .put(
        `${process.env.REACT_APP_API_URL}api/auth/uploadImgProfil/${userProfil._id}`,
        data,
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  // Date

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: 'numeric',
  };
  const createDate = new Date(userProfil.createdAt).toLocaleDateString(
    'fr-FR',
    options
  );
  const checkImage = () => {
    const files = image.current.files[0];
    const newImg = URL.createObjectURL(files);
    setProfilImage(newImg);
    fetchProfilImage();
  };
  const handleSubmit = () => {};

  return (
    <>
      {user ? (
        <main className="flex cl profil-page">
          <div className="flex cl space-around ">
            <div
              style={{ marginTop: '15px' }}
              className="flex row fs ai-center"
            >
              <img
                className="profilPicture"
                src={profilImage}
                alt={` Profil de `}
                style={{ width: '70px', height: '70px' }}
              />
              <h1> {userProfil.pseudo} </h1>
              {user.userId === userProfil._id && (
                <>
                  <label className="photo-change " htmlFor="file">
                    <div className="camera-icon">
                      <i class="fa-solid fa-camera"></i>
                    </div>
                  </label>
                  <input
                    ref={image}
                    onChange={checkImage}
                    id="file"
                    type="file"
                    className="profil-picture-btn"
                  ></input>
                </>
              )}
            </div>
            <p>Inscrit depuis le {createDate}</p>
          </div>
          <div>
            <h2>Biographie</h2>
            {isSettingProfil && (
              <div className="textarea-box">
                <TextareaAutosize
                  name="bio"
                  id="bio"
                  className="textArea"
                  placeholder="Votre biographie"
                  minLength={10}
                  maxLength={250}
                  minRows={10}
                  maxRows={20}
                  autoFocus
                  defaultValue={userProfil.bio}
                >
                  {' '}
                </TextareaAutosize>
              </div>
            )}
            <p>{userProfil.bio}</p>
          </div>
          {isSettingProfil && (
            <form onSubmit={handleSubmit} ref={form}>
              <label htmlFor="email">Modifier votre email</label>
              <br />
              <div className="flex row ai-center">
                <input type="email" name="email" id="email" />
                <button className="send-btn"> Envoyer</button>
              </div>

              <br />
              <label htmlFor="password"> Modifier votre mot de passe</label>
              <br />
              <div className="flex row ai-center">
                <input type="password" name="password" id="password" />
                <button className="send-btn"> Envoyer</button>
              </div>
            </form>
          )}

          {isSettingProfil ? (
            <button className="validate"> Enregistrer</button>
          ) : (
            <div className="flex row space-around setting-btn">
              <button
                onClick={() => setIsSettingProfil(true)}
                title="Modifier profil"
              >
                Modifier Profil
              </button>
              <button className="delete-profil-btn">
                Supprimer mon compte
              </button>
            </div>
          )}
        </main>
      ) : (
        <Navigate to="/logout" />
      )}
    </>
  );
};

export default Profil;
