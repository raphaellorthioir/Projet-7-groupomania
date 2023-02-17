import { useContext, useEffect, useRef, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../components/AppContext';
import UpdateProfil from '../components/Profil/UpdateProfil';

//import { useLocation } from "react-router-dom";
const Profil = () => {
  const user = useContext(UserContext);
  const [userProfil, setUserProfil] = useState({});
  const [searchParams] = useSearchParams();
  const [isSettingProfil, setIsSettingProfil] = useState(false);
  const [profilImage, setProfilImage] = useState();
  const image = useRef();
  const list = useRef();
  const param = searchParams.get('user');
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

  const showList = () => {
    list.current.style.display = 'block';
  };
  const hideList = () => {
    list.current.style.display = 'none';
  };
  const stopEdit = () => {
    setIsSettingProfil(false);
  };
  const setProfil = (data) => {
    setUserProfil(data);
  };

  return (
    <>
      {user ? (
        <main className="flex cl profil-page">
          {isSettingProfil ? (
            <UpdateProfil
              stopEdit={stopEdit}
              bio={userProfil.bio}
              setProfil={setProfil}
            />
          ) : (
            <>
              <div className="flex cl space-around ">
                <div className="flex row sb ai-center">
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
                    {user?.userId === userProfil._id && (
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
                          accept="image/.jpg imgae/.jpeg image/.png"
                        ></input>
                      </>
                    )}
                  </div>
                  <div className="settings-icon flex cl ai-f-end">
                    <div>
                      <i onClick={showList} class="fa-solid fa-gear"></i>
                      <div ref={list} className="list-box">
                        <ul onMouseLeave={hideList}>
                          <li
                            class="set-profil"
                            onClick={() => setIsSettingProfil(true)}
                          >
                            Modifier Profil
                          </li>
                          <li id="delete-profil">Supprimer compte</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <p>Inscrit depuis le {createDate}</p>
              </div>
              <h2>Biographie</h2>
              <p style={{ whiteSpace: 'pre' }}>{userProfil.bio}</p>
            </>
          )}
        </main>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Profil;
