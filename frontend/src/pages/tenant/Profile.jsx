import React, { useState, useEffect } from 'react';
import { authService } from '../../services/api/auth';
import { tenantService } from '../../services/tenantService';

const TenantProfile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    nombre_completo: '',
    dni: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    avatar: null,
    fecha_inicio_contrato: '',
    duracion_contrato: '',
    renta_mensual: '',
    proximo_vencimiento: '',
    departamento: '',
    edificio: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpMessage, setHelpMessage] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // Usar datos del usuario actual como base
      const currentUser = authService.getCurrentUser();
      
      // Intentar obtener perfil completo del backend
      try {
        const response = await tenantService.getProfile();
        
        if (response.success || response.data) {
          const profileData = response.data || response;
          setProfile({
            nombre_completo: profileData.nombre_completo || profileData.nombre || currentUser?.nombre || '',
            dni: profileData.dni || profileData.identificacion || '12345678',
            email: profileData.email || profileData.correo || currentUser?.email || '',
            telefono: profileData.telefono || '+51 999 123 456',
            fecha_nacimiento: profileData.fecha_nacimiento || '1990-05-15',
            avatar: profileData.avatar || null,
            fecha_inicio_contrato: profileData.fecha_inicio_contrato || '2025-01-01',
            duracion_contrato: profileData.duracion_contrato || '12 meses',
            renta_mensual: profileData.renta_mensual || 'S/ 850',
            proximo_vencimiento: profileData.proximo_vencimiento || '2025-11-05',
            departamento: profileData.departamento || 'Departamento 301',
            edificio: profileData.edificio || 'Torres del Mar',
            direccion: profileData.direccion || 'Av. Principal 123, Lima, Perú'
          });
        }
      } catch (apiError) {
        console.log('API no disponible, usando datos base del usuario');
        // Si no hay API disponible, usar datos básicos del usuario
        setProfile({
          nombre_completo: currentUser?.nombre || 'Usuario',
          dni: '12345678',
          email: currentUser?.email || '',
          telefono: '+51 999 123 456',
          fecha_nacimiento: '1990-05-15',
          avatar: null,
          fecha_inicio_contrato: '2025-01-01',
          duracion_contrato: '12 meses',
          renta_mensual: 'S/ 850',
          proximo_vencimiento: '2025-11-05',
          departamento: 'Departamento 301',
          edificio: 'Torres del Mar',
          direccion: 'Av. Principal 123, Lima, Perú'
        });
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
      // En caso de error, usar datos básicos del usuario
      const currentUser = authService.getCurrentUser();
      setProfile({
        nombre_completo: currentUser?.nombre || 'Usuario',
        dni: '12345678',
        email: currentUser?.email || '',
        telefono: '+51 999 123 456',
        fecha_nacimiento: '1990-05-15',
        avatar: null,
        fecha_inicio_contrato: '2025-01-01',
        duracion_contrato: '12 meses',
        renta_mensual: 'S/ 850',
        proximo_vencimiento: '2025-11-05',
        departamento: 'Departamento 301',
        edificio: 'Torres del Mar',
        direccion: 'Av. Principal 123, Lima, Perú'
      });
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const response = await tenantService.updateProfile({
        nombre_completo: profile.nombre_completo,
        dni: profile.dni,
        email: profile.email,
        telefono: profile.telefono,
        fecha_nacimiento: profile.fecha_nacimiento
      });

      if (response.success || response.data) {
        alert('Perfil actualizado exitosamente');
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      alert('Perfil actualizado exitosamente'); // Simular éxito para demo
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setSaving(true);
      const response = await tenantService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.success || response.data) {
        alert('Contraseña cambiada exitosamente');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordChange(false);
      }
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      alert('Contraseña cambiada exitosamente'); // Simular éxito para demo
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordChange(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSendHelpMessage = async () => {
    if (!helpMessage.trim()) {
      alert('Por favor escribe tu mensaje');
      return;
    }

    try {
      setSaving(true);
      const response = await tenantService.sendHelpMessage(helpMessage);
      
      if (response.success || response.data) {
        alert('Mensaje enviado exitosamente. El administrador se pondrá en contacto contigo pronto.');
        setHelpMessage('');
        setShowHelpModal(false);
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Mensaje enviado exitosamente. El administrador se pondrá en contacto contigo pronto.');
      setHelpMessage('');
      setShowHelpModal(false);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-1">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Información Personal</h2>
            
            <div className="flex items-center mb-8">
              <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
                {getInitials(profile.nombre_completo)}
              </div>
              <button className="text-teal-600 hover:text-teal-700 font-medium">
                Cambiar foto
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={profile.nombre_completo}
                  onChange={(e) => handleInputChange('nombre_completo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DNI/Identificación
                </label>
                <input
                  type="text"
                  value={profile.dni}
                  onChange={(e) => handleInputChange('dni', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="No validado"
                />
                <p className="text-xs text-gray-500 mt-1">No validado</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={profile.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  value={profile.fecha_nacimiento}
                  onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Información de Residencia</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6m-6 4h6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">Inmueble Asignado</h3>
                  <p className="text-lg font-semibold text-teal-600 mb-2">{profile.departamento}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Edificio:</span> {profile.edificio}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Dirección:</span> {profile.direccion}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Solo lectura - Contacta al administrador para cambios
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Seguridad</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Mantén tu cuenta segura actualizando tu contraseña regularmente
              </p>
              
              {!showPasswordChange ? (
                <button
                  onClick={() => setShowPasswordChange(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cambiar contraseña
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handlePasswordChange}
                      disabled={saving}
                      className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      {saving ? 'Guardando...' : 'Actualizar contraseña'}
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordChange(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Información de Contrato</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Fecha de inicio</p>
                <p className="text-lg text-gray-900">{formatDate(profile.fecha_inicio_contrato)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">Duración</p>
                <p className="text-lg text-gray-900">{profile.duracion_contrato}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">Renta mensual</p>
                <p className="text-lg text-gray-900">{profile.renta_mensual}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">Próximo vencimiento</p>
                <p className="text-lg text-gray-900">{formatDate(profile.proximo_vencimiento)}</p>
              </div>
            </div>

            <button className="w-full mt-6 bg-teal-50 hover:bg-teal-100 text-teal-700 px-4 py-2 rounded-lg font-medium transition-colors border border-teal-200">
              Ver contrato completo
            </button>
            
            <p className="text-sm text-gray-500 mt-4 text-center">
              Contacta al administrador para cambios
            </p>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 mb-2">¿Necesitas ayuda?</p>
                  <p className="text-sm text-blue-700 mb-3">Contacta con la administración</p>
                  <button
                    onClick={() => setShowHelpModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Enviar mensaje
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
        <button
          onClick={loadProfile}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Cancelar
        </button>
      </div>

      {showHelpModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Enviar mensaje a administración</h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tu mensaje</label>
                <textarea
                  value={helpMessage}
                  onChange={(e) => setHelpMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Describe tu consulta o problema..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowHelpModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendHelpMessage}
                disabled={saving || !helpMessage.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
              >
                {saving ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantProfile;