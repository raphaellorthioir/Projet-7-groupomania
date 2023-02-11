import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LougoutPage = (props) => {
  const navigate = useNavigate();
  console.log(props);
  const logout = () => {
    props.exit();
    navigate('/signing');
  };
  useEffect(() => {
    props.unlog();
    setTimeout(logout, 2000);
  }, []);

  return (
    <div className="disconnect-container ">
      <div className="disconnect-box flex cl ai-center ac-center ">
        <div className="img-box">
          <img src={require('../images/icon-.png')} alt="Groupomania" />
        </div>
        <h1>Deconnexion ...</h1>
      </div>
    </div>
  );
};

export default LougoutPage;
