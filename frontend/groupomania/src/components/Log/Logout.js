import axios from 'axios';
import React, { useContext } from 'react';
import { UserContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const logout = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}api/auth/logout/${user.userId}`, {
        withCredentials: true,
      })
      .then(() => {
        navigate('/logout');
      })
      .catch(() => {
        navigate('/logout');
      });
  };

  return (
    <div className="icon-logout" onClick={logout}>
      <i className="fa fa-sign-out" aria-hidden="true"></i>
    </div>
  );
};

export default Logout;
