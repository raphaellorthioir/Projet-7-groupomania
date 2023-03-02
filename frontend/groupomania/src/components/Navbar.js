import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from './AppContext';
import Logout from './Log/Logout';
const Navbar = () => {
  const user = useContext(UserContext);

  return (
    <header id="header">
      <nav>
        <div className=" nav-container flex sb">
          <div className="flex ai-center">
            <NavLink to="/">
              <div className=" flex ai-center">
                <img
                  src={require('../images/icon-left-font.-navbar (2).png')}
                  alt="icon"
                />
              </div>
            </NavLink>
          </div>
          <div className=" profil-container flex fe ai-center ac-center">
            <NavLink
              to={{
                pathname: '/',
              }}
            >
              <i className="fa-solid fa-house"></i>
            </NavLink>
            <NavLink
              to={{
                pathname: '/profil',
                search: `?user=${user?.userId}`,
              }}
            >
              <i className="fa-regular fa-user"></i>
            </NavLink>
            <Logout></Logout>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
