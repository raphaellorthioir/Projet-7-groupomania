import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './components/AppContext.js';
import Routes from './components/Routes/index.js';
import Navbar from './components/Navbar.js';

const App = () => {
  const [userData, setUserData] = useState(null);
  const [id, setId] = useState(null);
  const [isLogged, setIsLogged] = useState();

  const logging = async () => {
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
        setIsLogged(true);
      })
      .catch((err) => {
        console.log(err);
        setUserData(null);
        setId(null);
      });
  };
  useEffect(() => {
    logging();
  }, [id]);

  const exit = () => {
    setId(null);
    setUserData(null);
    setIsLogged(false);
  };

  // A chaque fois que user évolue , ça relance la fonction useEffect
  return (
    <UserContext.Provider value={userData}>
      {/*Garde en mémoire 'hook' les données du user , ces données seront transmissibles à tout les components enfants , ici Routes */}

      <Routes exit={exit} logging={logging} isLogged={isLogged} />
    </UserContext.Provider>
  );
};

export default App;
