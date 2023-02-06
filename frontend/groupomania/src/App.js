import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './components/AppContext.js';
import Routes from './components/Routes/index.js';

const App = () => {
  const [userData, setUserData] = useState(null);
  const [id, setId] = useState(null);
  /* useEffect permet de créer une fonction qui s'éxécutera si la donnée présente en elle se modifie après chaque affichage du composant, ici App. */
  useEffect(() => {
    /* useEffect se déclenche à chaque rerendu , si la dépandence change lors d'un re-rendu alors useEffect exécutera  */
    const fetch = async () => {
      await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}jwt`,
        withCredentials: true,
      })
        .then((res) => {
          setUserData({
            userId: res.data.userId,
            isAdmin: res.data.isAdmin,
            pseudo: res.data.pseudo,
            profilPicture: res.data.profilPicture,
          });
          setId(res.data.userId);
         
        })
        .catch((err) => {
          setUserData(null);
          console.log(err);
        });
    };

    fetch();
  }, [id]);

  // A chaque fois que user évolue , ça relance la fonction useEffect
  return (
   <div id='app'>
      <UserContext.Provider value={userData} >
      {/*Garde en mémoire 'hook' les données du user , ces données seront transmissibles à tout les components enfants , ici Routes */}
      
      <Routes />
      
      
    </UserContext.Provider>
   </div>
     
   
  );
};

export default App;
