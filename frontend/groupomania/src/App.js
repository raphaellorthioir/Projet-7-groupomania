import React, { useEffect, useState } from 'react';
import { UserContext } from './components/AppContext.js';
import Routes from './components/Routes/index.js';

const App = () => {
  const [user, setUser] = useState(null);
  
  /* useEffect permet de créer une fonction qui s'éxécutera si la donnée présente en elle se modifie après chaque affichage du composant, ici App. */
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
     setUser(userData);
  }, []); // A chaque fois que user évolue , ça relance la fonction useEffect
  return (
    <div>
      <UserContext.Provider value={user}>{/*Garde en mémoire 'hook' les données du user , ces données seront transmissibles à tout les components enfants , ici Routes */}
        <Routes />
      </UserContext.Provider>
    </div>
  );
};

export default App;
