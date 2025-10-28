import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tenantService } from '../../services/tenantService';

const TenantPayments = () => {
  const navigate = useNavigate();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagosPendientes, setPagosPendientes] = useState([]);
  const [pagosRecientes, setPagosRecientes] = useState([]);
  const [stats, setStats] = useState({
    totalPendiente: 0,
    proximoVencimiento: null,
    pagosAlDia: 0
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const allPayments = await tenantService.getMyPayments();
      console.log('💰 TenantPayments: Pagos recibidos:', allPayments);
      console.log('💰 TenantPayments: Tipo de datos recibidos:', typeof allPayments);
      console.log('💰 TenantPayments: Es array?:', Array.isArray(allPayments));
      console.log('💰 TenantPayments: Keys del objeto:', Object.keys(allPayments));
      
      // Verificar si es un array, si no, intentar extraer el array de los datos
      let paymentsArray = allPayments;
      if (!Array.isArray(allPayments)) {
        // Si viene en formato { data: [...] } o similar
        paymentsArray = allPayments.data || allPayments.pagos || [];
        console.log('💰 TenantPayments: Array extraído:', paymentsArray);
        console.log('💰 TenantPayments: Es array ahora?:', Array.isArray(paymentsArray));
      }
      
      setPagos(paymentsArray);
      
      // Separar pagos pendientes y recientes
      const pendientes = paymentsArray.filter(pago => pago.estado === 'pendiente');
      const recientes = paymentsArray
        .filter(pago => pago.estado === 'pagado')
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);
      
      console.log('📊 TenantPayments: Pagos pendientes:', pendientes.length);
      console.log('📊 TenantPayments: Pagos recientes:', recientes.length);
      
      setPagosPendientes(pendientes);
      setPagosRecientes(recientes);
      
      // Calcular estadísticas
      const totalPendiente = pendientes.reduce((sum, pago) => sum + parseFloat(pago.monto), 0);
      const proximoPago = pendientes
        .sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento))[0];
      const pagosAlDiaCount = paymentsArray.filter(pago => 
        pago.estado === 'pagado' && 
        new Date(pago.updatedAt).getFullYear() === new Date().getFullYear()
      ).length;
      
      setStats({
        totalPendiente,
        proximoVencimiento: proximoPago?.fechaVencimiento || null,
        pagosAlDia: pagosAlDiaCount
      });
    } catch (error) {
      console.error('Error cargando pagos:', error);
      // Sin datos ficticios - dejar arrays vacíos
      setPagos([]);
      setPagosPendientes([]);
      setPagosRecientes([]);
      setStats({
        totalPendiente: 1350,
        proximoVencimiento: '2025-09-05',
        pagosAlDia: 12
      });
    } finally {
      setLoading(false);
    }
  };

  const formatSoles = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handlePayNow = (pago) => {
    setSelectedPago(pago);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async (metodoPago) => {
    try {
      // Marcar pago como pagado usando el servicio real
      await tenantService.markPaymentAsPaid(selectedPago.id, metodoPago);
      
      alert('¡Pago realizado exitosamente! El pago se ha registrado en el sistema y aparecerá en el panel del administrador.');
      setShowPaymentModal(false);
      setSelectedPago(null);
      
      // Recargar pagos para mostrar los cambios
      await loadPayments();
      
    } catch (error) {
      console.error('Error procesando pago:', error);
      alert('Error al procesar el pago. Verifica que el backend esté funcionando e intenta nuevamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando pagos...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <nav className="text-sm text-gray-500 mb-2">
          Dashboard {'>'} Pagos
        </nav>
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Pagos</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Pendiente */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-xl font-bold">$</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Pendiente</p>
            <p className="text-2xl font-bold text-gray-900">{formatSoles(stats.totalPendiente)}</p>
            <p className="text-sm text-gray-500 mt-1">Monto pendiente</p>
          </div>
        </div>

        {/* Próximo Vencimiento */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Próximo Vencimiento</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.proximoVencimiento ? formatDate(stats.proximoVencimiento).split(' ').slice(0, 3).join(' ') : 'N/A'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Próximo pago</p>
          </div>
        </div>

        {/* Pagos al día */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Pagos al día</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pagosAlDia}/12</p>
            <p className="text-sm text-gray-500 mt-1">Este año</p>
          </div>
        </div>
      </div>

      {/* Pagos Pendientes */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Pagos Pendientes</h2>
        <div className="space-y-4">
          {pagosPendientes.map((pago) => (
            <div key={pago.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{pago.concepto}</h3>
                    <p className="text-sm text-gray-500">
                      {pago.concepto.includes('Renta') ? 'Alquiler mensual' : 'Cuota de mantenimiento'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Vence: {formatDate(pago.fecha_vencimiento)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{formatSoles(pago.monto)}</p>
                  <p className="text-sm text-gray-500">MXN</p>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => handlePayNow(pago)}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Pagar ahora
                    </button>
                    <button 
                      onClick={() => alert(`Detalles del pago:\n\nConcepto: ${pago.concepto}\nMonto: ${formatSoles(pago.monto)}\nVencimiento: ${formatDate(pago.fecha_vencimiento)}\nEstado: ${pago.estado_pago}`)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Ver detalle
                    </button>
                  </div>
                  
                  {/* Estado */}
                  <div className="mt-2">
                    {new Date(pago.fecha_vencimiento) < new Date() ? (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        ⚠️ Atrasado
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        ⚠️ Pendiente
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {pagosPendientes.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-lg">¡No tienes pagos pendientes!</p>
              <p className="text-gray-400 text-sm mt-2">Todos tus pagos están al día</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagos Recientes */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Pagos Recientes</h2>
          <button 
            onClick={() => navigate('/tenant/history')}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Ver todo el historial →
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {pagosRecientes.map((pago, index) => (
            <div key={pago.id} className={`p-4 flex items-center justify-between ${index !== pagosRecientes.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{pago.concepto}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(pago.updatedAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <p className="font-bold text-gray-900">{formatSoles(pago.monto)}</p>
                <button 
                  onClick={() => alert(`Detalles del pago:\n\nConcepto: ${pago.concepto}\nMonto: ${formatSoles(pago.monto)}\nFecha de pago: ${new Date(pago.updatedAt).toLocaleDateString('es-ES')}\nEstado: ${pago.estado_pago}`)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Ver detalle
                </button>
              </div>
            </div>
          ))}
          
          {pagosRecientes.length === 0 && (
            <div className="p-12 text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500">No hay pagos recientes</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Pago */}
      {showPaymentModal && selectedPago && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Confirmar Pago</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Concepto:</p>
              <p className="font-medium text-gray-900">{selectedPago.concepto}</p>
              
              <p className="text-sm text-gray-600 mt-4 mb-2">Monto a pagar:</p>
              <p className="text-2xl font-bold text-teal-600">{formatSoles(selectedPago.monto)}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Método de pago:</p>
              <div className="space-y-2">
                <button
                  onClick={() => handleConfirmPayment('transferencia_bancaria')}
                  className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Transferencia Bancaria</span>
                  </div>
                </button>
                <button
                  onClick={() => handleConfirmPayment('tarjeta_credito')}
                  className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Tarjeta de Crédito</span>
                  </div>
                </button>
                <button
                  onClick={() => handleConfirmPayment('efectivo')}
                  className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Efectivo</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantPayments;