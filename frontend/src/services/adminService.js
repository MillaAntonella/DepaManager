import api from './api/axiosConfig';

class AdminService {
  // ===== PAGOS =====

  // Obtener todos los pagos
  async getAllPayments() {
    try {
      const response = await api.get('/admin/payments');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo pagos:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al obtener los pagos'
      };
    }
  }

  // Crear nuevo pago
  async createPayment(paymentData) {
    try {
      const response = await api.post('/admin/payments', paymentData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.mensaje || 'Pago creado exitosamente'
      };
    } catch (error) {
      console.error('Error creando pago:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al crear el pago'
      };
    }
  }

  // Actualizar pago
  async updatePayment(paymentId, paymentData) {
    try {
      const response = await api.put(`/admin/payments/${paymentId}`, paymentData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.mensaje || 'Pago actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error actualizando pago:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al actualizar el pago'
      };
    }
  }

  // Eliminar pago
  async deletePayment(paymentId) {
    try {
      const response = await api.delete(`/admin/payments/${paymentId}`);
      return {
        success: true,
        message: response.data.mensaje || 'Pago eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error eliminando pago:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al eliminar el pago'
      };
    }
  }

  // Marcar pago como pagado
  async markPaymentAsPaid(paymentId, paymentMethod = 'Transferencia') {
    try {
      const response = await api.patch(`/admin/payments/${paymentId}/mark-paid`, {
        metodo_pago: paymentMethod,
        fecha_pago: new Date().toISOString()
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.mensaje || 'Pago marcado como pagado exitosamente'
      };
    } catch (error) {
      console.error('Error marcando pago como pagado:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al marcar el pago como pagado'
      };
    }
  }

  // Obtener estadísticas de pagos
  async getPaymentStats() {
    try {
      const response = await api.get('/admin/payments/stats');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de pagos:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al obtener las estadísticas'
      };
    }
  }

  // ===== INCIDENCIAS =====

  // Obtener todas las incidencias
  async getAllIncidents() {
    try {
      const response = await api.get('/admin/incidents');
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

  // Actualizar estado de incidencia
  async updateIncidentStatus(incidentId, status) {
    try {
      const response = await api.patch(`/admin/incidents/${incidentId}/status`, {
        estado: status
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.mensaje || 'Estado de incidencia actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error actualizando estado de incidencia:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al actualizar el estado de la incidencia'
      };
    }
  }

  // Asignar proveedor a incidencia
  async assignProviderToIncident(incidentId, providerId) {
    try {
      const response = await api.patch(`/admin/incidents/${incidentId}/assign`, {
        id_proveedor: providerId
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.mensaje || 'Proveedor asignado exitosamente'
      };
    } catch (error) {
      console.error('Error asignando proveedor:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al asignar el proveedor'
      };
    }
  }

  // ===== INQUILINOS =====

  // Obtener todos los inquilinos
  async getAllTenants() {
    try {
      const response = await api.get('/admin/tenants');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error obteniendo inquilinos:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al obtener los inquilinos'
      };
    }
  }

  // ===== NOTIFICACIONES =====

  // Enviar notificación a inquilino
  async sendNotificationToTenant(tenantId, notification) {
    try {
      const response = await api.post(`/admin/tenants/${tenantId}/notifications`, notification);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.mensaje || 'Notificación enviada exitosamente'
      };
    } catch (error) {
      console.error('Error enviando notificación:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al enviar la notificación'
      };
    }
  }

  // Enviar notificación masiva
  async sendBulkNotification(notification) {
    try {
      const response = await api.post('/admin/notifications/bulk', notification);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.mensaje || 'Notificaciones enviadas exitosamente'
      };
    } catch (error) {
      console.error('Error enviando notificaciones masivas:', error);
      return {
        success: false,
        message: error.response?.data?.mensaje || 'Error al enviar las notificaciones'
      };
    }
  }

  // Obtener lista de inquilinos
  async getTenants() {
    console.log('🌐 AdminService: Realizando petición GET /admin/tenants');
    try {
      const response = await api.get('/admin/tenants');
      console.log('📦 AdminService: Respuesta cruda del servidor:', response);
      console.log('📊 AdminService: Data de la respuesta:', response.data);
      
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.mensaje || 'Inquilinos obtenidos exitosamente'
      };
    } catch (error) {
      console.error('💥 AdminService: Error obteniendo inquilinos:', error);
      console.error('🔍 AdminService: Detalles del error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      return {
        success: false,
        data: [],
        message: error.response?.data?.mensaje || 'Error al obtener los inquilinos'
      };
    }
  }
}

export const adminService = new AdminService();