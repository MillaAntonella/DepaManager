import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api/auth';
import PaymentsManagement from './PaymentsManagement';
import IncidentsManagement from './IncidentsManagement';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPlanSelection, setShowPlanSelection] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [inquilinos, setInquilinos] = useState([]);
  const [loadingInquilinos, setLoadingInquilinos] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingInquilino, setCreatingInquilino] = useState(false);
  const [newInquilino, setNewInquilino] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInquilino, setSelectedInquilino] = useState(null);
  const [editingInquilino, setEditingInquilino] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: '',
    email: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.rol !== 'propietario') {
      navigate('/');
      return;
    }
    
    setUser(currentUser);
    loadDashboardData();
  }, [navigate]);

  // Cargar inquilinos cuando se selecciona esa pestaña
  useEffect(() => {
    if (activeTab === 'inquilinos' && !showPlanSelection) {
      loadInquilinos();
    }
  }, [activeTab, showPlanSelection]);

  const loadDashboardData = async () => {
    try {
      const data = await authService.getDashboard();
      setDashboardData(data.estadisticas);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
      setLoading(false);
    }
  };

  const loadInquilinos = async () => {
    setLoadingInquilinos(true);
    try {
      const data = await authService.getTenants();
      setInquilinos(data.inquilinos || []);
    } catch (error) {
      console.error('Error cargando inquilinos:', error);
      setInquilinos([]);
    } finally {
      setLoadingInquilinos(false);
    }
  };



  const handleCreateInquilino = async (e) => {
    e.preventDefault();
    setCreatingInquilino(true);
    
    try {
      await authService.createTenant(
        newInquilino.nombre,
        newInquilino.email,
        newInquilino.password
      );
      
      // Recargar la lista de inquilinos
      await loadInquilinos();
      
      // Resetear el formulario y cerrar modal
      setNewInquilino({ nombre: '', email: '', password: '' });
      setShowCreateModal(false);
      
      alert('Inquilino creado exitosamente');
    } catch (error) {
      console.error('Error creando inquilino:', error);
      alert(error.mensaje || 'Error al crear el inquilino');
    } finally {
      setCreatingInquilino(false);
    }
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setNewInquilino({ nombre: '', email: '', password: '' });
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewInquilino(prev => ({ ...prev, password }));
  };

  // Función para ver detalles del inquilino
  const handleViewInquilino = (inquilino) => {
    setSelectedInquilino(inquilino);
    setShowViewModal(true);
  };

  // Función para editar inquilino
  const handleEditInquilino = (inquilino) => {
    setSelectedInquilino(inquilino);
    setEditForm({
      nombre: inquilino.nombre,
      email: inquilino.email
    });
    setShowEditModal(true);
  };

  // Función para guardar cambios de edición
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditingInquilino(true);
    
    try {
      // Simular actualización (necesitarías crear el endpoint en el backend)
      console.log('Actualizando inquilino:', selectedInquilino.id, editForm);
      
      // Actualizar localmente (temporal hasta tener el endpoint)
      setInquilinos(prev => prev.map(inq => 
        inq.id === selectedInquilino.id 
          ? { ...inq, nombre: editForm.nombre, email: editForm.email }
          : inq
      ));
      
      setShowEditModal(false);
      alert('Inquilino actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando inquilino:', error);
      alert('Error al actualizar el inquilino');
    } finally {
      setEditingInquilino(false);
    }
  };

  // Función para eliminar inquilino
  const handleDeleteInquilino = async (inquilino) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al inquilino ${inquilino.nombre}?`)) {
      try {
        // Simular eliminación (necesitarías crear el endpoint en el backend)
        console.log('Eliminando inquilino:', inquilino.id);
        
        // Eliminar localmente (temporal hasta tener el endpoint)
        setInquilinos(prev => prev.filter(inq => inq.id !== inquilino.id));
        
        alert('Inquilino eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando inquilino:', error);
        alert('Error al eliminar el inquilino');
      }
    }
  };

  // Función para cerrar modales
  const handleCloseModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedInquilino(null);
    setEditForm({ nombre: '', email: '' });
  };

  const handlePlanSelect = (planType) => {
    if (planType === 'free') {
      setShowPlanSelection(false);
    } else {
      alert('Los planes pagos estarán disponibles próximamente.');
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (showPlanSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  ¡Bienvenido, {user?.nombre}!
                </h1>
                <p className="text-gray-600">
                  ¿Cuántos edificios quieres administrar?
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div 
                  className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => handlePlanSelect('free')}
                >
                  <div className="text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Gratuito</h3>
                    <p className="text-3xl font-bold text-green-600 mb-4">$0</p>
                    <p className="text-gray-600 mb-6">1 Edificio</p>
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                      Comenzar Gratis
                    </button>
                  </div>
                </div>

                <div 
                  className="bg-white border-2 border-blue-500 rounded-lg p-6 relative cursor-pointer"
                  onClick={() => handlePlanSelect('standard')}
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">Recomendado</span>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Estándar</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-4">$29<span className="text-lg">/mes</span></p>
                    <p className="text-gray-600 mb-6">Hasta 3 Edificios</p>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                      Próximamente
                    </button>
                  </div>
                </div>

                <div 
                  className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-purple-500 transition-colors cursor-pointer"
                  onClick={() => handlePlanSelect('premium')}
                >
                  <div className="text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Premium</h3>
                    <p className="text-3xl font-bold text-purple-600 mb-4">$79<span className="text-lg">/mes</span></p>
                    <p className="text-gray-600 mb-6">Edificios Ilimitados</p>
                    <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                      Próximamente
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-teal-600 shadow-lg">
        <div className="flex items-center justify-center h-16 bg-teal-700">
          <h1 className="text-white text-xl font-bold">DepaManager</h1>
        </div>
        
                <nav className="mt-8">
          <div className="px-4 space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-md transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-teal-700 text-white' 
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('inquilinos')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-md transition-colors ${
                activeTab === 'inquilinos' 
                  ? 'bg-teal-700 text-white' 
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a6 6 0 01-11.5 0" />
              </svg>
              Inquilinos
            </button>

            <button
              onClick={() => setActiveTab('pagos')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-md transition-colors ${
                activeTab === 'pagos' 
                  ? 'bg-teal-700 text-white' 
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Pagos
            </button>

            <button
              onClick={() => setActiveTab('incidencias')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-md transition-colors ${
                activeTab === 'incidencias' 
                  ? 'bg-teal-700 text-white' 
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Incidencias
            </button>

            <button
              onClick={() => setActiveTab('proveedores')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-md transition-colors ${
                activeTab === 'proveedores' 
                  ? 'bg-teal-700 text-white' 
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Proveedores
            </button>

            <button
              onClick={() => setActiveTab('inventario')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-md transition-colors ${
                activeTab === 'inventario' 
                  ? 'bg-teal-700 text-white' 
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Inventario
            </button>

            <button
              onClick={() => setActiveTab('postulantes')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-md transition-colors ${
                activeTab === 'postulantes' 
                  ? 'bg-teal-700 text-white' 
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Postulantes
            </button>

            <button
              onClick={() => setActiveTab('vehiculos')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-md transition-colors ${
                activeTab === 'vehiculos' 
                  ? 'bg-teal-700 text-white' 
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Vehículos
            </button>

            <button
              onClick={() => setActiveTab('reportes')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-md transition-colors ${
                activeTab === 'reportes' 
                  ? 'bg-teal-700 text-white' 
                  : 'text-teal-100 hover:bg-teal-700 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Reportes
            </button>
          </div>
        </nav>
      </div>

      <div className="ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div>
                  {activeTab === 'inquilinos' && (
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <span>Gestión</span>
                      <svg className="mx-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-teal-600 font-medium">Inquilinos</span>
                    </div>
                  )}
                  <h1 className="text-2xl font-bold text-gray-900">
                    {activeTab === 'dashboard' && 'Dashboard'}
                    {activeTab === 'inquilinos' && 'Gestión de Inquilinos'}
                    {activeTab === 'pagos' && 'Gestión de Pagos'}
                    {activeTab === 'incidencias' && 'Gestión de Incidencias'}
                    {activeTab === 'proveedores' && 'Gestión de Proveedores'}
                    {activeTab === 'inventario' && 'Gestión de Inventario'}
                    {activeTab === 'postulantes' && 'Gestión de Postulantes'}
                    {activeTab === 'vehiculos' && 'Gestión de Vehículos'}
                    {activeTab === 'reportes' && 'Reportes'}
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-teal-600 font-medium">Administrador</span>
                  <span className="text-sm text-gray-500">{user?.nombre}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && dashboardData && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a6 6 0 01-11.5 0" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Inquilinos</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.totalInquilinos}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Ingresos del Mes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0
                      }).format(dashboardData.ingresosMes)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Incidencias Abiertas</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.incidenciasAbiertas}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Ocupación</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.ocupacionPorcentaje}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inquilinos' && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Inquilinos</h2>
                    <p className="text-gray-600 mt-1">Administra inquilinos y contratos de alquiler</p>
                  </div>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Nuevo Inquilino
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Lista de Inquilinos</h3>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar inquilinos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 w-80"
                      />
                      <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {loadingInquilinos ? (
                    <div className="flex justify-center py-8">
                      <div className="text-lg text-gray-600">Cargando inquilinos...</div>
                    </div>
                  ) : inquilinos.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500 mb-4">No hay inquilinos registrados</div>
                      <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Crear Primer Inquilino
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fecha de Registro
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {inquilinos
                            .filter(inquilino => 
                              inquilino.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              inquilino.email.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((inquilino) => (
                            <tr key={inquilino.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                                      <span className="text-teal-600 font-medium text-sm">
                                        {inquilino.nombre.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{inquilino.nombre}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{inquilino.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {new Date(inquilino.created_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  Activo
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => handleViewInquilino(inquilino)}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                                    title="Ver detalles"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </button>
                                  <button 
                                    onClick={() => handleEditInquilino(inquilino)}
                                    className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50"
                                    title="Editar"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteInquilino(inquilino)}
                                    className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                                    title="Eliminar"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pagos' && <PaymentsManagement />}
        
        {activeTab === 'incidencias' && (
          <div className="p-6">
            <IncidentsManagement />
          </div>
        )}

        {activeTab !== 'dashboard' && activeTab !== 'inquilinos' && activeTab !== 'pagos' && activeTab !== 'incidencias' && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p className="text-gray-600">
                Esta sección estará disponible próximamente.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal para crear nuevo inquilino */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Crear Nuevo Inquilino</h3>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreateInquilino} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={newInquilino.nombre}
                    onChange={(e) => setNewInquilino(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newInquilino.email}
                    onChange={(e) => setNewInquilino(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="juan@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña temporal
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      required
                      value={newInquilino.password}
                      onChange={(e) => setNewInquilino(prev => ({ ...prev, password: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Contraseña"
                    />
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                    >
                      Generar
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    El inquilino podrá cambiar esta contraseña después del primer inicio de sesión
                  </p>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={creatingInquilino}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingInquilino ? 'Creando...' : 'Crear Inquilino'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles del inquilino */}
      {showViewModal && selectedInquilino && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Detalles del Inquilino</h3>
                <button
                  onClick={handleCloseModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-teal-600 font-bold text-2xl">
                      {selectedInquilino.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <div className="text-lg text-gray-900">{selectedInquilino.nombre}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="text-lg text-gray-900">{selectedInquilino.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de registro
                  </label>
                  <div className="text-lg text-gray-900">
                    {new Date(selectedInquilino.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    Activo
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID del sistema
                  </label>
                  <div className="text-sm text-gray-500">#{selectedInquilino.id}</div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCloseModals}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    handleCloseModals();
                    handleEditInquilino(selectedInquilino);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar inquilino */}
      {showEditModal && selectedInquilino && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Editar Inquilino</h3>
                <button
                  onClick={handleCloseModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-teal-600 font-bold text-xl">
                      {editForm.nombre.charAt(0).toUpperCase() || selectedInquilino.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.nombre}
                    onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">
                        Los cambios se aplicarán inmediatamente. El inquilino podrá usar las nuevas credenciales para iniciar sesión.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModals}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={editingInquilino}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingInquilino ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;