import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from './AppContext';
import Logout from './Log/Logout';
const Navbar = () => {
  
  const user = useContext(UserContext);

  return (
    <header id='header'>
      <nav>
        <div className=" nav-container flex sb">
          <div className="logo">
            <NavLink to="/">
              <div className="logo-container flex space-around ai-center ac-center">
                <img
                  src={require('../images/icon-left-font-monochrome-black.png')}
                  alt="icon"
                />
              </div>
            </NavLink>
          </div>
          <div className=" profil-container flex space-around ai-center ac-center">
            <NavLink
              to={{
                pathname: '/profil',
                search: `?user=${user?.userId}`,
              }}
            >
              <i className="fa-regular fa-user logo-profil"></i>
            </NavLink>
            <Logout></Logout>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
