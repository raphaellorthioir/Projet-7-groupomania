//import React, { useState } from 'react';
import Navbar from '../Navbar';

const UpdateProfil = () => {
  //const [userProfil, setUserProfil] = useState(); // state qui permettre d'utiliser les infos de l'utilisateur
  
  return (
    <div>
      <Navbar />
      <div className="flex row space-around ">
        <div>
          <div className="flex row space-around">
            <img src="*" alt={` Profil de `} />
            <h1>Profil de </h1>
            <button></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfil;
