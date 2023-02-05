// Fichier pour les routes
import React from 'react';
import {
  BrowserRouter as Router,
  Route, // permet de définir le chemin vers une puage
  Routes,
  Navigate,
  // appartient à react-router-dom : permet de rediriger vers une page si toutes les autres non pas réussi à se charger
} from 'react-router-dom';

import Home from '../../pages/Home';
import Profil from '../../pages/Profil';
import ErrorPage from '../../pages/ErrorPage';
import SignupLoginPage from '../../pages/SignupLoginPage';
import Post from '../../pages/Post';


const index = () => {
  return (
    <Router>
      
      <Routes>
        {/* Permet d'y insérer toutes les Route d'affichage des components */}
        <Route path="/signing" element={<SignupLoginPage />} />
        <Route exact path="/" element={<Home />} />
        <Route path="/profil" element={<Profil />} />
        <Route path='/post' element={<Post/>}/>
        <Route path="/error-page" element={<ErrorPage />} />
        <Route path="/redirect" element={<Navigate to="/error-page" />} />
        {/*Permet de rediriger vers une autre page si toutes les autres ont échoué  */}
      </Routes>
    </Router>
  );
};

export default index;
