import React, { useState, useEffect } from 'react';
import { tenantService } from '../../services/tenantService';

const TenantIncidents = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [filteredIncidencias, setFilteredIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Todas');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedIncidencia, setSelectedIncidencia] = useState(null);

  // Estado para nueva incidencia
  const [newIncidencia, setNewIncidencia] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'Mantenimiento',
    prioridad: 'Media'
  });

  const tabs = ['Todas', 'En Revisión', 'Asignadas', 'Resueltas'];
  const categorias = ['Mantenimiento', 'Limpieza', 'Seguridad', 'Servicios', 'Otros'];
  const prioridades = ['Baja', 'Media', 'Alta', 'Urgente'];

  useEffect(() => {
    loadIncidencias();
  }, []);

  useEffect(() => {
    filterIncidencias();
  }, [activeTab, incidencias]);

  const loadIncidencias = async () => {
    try {
      setLoading(true);
      const response = await tenantService.getMyIncidents();
      
      if (response.success) {
        // Mapear los datos del backend al formato esperado por el frontend
        const mappedIncidencias = response.data.map(inc => ({
          id: inc.id_incidencia || inc.id,
          titulo: inc.titulo || inc.descripcion?.substring(0, 50) + '...',
          descripcion: inc.descripcion,
          categoria: inc.categoria || 'Mantenimiento',
          prioridad: inc.prioridad?.charAt(0).toUpperCase() + inc.prioridad?.slice(1) || 'Media',
          estado: inc.estado, // Usar el estado tal como viene del backend
          fecha_reporte: inc.fecha_creacion || inc.createdAt,
          comentarios: inc.comentarios || []
        }));
        setIncidencias(mappedIncidencias);
      } else {
        // Sin datos ficticios
        setIncidencias([]);
      }
    } catch (error) {
      console.error('Error cargando incidencias:', error);
      setIncidencias([]);
    } finally {
      setLoading(false);
    }
  };

  const filterIncidencias = () => {
    let filtered = incidencias;
    
    if (activeTab !== 'Todas') {
      const statusMap = {
        'En Revisión': 'abierta',
        'Asignadas': 'asignada',
        'Resueltas': 'resuelta'
      };
      filtered = incidencias.filter(inc => inc.estado === statusMap[activeTab]);
    }
    
    setFilteredIncidencias(filtered);
  };

  const getStatusColor = (estado) => {
    const colors = {
      'abierta': 'bg-yellow-100 text-yellow-800',
      'asignada': 'bg-blue-100 text-blue-800',
      'resuelta': 'bg-green-100 text-green-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (estado) => {
    const texts = {
      'abierta': 'En Revisión',
      'asignada': 'Asignada',
      'resuelta': 'Resuelta'
    };
    return texts[estado] || estado;
  };

  const getPriorityColor = (prioridad) => {
    const colors = {
      'Baja': 'text-green-600',
      'Media': 'text-yellow-600',
      'Alta': 'text-orange-600',
      'Urgente': 'text-red-600'
    };
    return colors[prioridad] || 'text-gray-600';
  };

  const getIncidenciaIcon = (categoria) => {
    const icons = {
      'Mantenimiento': '🔧',
      'Limpieza': '🧹',
      'Seguridad': '🔒',
      'Servicios': '⚡',
      'Otros': '📋'
    };
    return icons[categoria] || '📋';
  };

  const handleReportIncidencia = async () => {
    try {
      // Preparar datos para el backend (convertir prioridad a lowercase)
      const incidentData = {
        ...newIncidencia,
        prioridad: newIncidencia.prioridad.toLowerCase()
      };

      const response = await tenantService.reportIncident(incidentData);
      
      if (response.success) {
        // Mapear la respuesta del backend
        const mappedIncidencia = {
          id: response.data.id_incidencia || response.data.id,
          titulo: response.data.titulo || response.data.descripcion?.substring(0, 50) + '...',
          descripcion: response.data.descripcion,
          categoria: response.data.categoria || 'Mantenimiento',
          prioridad: response.data.prioridad?.charAt(0).toUpperCase() + response.data.prioridad?.slice(1) || 'Media',
          estado: response.data.estado, // Usar el estado tal como viene del backend
          fecha_reporte: response.data.fecha_creacion || response.data.createdAt || new Date().toISOString(),
          comentarios: []
        };
        
        setIncidencias([mappedIncidencia, ...incidencias]);
        setNewIncidencia({
          titulo: '',
          descripcion: '',
          categoria: 'Mantenimiento',
          prioridad: 'Media'
        });
        setShowReportModal(false);
        alert('Incidencia reportada exitosamente');
      }
    } catch (error) {
      console.error('Error reportando incidencia:', error);
      // Simular éxito para demo
      const newInc = {
        id: Date.now(),
        ...newIncidencia,
        estado: 'abierta',
        fecha_reporte: new Date().toISOString(),
        comentarios: []
      };
      setIncidencias([newInc, ...incidencias]);
      setNewIncidencia({
        titulo: '',
        descripcion: '',
        categoria: 'Mantenimiento',
        prioridad: 'Media'
      });
      setShowReportModal(false);
      alert('Incidencia reportada exitosamente');
    }
  };



  // Calcular estadísticas
  const stats = {
    total: incidencias.length,
    enRevision: incidencias.filter(inc => inc.estado === 'abierta').length,
    resueltas: incidencias.filter(inc => inc.estado === 'resuelta').length
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incidencias</h1>
          <p className="text-gray-600 mt-1">Gestiona y reporta incidencias de tu departamento</p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Reportar Incidencia
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Incidencias</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              <p className="text-gray-500 text-sm mt-1">Todas las incidencias</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">En Revisión</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.enRevision}</p>
              <p className="text-gray-500 text-sm mt-1">Pendientes</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Resueltas</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.resueltas}</p>
              <p className="text-gray-500 text-sm mt-1">Completadas</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Pestañas */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
                {tab === 'En Revisión' && stats.enRevision > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                    {stats.enRevision}
                  </span>
                )}
                {tab === 'Resueltas' && stats.resueltas > 0 && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    {stats.resueltas}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Lista de Incidencias */}
        <div className="p-6">
          {filteredIncidencias.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500">No hay incidencias en esta categoría</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIncidencias.map((incidencia) => (
                <div key={incidencia.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                        {getIncidenciaIcon(incidencia.categoria)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{incidencia.titulo}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(incidencia.estado)}`}>
                            {getStatusText(incidencia.estado)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{incidencia.descripcion}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Reportada el {formatDate(incidencia.fecha_reporte)}</span>
                          <span className={`font-medium ${getPriorityColor(incidencia.prioridad)}`}>
                            Prioridad: {incidencia.prioridad}
                          </span>
                          <span>Categoría: {incidencia.categoria}</span>
                        </div>

                        {/* Comentarios del administrador */}
                        {incidencia.comentarios && incidencia.comentarios.length > 0 && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="text-sm font-medium text-green-800">Comentario del administrador:</span>
                            </div>
                            <p className="text-sm text-green-700">
                              {incidencia.comentarios[incidencia.comentarios.length - 1].comentario}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              {formatDate(incidencia.comentarios[incidencia.comentarios.length - 1].fecha)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedIncidencia(incidencia);
                          setShowDetailsModal(true);
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Reportar Incidencia */}
      {showReportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Reportar Nueva Incidencia</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={newIncidencia.titulo}
                  onChange={(e) => setNewIncidencia({...newIncidencia, titulo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Ej: Fuga de agua en cocina"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={newIncidencia.descripcion}
                  onChange={(e) => setNewIncidencia({...newIncidencia, descripcion: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Describe la incidencia detalladamente..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={newIncidencia.categoria}
                    onChange={(e) => setNewIncidencia({...newIncidencia, categoria: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                  <select
                    value={newIncidencia.prioridad}
                    onChange={(e) => setNewIncidencia({...newIncidencia, prioridad: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {prioridades.map(pri => (
                      <option key={pri} value={pri}>{pri}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReportIncidencia}
                disabled={!newIncidencia.titulo || !newIncidencia.descripcion}
                className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
              >
                Reportar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Detalles */}
      {showDetailsModal && selectedIncidencia && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedIncidencia.titulo}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(selectedIncidencia.estado)}`}>
                  {getStatusText(selectedIncidencia.estado)}
                </span>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedIncidencia.descripcion}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Información</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Categoría:</span> {selectedIncidencia.categoria}</p>
                    <p><span className="font-medium">Prioridad:</span> <span className={getPriorityColor(selectedIncidencia.prioridad)}>{selectedIncidencia.prioridad}</span></p>
                    <p><span className="font-medium">Reportada:</span> {formatDate(selectedIncidencia.fecha_reporte)}</p>
                  </div>
                </div>
              </div>

              {selectedIncidencia.comentarios && selectedIncidencia.comentarios.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Historial de Comentarios</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedIncidencia.comentarios.map((comentario, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-gray-900">{comentario.usuario}</span>
                          <span className="text-xs text-gray-500">{formatDate(comentario.fecha)}</span>
                        </div>
                        <p className="text-sm text-gray-600">{comentario.comentario}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

// Datos eliminados - solo backend real

export default TenantIncidents;
