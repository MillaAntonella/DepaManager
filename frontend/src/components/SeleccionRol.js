import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SeleccionRol.css';

function SeleccionRol() {
  const navigate = useNavigate();

  return (
    <div className="seleccion-rol-container">
      <div className="seleccion-rol-content">
        <h1>Bienvenido al Sistema de Alquileres</h1>
        <p>Selecciona tu tipo de usuario para continuar</p>
        
        <div className="rol-buttons">
          <button 
            className="rol-btn propietario-btn"
            onClick={() => navigate('/propietario')}
          >
            <div className="rol-icon">🏠</div>
            <h3>Soy Propietario</h3>
            <p>Administra tus propiedades y inquilinos</p>
          </button>
          
          <button 
            className="rol-btn inquilino-btn"
            onClick={() => navigate('/inquilino')}
          >
            <div className="rol-icon">👤</div>
            <h3>Soy Inquilino</h3>
            <p>Accede a tu información de alquiler</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeleccionRol;