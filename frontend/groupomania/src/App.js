import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './components/AppContext.js';
import Routes from './components/Routes/index.js';

const App = () => {
  const [userData, setUserData] = useState(null);
  const [isLogged, setIsLogged] = useState();

  const logging = async () => {
    await axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}jwt`,
      withCredentials: true,
    })
      .then((res) => {
        setUserData({
          userId: res.data._id,
          isAdmin: res.data.isAdmin,
        });
        setIsLogged(true);
      })
      .catch((err) => {
        console.log(err);
        setUserData(null);
      });
  };
  useEffect(() => {
    logging();
  }, []);

  const exit = () => {
    setUserData(null);
  };
  const unlog = () => {
    setIsLogged(false);
  };
  // A chaque fois que user évolue , ça relance la fonction useEffect
  return (
    <UserContext.Provider value={userData}>
      {/*Garde en mémoire 'hook' les données du user , ces données seront transmissibles à tout les components enfants , ici Routes */}

      <Routes exit={exit} unlog={unlog} isLogged={isLogged} logging={logging} />
    </UserContext.Provider>
  );
};

export default App;
