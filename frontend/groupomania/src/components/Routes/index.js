// Fichier pour les routes
import React, { useContext } from 'react';
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
import Navbar from '../Navbar';
import LougoutPage from '../../pages/LougoutPage';

const index = (props) => {
  return (
    <Router>
      {props.isLogged && <Navbar></Navbar>}

      <Routes>
        <Route
          path="/signing"
          element={<SignupLoginPage logging={props.logging} />}
        />
        <Route exact path="/" element={<Home />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/post" element={<Post />} />
        <Route
          path="/logout"
          element={<LougoutPage unlog={props.unlog} exit={props.exit} />}
        ></Route>
        <Route path="/error-page" element={<ErrorPage />} />
        <Route path="/redirect" element={<Navigate to="/error-page" />} />
      </Routes>
    </Router>
  );
};

export default index;
