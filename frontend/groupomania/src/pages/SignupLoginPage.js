import React, { useContext } from 'react';
import Log from '../components/Log/index';
import { UserContext } from '../components/AppContext';
import { Navigate } from 'react-router-dom';
const SignupLoginPage = (props) => {
  const user = useContext(UserContext);

  return (
    <main className='signing-page flex cl ac-center' >
      {user ? <Navigate to="/" /> : <Log logging={props} />}
    </main>
  );
};

export default SignupLoginPage;
