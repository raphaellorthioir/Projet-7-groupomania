import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
          console.log(err);
          navigate('/logout');
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
      .then((res) => {
        navigate('/logout');
      });
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
                            <i className="fa-solid fa-camera"></i>
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
                  {(user?.userId === userProfil._id || user?.isAdmin) && (
                    <div className="settings-icon flex cl ai-f-end">
                      <div>
                        <i onClick={showList} className="fa-solid fa-gear"></i>
                        <div ref={list} className="list-box">
                          <ul onMouseLeave={hideList}>
                            {user?.userId === userProfil._id && (
                              <li
                                className="set-profil"
                                onClick={() => setIsSettingProfil(true)}
                              >
                                Modifier Profil
                              </li>
                            )}
                            {(user?.userId === userProfil._id ||
                              user.isAdmin) && (
                              <li onClick={openModal} id="delete-profil">
                                Supprimer compte
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <p>Inscrit depuis le {createDate}</p>
              </div>
              <h2>Biographie</h2>
              <p style={{ whiteSpace: 'pre' }}>{userProfil.bio}</p>
            </>
          )}
          <ReactModal
            isOpen={isOpen}
            className="modal"
            contentLabel="Voulez vous..."
            overlayClassName="overlay"
            onRequestClose={closeModal}
          >
            <div className="modal-container ">
              <div className=" modal-box  ">
                <div className="modal-ask">Supprimer votre compte ?</div>
                <div className="flex row btn-box ">
                  <button
                    style={{ backgroundColor: 'red' }}
                    onClick={deleteUser}
                    className="yes"
                  >
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
        <div></div>
      )}
    </>
  );
};

export default Profil;
