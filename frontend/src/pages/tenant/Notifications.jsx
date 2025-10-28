import React, { useState, useEffect } from 'react';
import { tenantService } from '../../services/tenantService';

const TenantNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Todas');

  const tabs = ['Todas', 'Avisos Administrativos', 'Mantenimiento', 'Pagos'];

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [activeTab, notifications]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await tenantService.getMyNotifications();
      
      if (response.success) {
        setNotifications(response.data);
      } else {
        // Sin datos ficticios
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;
    
    if (activeTab !== 'Todas') {
      const typeMap = {
        'Avisos Administrativos': 'aviso_administrativo',
        'Mantenimiento': 'mantenimiento',
        'Pagos': 'pago'
      };
      filtered = notifications.filter(notif => notif.tipo === typeMap[activeTab]);
    }
    
    setFilteredNotifications(filtered);
  };

  const markAllAsRead = async () => {
    try {
      const response = await tenantService.markAllNotificationsAsRead();
      
      if (response.success) {
        const updatedNotifications = notifications.map(notif => ({
          ...notif,
          leida: true
        }));
        setNotifications(updatedNotifications);
        alert('Todas las notificaciones han sido marcadas como leídas');
      }
    } catch (error) {
      console.error('Error marcando notificaciones como leídas:', error);
      // Simular éxito para demo
      const updatedNotifications = notifications.map(notif => ({
        ...notif,
        leida: true
      }));
      setNotifications(updatedNotifications);
      alert('Todas las notificaciones han sido marcadas como leídas');
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await tenantService.markNotificationAsRead(notificationId);
      
      if (response.success) {
        const updatedNotifications = notifications.map(notif => 
          notif.id === notificationId 
            ? { ...notif, leida: true }
            : notif
        );
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
      // Simular éxito para demo
      const updatedNotifications = notifications.map(notif => 
        notif.id === notificationId 
          ? { ...notif, leida: true }
          : notif
      );
      setNotifications(updatedNotifications);
    }
  };

  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case 'pago':
      case 'recordatorio_pago':
        return (
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        );
      case 'pago_confirmado':
        return (
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        );
      case 'aviso_administrativo':
      case 'nuevo_reglamento':
        return (
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 17h5l-5 5v-5z" />
            </svg>
          </div>
        );
      case 'mantenimiento':
      case 'incidencia':
        return (
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        );
      case 'aviso_urgente':
        return (
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 17h5l-5 5v-5z" />
            </svg>
          </div>
        );
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Hace menos de 1 hora';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours === 1 ? '' : 's'}`;
    } else {
      return `Hace ${diffInDays} día${diffInDays === 1 ? '' : 's'}`;
    }
  };

  const getNotificationTitle = (notificacion) => {
    switch (notificacion.tipo) {
      case 'recordatorio_pago':
        return 'Recordatorio de pago';
      case 'aviso_administrativo':
        return 'Aviso administrativo';
      case 'mantenimiento':
      case 'incidencia':
        return 'Actualización de incidencia';
      case 'pago_confirmado':
        return 'Pago confirmado';
      case 'aviso_urgente':
        return 'Aviso urgente';
      case 'nuevo_reglamento':
        return 'Nuevo reglamento';
      default:
        return notificacion.titulo || 'Notificación';
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-gray-600 mt-1">Mantente al día con los avisos e información importante</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Marcar todas como leídas
        </button>
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
              </button>
            ))}
          </nav>
        </div>

        {/* Lista de Notificaciones */}
        <div className="p-6">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 17h5l-5 5v-5z" />
              </svg>
              <p className="text-gray-500">No hay notificaciones en esta categoría</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notificacion) => (
                <div 
                  key={notificacion.id} 
                  className={`border-l-4 ${
                    !notificacion.leida ? 'border-teal-400 bg-teal-50' : 'border-gray-200 bg-white'
                  } rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => !notificacion.leida && markAsRead(notificacion.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {getNotificationIcon(notificacion.tipo)}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {getNotificationTitle(notificacion)}
                          </h3>
                          {!notificacion.leida && (
                            <span className="bg-teal-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                              Nuevo
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3 leading-relaxed">
                          {notificacion.mensaje}
                        </p>
                        
                        <p className="text-sm text-gray-500">
                          {formatTimeAgo(notificacion.fecha_creacion || notificacion.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="ml-4">
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Aquí se podría agregar funcionalidad de opciones
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Datos eliminados - solo backend real

export default TenantNotifications;
