import axios from 'axios';
import React, { useContext } from 'react';
import { UserContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';

const Logout = (props) => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const logout = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}api/auth/logout/${user.userId}`, {
        withCredentials: true,
      })
      .then(() => {
        props.exit();
        navigate('/signing');
      })
      .catch((err) => {
        console.log(err);
        navigate('/signing');
      });
  };

  return (
    <div className="icon-logout" onClick={logout}>
      <i className="fa fa-sign-out" aria-hidden="true"></i>
    </div>
  );
};

export default Logout;
