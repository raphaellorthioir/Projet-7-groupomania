import React from 'react';


//import axios from'axios'
const Logout = () => {
  const logout = () => {
    localStorage.removeItem('userData');
    window.location = '/signing';
  };

  return (
    <div className="icon-logout" onClick={logout}>
      <i className="fa fa-sign-out" aria-hidden="true"></i>
    </div>
  );
};

export default Logout;
