import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [inquilinos, setInquilinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newInquilino, setNewInquilino] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (!token || !usuarioGuardado) {
      navigate('/');
      return;
    }
    
    const usuarioData = JSON.parse(usuarioGuardado);
    setUsuario(usuarioData);
    
    // Cargar datos del dashboard
    cargarDashboard();
    
    // Si es propietario, cargar lista de inquilinos
    if (usuarioData.rol === 'propietario') {
      cargarInquilinos();
    }
  }, [navigate]);

  const cargarDashboard = async () => {
    try {
      const response = await api.get('/auth/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarInquilinos = async () => {
    try {
      const response = await api.get('/auth/inquilinos');
      setInquilinos(response.data.inquilinos);
    } catch (error) {
      console.error('Error cargando inquilinos:', error);
    }
  };

  const crearInquilino = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/crear-inquilino', newInquilino);
      alert('Inquilino creado exitosamente');
      setNewInquilino({ nombre: '', email: '', password: '' });
      setShowCreateForm(false);
      cargarInquilinos(); // Recargar lista
    } catch (error) {
      alert(error.response?.data?.mensaje || 'Error al crear inquilino');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  if (loading) {
    return <div>Cargando dashboard...</div>;
  }

  return (
    <div className="dashboard-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Dashboard - {usuario?.rol === 'propietario' ? 'Propietario' : 'Inquilino'}</h1>
        <button onClick={logout} style={{ background: '#f44336', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </div>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2>Bienvenido, {usuario?.nombre}!</h2>
        <p><strong>Email:</strong> {usuario?.email}</p>
        <p><strong>Rol:</strong> {usuario?.rol}</p>
      </div>

      {usuario?.rol === 'propietario' ? (
        <div>
          {/* Dashboard de Propietario */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3>Estadísticas</h3>
              <p><strong>Total de Inquilinos:</strong> {dashboardData?.estadisticas?.totalInquilinos || 0}</p>
            </div>
            
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3>Acciones Rápidas</h3>
              <button 
                onClick={() => setShowCreateForm(true)}
                style={{ background: '#4caf50', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
              >
                Crear Nuevo Inquilino
              </button>
            </div>
          </div>

          {/* Formulario para crear inquilino */}
          {showCreateForm && (
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
              <h3>Crear Nuevo Inquilino</h3>
              <form onSubmit={crearInquilino}>
                <div style={{ marginBottom: '15px' }}>
                  <label>Nombre:</label>
                  <input 
                    type="text" 
                    value={newInquilino.nombre}
                    onChange={(e) => setNewInquilino({...newInquilino, nombre: e.target.value})}
                    required 
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label>Email:</label>
                  <input 
                    type="email" 
                    value={newInquilino.email}
                    onChange={(e) => setNewInquilino({...newInquilino, email: e.target.value})}
                    required 
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label>Contraseña:</label>
                  <input 
                    type="password" 
                    value={newInquilino.password}
                    onChange={(e) => setNewInquilino({...newInquilino, password: e.target.value})}
                    required 
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={{ background: '#4caf50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                    Crear Inquilino
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateForm(false)}
                    style={{ background: '#ccc', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de inquilinos */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3>Lista de Inquilinos</h3>
            {inquilinos.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                      <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
                      <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Nombre</th>
                      <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                      <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Fecha Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquilinos.map((inquilino) => (
                      <tr key={inquilino.id}>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{inquilino.id}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{inquilino.nombre}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{inquilino.email}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {new Date(inquilino.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No hay inquilinos registrados.</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Dashboard de Inquilino */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3>Portal del Inquilino</h3>
            <p>Bienvenido a tu portal personalizado. Aquí podrás:</p>
            <ul>
              <li>Ver información de tu alquiler</li>
              <li>Consultar pagos y estado de cuenta</li>
              <li>Reportar problemas de mantenimiento</li>
              <li>Actualizar tu información personal</li>
            </ul>
            <p><em>Estas funcionalidades se implementarán próximamente.</em></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
