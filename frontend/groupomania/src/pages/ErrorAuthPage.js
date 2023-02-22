import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorAuthPage = (props) => {
  const navigate = useNavigate();

  const logout = () => {
    props.exit();
    navigate('/signing');
  };
  useEffect(() => {
    props.unlog();
    setTimeout(logout, 5000);
  }, []);

  return (
    <div className="flex cl ac-center ai-center">
      <h1 style={{ color: 'red' }}>Erreur 401 : Erreur d'authentification</h1>
      <p> Retour à la page de connexion ...</p>
    </div>
  );
};

export default ErrorAuthPage;
