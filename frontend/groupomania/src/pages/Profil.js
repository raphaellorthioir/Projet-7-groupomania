
import UpdateProfil from '../components/Profil/UpdateProfil';
import Navbar from '../components/Navbar';
//import { useLocation } from "react-router-dom";
const Profil = () => {
  /* const location = useLocation();
  const {state}=location
  console.log(state.user)*/
  // on attrape la donnée du state de UserContext qu'on peut ensuite utilisée pour la page

  return (
    
      <div className='profil-page flex cl space-around'>
      <Navbar></Navbar>
      <UpdateProfil></UpdateProfil>
      </div>
      
    
  );
};

export default Profil;
