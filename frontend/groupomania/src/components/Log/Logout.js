import axios from 'axios';
import React from 'react';

//import axios from'axios'
const Logout = () => {
  const logout = () => {
    axios.get(`${process.env.REACT_APP_API_URL}api/auth/logout`, {
      withCredentials: true,
    });
    window.location = '/signing';
  };

  return (
    <div className="icon-logout" onClick={logout}>
      <i className="fa fa-sign-out" aria-hidden="true"></i>
    </div>
  );
};

export default Logout;
