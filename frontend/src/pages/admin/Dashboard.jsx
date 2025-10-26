import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api/auth';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [showPlanSelection, setShowPlanSelection] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.rol !== 'propietario') {
      navigate('/');
      return;
    }
    
    setUser(currentUser);
    setLoading(false);
  }, [navigate]);

  const handlePlanSelect = (planType) => {
    if (planType === 'free') {
      // Continuar con plan gratuito (1 edificio)
      setShowPlanSelection(false);
    } else {
      // Mostrar mensaje de próximamente para planes pagos
      alert('Los planes pagos estarán disponibles próximamente. Por ahora, usa el plan gratuito.');
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
                {/* Plan Gratuito - 1 Edificio */}
                <div className="border-2 border-green-200 rounded-lg p-6 text-center bg-green-50">
                  <div className="text-green-600 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">1 Edificio</h3>
                  <p className="text-3xl font-bold text-green-600 mb-2">GRATIS</p>
                  <p className="text-gray-600 mb-4">Perfecto para empezar</p>
                  <ul className="text-sm text-gray-600 mb-6 space-y-1">
                    <li>✓ Gestión de inquilinos</li>
                    <li>✓ Control de pagos</li>
                    <li>✓ Reportes básicos</li>
                    <li>✓ Soporte básico</li>
                  </ul>
                  <button
                    onClick={() => handlePlanSelect('free')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                  >
                    Comenzar Gratis
                  </button>
                </div>

                {/* Plan Básico - 2 Edificios */}
                <div className="border-2 border-blue-200 rounded-lg p-6 text-center">
                  <div className="text-blue-600 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                      <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">2 Edificios</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-2">$29/mes</p>
                  <p className="text-gray-600 mb-4">Para pequeños propietarios</p>
                  <ul className="text-sm text-gray-600 mb-6 space-y-1">
                    <li>✓ Todo del plan gratuito</li>
                    <li>✓ Reportes avanzados</li>
                    <li>✓ Notificaciones automáticas</li>
                    <li>✓ Soporte prioritario</li>
                  </ul>
                  <button
                    onClick={() => handlePlanSelect('basic')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                  >
                    Próximamente
                  </button>
                </div>

                {/* Plan Pro - 3+ Edificios */}
                <div className="border-2 border-purple-200 rounded-lg p-6 text-center">
                  <div className="text-purple-600 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">3+ Edificios</h3>
                  <p className="text-3xl font-bold text-purple-600 mb-2">$59/mes</p>
                  <p className="text-gray-600 mb-4">Para grandes propietarios</p>
                  <ul className="text-sm text-gray-600 mb-6 space-y-1">
                    <li>✓ Todo del plan básico</li>
                    <li>✓ Edificios ilimitados</li>
                    <li>✓ API personalizada</li>
                    <li>✓ Soporte 24/7</li>
                  </ul>
                  <button
                    onClick={() => handlePlanSelect('pro')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                  >
                    Próximamente
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard principal después de seleccionar plan
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600">Bienvenido, {user?.nombre}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card para registrar inquilinos */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Gestión de Inquilinos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Crear nuevos usuarios
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <button
                onClick={() => navigate('/admin/tenants')}
                className="text-sm text-green-600 hover:text-green-900"
              >
                Gestionar inquilinos →
              </button>
            </div>
          </div>

          {/* Más cards pueden agregarse aquí */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Propiedades
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Gestionar edificio
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <button className="text-sm text-blue-600 hover:text-blue-900">
                Próximamente →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;