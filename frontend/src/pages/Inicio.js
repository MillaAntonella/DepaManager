import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Inicio.css';

function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="inicio-container">
      <h1>Bienvenido al Sistema de Alquileres</h1>
      <div className="inicio-buttons">
        <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
        <button onClick={() => navigate('/registro')}>Registrarse</button>
      </div>
    </div>
  );
}

export default Inicio;
