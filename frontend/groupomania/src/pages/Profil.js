import { useContext, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../components/AppContext';
import UpdateProfil from '../components/Profil/UpdateProfil';
import ReactModal from 'react-modal';

//import { useLocation } from "react-router-dom";
const Profil = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [userProfil, setUserProfil] = useState({});
  const [searchParams] = useSearchParams();
  const [isSettingProfil, setIsSettingProfil] = useState(false);
  const [profilImage, setProfilImage] = useState();
  const [isOpen, setIsOpen] = useState(false);
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
        .catch((err) => {
          if (err.response.status === 401) {
            navigate('/error-auth-page');
          }
          if (err.response.status === 500) {
            navigate('error-page');
          }
        });
    };
    fetch();
  }, [param]);

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
        setProfilImage(res.data.profilPicture);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate('/error-auth-page');
        }
        if (err.response.status === 500) {
          navigate('error-page');
        }
      });
  };

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
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const deleteUser = async () => {
    await axios
      .delete(`${process.env.REACT_APP_API_URL}api/auth/deleteUser/${param}`, {
        withCredentials: true,
      })
      .then(() => {
        navigate('/logout');
      });
  };
  return (
    <>
      {user ? (
        <main className=" profil-page">
          <section className="profil-container">
            {isSettingProfil ? (
              <UpdateProfil
                stopEdit={stopEdit}
                user={userProfil}
                setProfil={setProfil}
              />
            ) : (
              <>
                <div style={{ padding: '10px' }}>
                  <div className="flex cl space-around ">
                    <div className="flex row sb ai-center relative">
                      <div className="flex row space-around ai-center">
                        <img
                          className="profilPicture"
                          src={profilImage}
                          alt={` Profil de ${userProfil.pseudo} `}
                          style={{ width: '70px', height: '70px' }}
                        />
                        <h1> {userProfil.pseudo} </h1>
                        {user?.userId === userProfil._id && (
                          <>
                            <label className="photo-change " htmlFor="file">
                              <div className="camera-icon">
                                <i className="fa-solid fa-camera"></i>
                              </div>
                            </label>
                            <input
                              ref={image}
                              onChange={checkImage}
                              id="file"
                              type="file"
                              className="profil-picture-btn"
                              accept="image/.jpg image/.jpeg image/.png"
                            ></input>
                          </>
                        )}
                      </div>
                      {(user?.userId === userProfil._id || user?.isAdmin) && (
                        <div
                          onMouseLeave={hideList}
                          className="settings-icon flex cl ai-f-end"
                        >
                          <div>
                            <i
                              onClick={showList}
                              className="fa-solid fa-gear"
                            ></i>
                            <div ref={list} className="list-box">
                              <menu onMouseLeave={hideList}>
                                {(user?.userId === userProfil._id ||
                                  user.isAdmin) && (
                                  <>
                                    <li
                                      className="set-profil"
                                      onClick={() => setIsSettingProfil(true)}
                                    >
                                      Modifier Profil
                                    </li>
                                    <li onClick={openModal} id="delete-profil">
                                      Supprimer mon compte
                                    </li>
                                  </>
                                )}
                              </menu>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <time>Inscrit depuis le {createDate}</time>
                  </div>
                  <h2>Biographie</h2>
                  <p
                    style={{
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-words',
                    }}
                  >
                    {userProfil.bio}
                  </p>
                </div>
              </>
            )}
          </section>

          <ReactModal
            isOpen={isOpen}
            className="modal"
            contentLabel="Voulez vous..."
            overlayClassName="overlay"
            onRequestClose={closeModal}
          >
            <div className="modal-container ">
              <div className=" content  ">
                <div className="modal-ask">Supprimer votre compte ?</div>
                <div className="flex row btn-box ">
                  <button onClick={deleteUser} className="yes">
                    Oui
                  </button>
                  <button onClick={closeModal} className="no">
                    Non
                  </button>
                </div>
              </div>
            </div>
          </ReactModal>
        </main>
      ) : (
        <Navigate to="/signing" />
      )}
    </>
  );
};

export default Profil;
