import React, { useContext } from 'react';
import { UserContext } from '../components/AppContext';
import Log from '../components/Log';

const Profil = () => {
  const user = useContext(UserContext); // on attrape la donnée du state de UserContext qu'on peut ensuite utilisée pour la page
  return (
    <div className="profil-page flex ai-center ac-center">
      {user ? <h1>Update Page</h1> : <Log />}
    </div>
  );
};

export default Profil;
