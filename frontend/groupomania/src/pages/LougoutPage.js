import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LougoutPage = (props) => {
  const navigate = useNavigate();
  const windowSize = useRef([window.innerWidth]);
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
          <img
            src={
              windowSize.current[0] < 480
                ? require('../images/icon-left-font-monochrome-black -350p.png')
                : require('../images/icon-.png')
            }
            style={{ width: '350' }}
            alt="Groupomania"
          />
        </div>
        <h1>Déconnexion ...</h1>
      </div>
    </div>
  );
};

export default LougoutPage;
