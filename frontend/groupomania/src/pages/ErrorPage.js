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
    setTimeout(logout, 5000);
  }, []);
  return (
    <div>
      <h1 style={{ color: 'red' }}>Erreur 400 : Un problème est survenu </h1>
      <br />
      <p>Retour à l'acceuil ... </p>
    </div>
  );
};

export default ErrorPage;
