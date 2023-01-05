import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './components/AppContext.js';
import Routes from './components/Routes/index.js';

const App = () => {
  // const [uID, setUID] = useState(null);

  const [userData, setUserData] = useState(null);

  /* useEffect permet de créer une fonction qui s'éxécutera si la donnée présente en elle se modifie après chaque affichage du composant, ici App. */

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem('userData'));
    const fetchData = async () => {
      await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}api/auth/${storage.userId}`,
        headers: {
          Authorization: `Basic ${storage.token}`,
        },
      })
        .then((res) => {
          const data = res.data.docs;
          setUserData({
            userId: data._id,
            pseudo: data.pseudo,
            followers: data.followers,
            follwing: data.following,
            profilPicture: data.profilPicture,
            isAdmin: data.isAdmin,
            token: storage.token,
          });
        })
        .catch(() => {
          localStorage.removeItem("userData")
          setUserData(null)
          console.log('User not found');
        });
    };
    fetchData();
  }, []);

  // A chaque fois que user évolue , ça relance la fonction useEffect
  return (
    <UserContext.Provider value={userData}>
      {/*Garde en mémoire 'hook' les données du user , ces données seront transmissibles à tout les components enfants , ici Routes */}
      <Routes />
    </UserContext.Provider>
  );
};

export default App;
