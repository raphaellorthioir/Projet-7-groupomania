import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './components/AppContext.js';
import Routes from './components/Routes/index.js';

const App = () => {
  // const [uID, setUID] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  /* useEffect permet de créer une fonction qui s'éxécutera si la donnée présente en elle se modifie après chaque affichage du composant, ici App. */

  useEffect(() => {
    const fetchUserData = async () => {
      const storage = JSON.parse(localStorage.getItem('userData'));
      const token = `${storage.token}`;
      const id = storage.userId;
      await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}api/auth/${id}`,
        headers: {
          Authorization: `Basic ${token}`,
        },
      })
        .then((res) => {
          setUserData({
            userId: res.data.docs._id,
            isAdmin: res.data.docs.isAdmin,
            token: token,
          });
          setUserId(res.data.docs._id);
        })
        .catch(() => {
          setUserData(null);
          console.log('User not found');
        });
        console.log(userId)
    };
    fetchUserData();
   
  }, [userId]);

  // A chaque fois que user évolue , ça relance la fonction useEffect
  return (
    <UserContext.Provider value={userData}>
      {/*Garde en mémoire 'hook' les données du user , ces données seront transmissibles à tout les components enfants , ici Routes */}
      <Routes />
    </UserContext.Provider>
  );
};

export default App;
