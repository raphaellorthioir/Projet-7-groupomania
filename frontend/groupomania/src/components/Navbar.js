import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from './AppContext';
import Logout from './Log/Logout';
const Navbar = () => {
  const user = useContext(UserContext);

  const [userInfo, setUserInfo] = useState({
    pseudo: '',
    profilPicture: '',
  });

  useEffect(() => {
    const id = user.userId;
    const token = user.token;
    const getUser = () => {
      axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}api/auth/${id}`,
        headers: {
          Authorization: `Basic ${token}`,
        },
      })
        .then((res) => {
          setUserInfo({
            pseudo: res.data.docs.pseudo,
            profilPicture: res.data.docs.profilPicture,
          });
        })
        .catch((res) => {
          console.log(res);
        });
    };
    getUser();
  });

  return (
    <nav>
      <div className=" nav-container flex sb">
        <div className="logo">
          <NavLink to="/">
            <div className="logo-container flex space-around ai-center ac-center">
              <img src="./img/icon.png" alt="icon" />
              <h3>Groupomania</h3>
            </div>
          </NavLink>
        </div>
        <div className=" profil-container flex space-around ai-center ac-center">
          <NavLink to="/profil">
            <div className="flex sb ai-center ac-center">
              <img src={userInfo.profilPicture} alt="profil" />
              <div>{userInfo.pseudo}</div>
            </div>
          </NavLink>
          
            
            <Logout></Logout>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
