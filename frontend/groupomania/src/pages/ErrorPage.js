import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = (props) => {
  const navigate = useNavigate();

  const logout = () => {
    props.exit();
    navigate('/signing');
  };
  useEffect(() => {
    props.unlog();
    setTimeout(logout, 3000);
  }, []);
  return (
    <div className="error-page">
      <div
        style={{ position: 'relative', top: '25%' }}
        className="flex cl ai-center"
      >
        <h1 style={{ color: 'red' }}>
          Erreur 500 : Un problème est survenu sur le serveur
        </h1>
        <br />
        <p style={{ fontSize: '1.2em' }}>Retour à la page de connexion ... </p>
      </div>
    </div>
  );
};

export default ErrorPage;
