import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Form.css';

function InquilinoAuth() {
  const [formData, setFormData] = useState({
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
        rolEsperado: 'inquilino'
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

  return (
    <div className="inquilino-auth-container">
      <div className="inquilino-auth-content">
        <div className="inquilino-header">
          <div className="inquilino-icon">👤</div>
          <h1>Portal de Inquilinos</h1>
          <p>Accede con las credenciales proporcionadas por tu propietario</p>
        </div>
        
        <div className="form-container inquilino-form">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <label>Email:</label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleInputChange} 
              placeholder="Ingresa tu email"
              required 
            />
            <label>Contraseña:</label>
            <input 
              type="password" 
              name="password"
              value={formData.password} 
              onChange={handleInputChange} 
              placeholder="Ingresa tu contraseña"
              required 
            />
            <button type="submit" disabled={loading} className="inquilino-btn">
              {loading ? 'Ingresando...' : 'Entrar'}
            </button>
          </form>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="inquilino-info">
            <p><strong>Nota:</strong> Si no tienes credenciales de acceso, contacta con tu propietario.</p>
          </div>
        </div>
        
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

export default InquilinoAuth;