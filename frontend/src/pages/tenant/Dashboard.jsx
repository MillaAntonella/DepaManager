import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api/auth';
import { tenantService } from '../../services/tenantService';

const TenantDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    proximoPago: { monto: 0, fecha: null },
    miDepartamento: { numero: '', edificio: '' },
    pagosRealizados: 0,
    incidencias: 0,
    actividadReciente: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.rol !== 'inquilino') {
      navigate('/');
      return;
    }
    
    setUser(currentUser);
    loadDashboardData();
    setLoading(false);
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      // Intentar cargar datos reales del backend
      const dashboardInfo = await tenantService.getDashboard();
      setDashboardData(dashboardInfo);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      // Mantener valores por defecto en caso de error
      setDashboardData({
        proximoPago: { monto: 0, fecha: null },
        miDepartamento: { numero: 'N/A', edificio: 'N/A' },
        pagosRealizados: 0,
        incidencias: 0,
        actividadReciente: []
      });
    }
  };

  const formatSoles = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const getCurrentDate = () => {
    const fecha = new Date();
    const opciones = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con saludo personalizado */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                Hola, {user?.nombre} 👋
              </h1>
              <p className="text-gray-600 mt-1 capitalize">
                {getCurrentDate()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Cards de estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Próximo Pago */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Próximo Pago</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.proximoPago?.monto ? formatSoles(dashboardData.proximoPago.monto) : formatSoles(0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {dashboardData?.proximoPago?.fecha ? `Vence ${new Date(dashboardData.proximoPago.fecha).toLocaleDateString('es-PE')}` : 'Sin fecha de vencimiento'}
              </p>
            </div>
          </div>

          {/* Mi Departamento */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Mi Departamento</p>
              <p className="text-2xl font-bold text-gray-900">
                Depto. {dashboardData?.miDepartamento?.numero || 'N/A'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {dashboardData?.miDepartamento?.edificio || 'N/A'}
              </p>
            </div>
          </div>

          {/* Pagos Realizados */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Pagos Realizados</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.pagosRealizados}</p>
              <p className="text-sm text-gray-500 mt-1">Este año</p>
            </div>
          </div>

          {/* Incidencias */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Incidencias</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.incidencias}</p>
              <p className="text-sm text-gray-500 mt-1">En revisión</p>
            </div>
          </div>

        </div>

        {/* Acciones rápidas */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <button 
              onClick={() => navigate('/tenant/payments')}
              className="bg-teal-600 hover:bg-teal-700 text-white p-6 rounded-xl text-left transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Ver mis pagos</h3>
            </button>

            <button 
              onClick={() => navigate('/tenant/incidents')}
              className="bg-orange-600 hover:bg-orange-700 text-white p-6 rounded-xl text-left transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Reportar incidencia</h3>
            </button>

            <button 
              onClick={() => navigate('/tenant/notifications')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl text-left transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.303 4.464a1 1 0 01.64.768L11 7v4a3 3 0 006 0V7l.057-1.768a1 1 0 01.64-.768l1.414-.707 1.414 1.414-.707 1.414a1 1 0 01-.768.64L17 7H7l-1.768-.057a1 1 0 01-.768-.64L3.757 4.707 5.172 3.293 6.586 4l1.414.707z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Ver notificaciones</h3>
            </button>

          </div>
        </div>

        {/* Actividad reciente */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Actividad reciente</h2>
          <div className="bg-white rounded-xl shadow-sm border">
            {dashboardData.actividadReciente.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {dashboardData.actividadReciente.map((actividad, index) => (
                  <div key={index} className="p-6 flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                      {actividad.icono}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{actividad.titulo}</p>
                      <p className="text-sm text-gray-500">{actividad.fecha}</p>
                    </div>
                    <div className="text-right">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500">No hay actividad reciente</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TenantDashboard;