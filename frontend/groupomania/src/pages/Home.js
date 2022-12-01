import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../components/AppContext';
import Navbar from '../components/Navbar';

const Home = () => {
  const user = useContext(UserContext)
  return(
    <div>
      {user ? <Navbar/> : <Navigate to="/signing"/>}
      
    </div>
    
  
  );
};

export default Home;
