import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import UploadImage from './UploadImage';

const UpdateProfil = () => {
  const [userProfil, setUserProfil] = useState({}); // state qui permettre d'utiliser les infos de l'utilisateur
  const location = useLocation();
  const param = new URLSearchParams(location.search).get('user');

  useEffect(() => {
    const fetch = async () => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}api/auth/${param}`, {
          withCredentials: true,
        })
        .then((res) => {
          setUserProfil(res.data.docs);
        })
        .catch((res) => {
          console.log(res);
          setUserProfil(null);
        });
    };

    fetch();
  }, [param]);

  return (
    <>
      <div className="flex cl ">
        <div className="flex row space-around">
          <img src={userProfil.profilPicture} alt={` Profil de `} />
          <h1>Profil de {userProfil.pseudo} </h1>
          <UploadImage {...userProfil} />
        </div>
      </div>
      <div>
        <div>
          <h2>Biographie</h2>
        </div>
        <div>{userProfil.bio}</div>
      </div>
    </>
  );
};

export default UpdateProfil;
