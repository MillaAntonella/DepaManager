import api from './api/axiosConfig';

class TenantService {
  // Obtener dashboard del inquilino
  async getDashboard() {
    try {
      const response = await api.get('/tenant/dashboard');
      console.log('🏠 TenantService: Dashboard response:', response.data);
      
      // El backend devuelve { success: true, data: dashboardData, mensaje: '...' }
      // Necesitamos extraer response.data.data
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error('Formato de respuesta inválido del servidor');
      }
    } catch (error) {
      console.error('Error obteniendo dashboard del inquilino:', error);
      throw error;
    }
  }

  // Obtener pagos del inquilino
  async getMyPayments() {
    try {
      const response = await api.get('/tenant/payments');
      console.log('💰 TenantService: Full response:', response);
      console.log('💰 TenantService: Response data:', response.data);
      console.log('💰 TenantService: Response data type:', typeof response.data);
      console.log('💰 TenantService: Response data keys:', Object.keys(response.data));
      
      if (response.data.success) {
        console.log('💰 TenantService: Success=true, data:', response.data.data);
        console.log('💰 TenantService: Data type:', typeof response.data.data);
        console.log('💰 TenantService: Is array?:', Array.isArray(response.data.data));
        return response.data.data;
      }
      
      // El backend devuelve { success: true, data: paymentsData, mensaje: '...' }
      // Necesitamos extraer response.data.data
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error('Formato de respuesta inválido del servidor');
      }
    } catch (error) {
      console.error('Error obteniendo pagos del inquilino:', error);
      throw error;
    }
  }

  // Obtener incidencias del inquilino
  async getMyIncidents() {
    try {
      const response = await api.get('/tenant/incidents');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo incidencias del inquilino:', error);
      throw error;
    }
  }

  // Crear nueva incidencia
  async createIncident(incidentData) {
    try {
      const response = await api.post('/tenant/incidents', incidentData);
      return response.data;
    } catch (error) {
      console.error('Error creando incidencia:', error);
      throw error;
    }
  }

  // Obtener notificaciones del inquilino
  async getMyNotifications() {
    try {
      const response = await api.get('/tenant/notifications');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo notificaciones del inquilino:', error);
      throw error;
    }
  }

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId) {
    try {
      const response = await api.patch(`/tenant/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
      throw error;
    }
  }

  // Obtener perfil del inquilino
  async getProfile() {
    try {
      const response = await api.get('/tenant/profile');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo perfil del inquilino:', error);
      throw error;
    }
  }

  // Actualizar perfil del inquilino
  async updateProfile(profileData) {
    try {
      const response = await api.put('/tenant/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando perfil del inquilino:', error);
      throw error;
    }
  }

  // Obtener información del departamento
  async getMyApartment() {
    try {
      const response = await api.get('/tenant/apartment');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo información del departamento:', error);
      throw error;
    }
  }

  // Procesar pago
  async processPayment(paymentData) {
    try {
      const response = await api.post('/tenant/payments/process', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error procesando pago:', error);
      throw error;
    }
  }

  // Marcar pago como pagado (para cuando el inquilino confirma el pago)
  async markPaymentAsPaid(pagoId, metodoPago) {
    try {
      const response = await api.patch(`/tenant/payments/${pagoId}/pay`, {
        metodo_pago: metodoPago
      });
      return response.data;
    } catch (error) {
      console.error('Error marcando pago como pagado:', error);
      throw error;
    }
  }

  // Obtener historial de pagos del inquilino
  async getMyPayments() {
    try {
      const response = await api.get('/tenant/payments');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error obteniendo pagos:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al obtener los pagos'
      };
    }
  }

  // ===== INCIDENCIAS =====

  // Obtener incidencias del inquilino
  async getMyIncidents() {
    try {
      const response = await api.get('/tenant/incidents');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error obteniendo incidencias:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al obtener las incidencias'
      };
    }
  }

  // Reportar nueva incidencia
  async reportIncident(incidentData) {
    try {
      const response = await api.post('/tenant/incidents', incidentData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.mensaje || 'Incidencia reportada exitosamente'
      };
    } catch (error) {
      console.error('Error reportando incidencia:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al reportar la incidencia'
      };
    }
  }

  // ===== NOTIFICACIONES =====

  // Obtener notificaciones del inquilino
  async getMyNotifications() {
    try {
      const response = await api.get('/tenant/notifications');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al obtener las notificaciones'
      };
    }
  }

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId) {
    try {
      const response = await api.patch(`/tenant/notifications/${notificationId}/read`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.mensaje || 'Notificación marcada como leída'
      };
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al marcar la notificación como leída'
      };
    }
  }

  // Marcar todas las notificaciones como leídas
  async markAllNotificationsAsRead() {
    try {
      const response = await api.patch('/tenant/notifications/read-all');
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.mensaje || 'Todas las notificaciones marcadas como leídas'
      };
    } catch (error) {
      console.error('Error marcando todas las notificaciones como leídas:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al marcar todas las notificaciones como leídas'
      };
    }
  }


}

export const tenantService = new TenantService();