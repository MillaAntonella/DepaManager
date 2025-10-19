import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h1>¡Bienvenido al Sistema de Alquileres!</h1>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}

export default Dashboard;
