import React, { useContext } from 'react';
import { UserContext } from '../components/AppContext';
import { Navigate } from 'react-router-dom';
import UpdateProfil from '../components/Profil/UpdateProfil';

const Profil = () => {
  const user = useContext(UserContext); // on attrape la donnée du state de UserContext qu'on peut ensuite utilisée pour la page
  return (
    <div className="profil-page flex ai-center ac-center">

      
      {user ? <UpdateProfil/> : <Navigate to='/signing'/>     }
    </div>
  );
};

export default Profil;
