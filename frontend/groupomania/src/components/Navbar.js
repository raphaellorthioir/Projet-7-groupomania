import React, { useContext} from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from './AppContext';
import Logout from './Log/Logout';
const Navbar = () => {
  const user = useContext(UserContext);
 
  return (
    <nav>
      <div className=" nav-container flex sb">
        <div className="logo">
          <NavLink to="/">
            <div className="logo-container flex space-around ai-center ac-center">
              <img src="./img/icon.png" alt="icon" />
              <h3>Groupomania</h3>
            </div>
          </NavLink>
        </div>
        <div className=" profil-container flex space-around ai-center ac-center">
          <NavLink
            to={{
              pathname: '/profil',
              search:`?user=${user?.userId}`,
            }}
            
          >
            <i class="fa-regular fa-user logo-profil"></i>
          </NavLink>

          <Logout></Logout>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;