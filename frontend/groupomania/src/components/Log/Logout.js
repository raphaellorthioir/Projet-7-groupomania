import axios from 'axios';
import React, { useContext } from 'react';
import { UserContext } from '../AppContext';
//import axios from'axios'
const Logout = () => {
  const user = useContext(UserContext)
  const logout = () => {
    axios.get(`${process.env.REACT_APP_API_URL}api/auth/logout/${user.userId}`, {
      withCredentials: true,
    });
    window.location='/'
  };

  return (
    <div className="icon-logout" onClick={logout}>
      <i className="fa fa-sign-out" aria-hidden="true"></i>
    </div>
  );
};

export default Logout;
