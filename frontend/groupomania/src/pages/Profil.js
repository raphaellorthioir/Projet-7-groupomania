import React, { useContext } from 'react';
import { UserContext } from '../components/AppContext';
import { Navigate } from 'react-router-dom';
import UpdateProfil from '../components/Profil/UpdateProfil';
//import { useLocation } from "react-router-dom";
const Profil = () => {

 /* const location = useLocation();
  const {state}=location
  console.log(state.user)*/
  const user = useContext(UserContext); // on attrape la donnée du state de UserContext qu'on peut ensuite utilisée pour la page
  
  return ( 
<div >
{ user ? <UpdateProfil/>  :  <Navigate to='/signing'/> }
</div>


   
      
    
      
     

     
  )
    
};

export default Profil;
