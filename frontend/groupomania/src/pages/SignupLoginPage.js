import React, { useContext } from 'react';
import Log from '../components/Log/index';
import { UserContext } from '../components/AppContext';
import { Navigate } from 'react-router-dom';
const SignupLoginPage = () => {
  const user = useContext(UserContext);
  return (
    <div className="profil-page flex ai-center ac-center">
      {user ? <Navigate to="/" /> : <Log />}
    </div>
  );
};

export default SignupLoginPage;
