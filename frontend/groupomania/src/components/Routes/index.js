// Fichier pour les routes
import {
  BrowserRouter as Router,
  Route, // permet de définir le chemin vers une puage
  Routes,
  Navigate,
  // appartient à react-router-dom : permet de rediriger vers une page si toutes les autres non pas réussi à se charger
} from 'react-router-dom';

import Home from '../../pages/Home';
import Profil from '../../pages/Profil';
import ErrorAuthPage from '../../pages/ErrorAuthPage';
import SignupLoginPage from '../../pages/SignupLoginPage';
import Navbar from '../Navbar';
import LougoutPage from '../../pages/LougoutPage';
import ErrorPage from '../../pages/ErrorPage';

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
        <Route
          path="/logout"
          element={<LougoutPage unlog={props.unlog} exit={props.exit} />}
        ></Route>
        <Route
          path="/error-auth-page"
          element={<ErrorAuthPage unlog={props.unlog} exit={props.exit} />}
        />
        <Route
          path="/error-page"
          element={<ErrorPage unlog={props.unlog} exit={props.exit} />}
        ></Route>
        <Route path="/redirect" element={<Navigate to="/error-page" />} />
      </Routes>
    </Router>
  );
};

export default index;
