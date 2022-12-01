//import React, { useContext } from 'react';
//import { UserContext } from '../components/AppContext';
//import Log from '../components/Log';
//import { Navigate } from 'react-router-dom';

const Profil = () => {
  //const user = useContext(UserContext); // on attrape la donnée du state de UserContext qu'on peut ensuite utilisée pour la page
  return (
    <div className="profil-page flex ai-center ac-center">

      Page profil
      {/*{user ? <Navigate to="/"/> : <Log />}*/}
    </div>
  );
};

export default Profil;
