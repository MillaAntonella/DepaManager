import React, { useState, useEffect } from 'react';
import { authService } from '../../services/api/auth';

const Profile = () => {
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordActual: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUsuario(currentUser);
      setFormData(prev => ({
        ...prev,
        email: currentUser.email
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validaciones
      if (showPasswordFields) {
        if (!formData.passwordActual) {
          throw { mensaje: 'Debe ingresar su contraseña actual' };
        }
        if (formData.password !== formData.confirmPassword) {
          throw { mensaje: 'Las contraseñas no coinciden' };
        }
        if (formData.password.length < 6) {
          throw { mensaje: 'La nueva contraseña debe tener al menos 6 caracteres' };
        }
      }

      const response = await authService.updateProfile(
        formData.email,
        showPasswordFields ? formData.password : null,
        showPasswordFields ? formData.passwordActual : null
      );

      setMessage({ type: 'success', text: response.mensaje });
      
      // Limpiar campos de contraseña
      if (showPasswordFields) {
        setFormData(prev => ({
          ...prev,
          password: '',
          passwordActual: '',
          confirmPassword: ''
        }));
        setShowPasswordFields(false);
      }

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.mensaje || 'Error al actualizar perfil' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) return <div>Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h2>
      
      {message.text && (
        <div className={`p-4 rounded-md mb-6 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre
          </label>
          <input
            type="text"
            value={usuario.nombre}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            El nombre no puede ser modificado
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Botón para mostrar campos de contraseña */}
        <div>
          <button
            type="button"
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {showPasswordFields ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
          </button>
        </div>

        {/* Campos de contraseña */}
        {showPasswordFields && (
          <div className="space-y-4 border-t pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña actual
              </label>
              <input
                type="password"
                name="passwordActual"
                value={formData.passwordActual}
                onChange={handleChange}
                required={showPasswordFields}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={showPasswordFields}
                minLength="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={showPasswordFields}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Botón de envío */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md font-medium ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            {loading ? 'Actualizando...' : 'Actualizar Perfil'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
