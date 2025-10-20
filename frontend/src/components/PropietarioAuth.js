import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Form.css';

function PropietarioAuth() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
        rolEsperado: 'propietario'
      });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await api.post('/auth/registro', {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
      });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="propietario-auth-container">
      <div className="propietario-auth-content">
        <h1>Portal de Propietarios</h1>
        <p>Gestiona tus propiedades y inquilinos</p>
        
        <div className="auth-columns">
          {/* Columna de Login */}
          <div className="auth-column">
            <div className="form-container">
              <h2>Iniciar Sesión</h2>
              <form onSubmit={handleLogin}>
                <label>Email:</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                />
                <label>Contraseña:</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password} 
                  onChange={handleInputChange} 
                  required 
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Ingresando...' : 'Entrar'}
                </button>
              </form>
            </div>
          </div>

          {/* Columna de Registro */}
          <div className="auth-column">
            <div className="form-container">
              <h2>Registrarse</h2>
              <form onSubmit={handleRegister}>
                <label>Nombre:</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={formData.nombre} 
                  onChange={handleInputChange} 
                  required 
                />
                <label>Email:</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                />
                <label>Contraseña:</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password} 
                  onChange={handleInputChange} 
                  required 
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <button 
          className="back-btn" 
          onClick={() => navigate('/')}
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}

export default PropietarioAuth;