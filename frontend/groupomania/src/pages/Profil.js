import UpdateProfil from '../components/Profil/UpdateProfil';
import Navbar from '../components/Navbar';
import UploadImage from '../components/Profil/UploadImage';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { HashLink } from 'react-router-hash-link';
//import { useLocation } from "react-router-dom";
const Profil = () => {
  const [userProfil, setUserProfil] = useState({});
  const [searchParams] = useSearchParams();

  const param = searchParams.get('user');
 console.log(param)
  useEffect(() => {
    const fetch = async () => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}api/auth/${param}`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          setUserProfil(res.data.docs);
        })
        .catch((res) => {
          console.log(res);
          setUserProfil(null);
        });
    };

    fetch();
  }, []);

  return (
    <div className="profil-page flex cl space-around">
      <>
        <main>
          <HashLink
            className="createPost-btn"
            smooth
          
            to="/#63e816be0a77b45831a578c2"
          >
            <i class="fa-solid fa-pencil"></i>
          </HashLink>
          <div>
            <div className="flex row space-around">
              <img src={userProfil.profilPicture} alt={` Profil de `} />
              <h1>Profil de {userProfil.pseudo} </h1>
              <UploadImage {...userProfil} />
            </div>
          </div>
          <div></div>
        </main>
        <div>
          <div>
            <h2>Biographie</h2>
          </div>
          <div>{userProfil.bio}</div>
        </div>
      </>
      <UpdateProfil></UpdateProfil>
    </div>
  );
};

export default Profil;
