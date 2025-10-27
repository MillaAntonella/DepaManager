import React, { useState, useEffect } from 'react';
import { authService } from '../../services/api/auth';

const PaymentsManagement = () => {
  const [pagos, setPagos] = useState([]);
  const [pagoStats, setPagoStats] = useState({
    ingresosMes: 0,
    pagosPendientes: 0,
    pagosVencidos: 0,
    tasaCobro: 0
  });
  const [loadingPagos, setLoadingPagos] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [creatingPago, setCreatingPago] = useState(false);
  const [updatingPago, setUpdatingPago] = useState(false);
  
  // Estados para formularios
  const [newPago, setNewPago] = useState({
    concepto: 'Alquiler mensual',
    monto: '',
    id_contrato: 1
  });
  const [editPago, setEditPago] = useState({
    concepto: '',
    monto: '',
    estado_pago: '',
    metodo_pago: ''
  });

  useEffect(() => {
    loadPagos();
  }, []);

  const loadPagos = async () => {
    setLoadingPagos(true);
    try {
      console.log('Cargando pagos desde backend...');
      const data = await authService.getPayments();
      console.log('Datos recibidos del backend:', data);
      
      setPagos(data.pagos || []);
      setPagoStats(data.estadisticas || {
        ingresosMes: 0,
        pagosPendientes: 0,  
        pagosVencidos: 0,
        tasaCobro: 0
      });
    } catch (error) {
      console.error('Error cargando pagos desde backend:', error);
      setPagos([]);
      setPagoStats({
        ingresosMes: 0,
        pagosPendientes: 0,
        pagosVencidos: 0,
        tasaCobro: 0
      });
      alert('Error al conectar con el servidor. Verifica que el backend esté funcionando.');
    } finally {
      setLoadingPagos(false);
    }
  };

  // Función para formatear montos en soles peruanos
  const formatSoles = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Función para crear nuevo pago
  const handleCreatePago = async (e) => {
    e.preventDefault();
    setCreatingPago(true);
    
    try {
      console.log('Creando pago en backend...');
      const result = await authService.createPayment({
        concepto: newPago.concepto,
        monto: parseFloat(newPago.monto),
        id_contrato: newPago.id_contrato
      });
      
      console.log('Pago creado en backend:', result);
      
      // Recargar la lista de pagos desde el backend
      await loadPagos();
      
      // Resetear formulario y cerrar modal
      setNewPago({ concepto: 'Alquiler mensual', monto: '', id_contrato: 1 });
      setShowCreateModal(false);
      
      alert('Pago creado exitosamente en la base de datos');
    } catch (error) {
      console.error('Error creando pago:', error);
      alert(error.mensaje || 'Error al crear el pago. Verifica que el backend esté funcionando.');
    } finally {
      setCreatingPago(false);
    }
  };

  // Función para ver detalles del pago
  const handleViewPago = (pago) => {
    setSelectedPago(pago);
    setShowViewModal(true);
  };

  // Función para editar pago
  const handleEditPago = (pago) => {
    setSelectedPago(pago);
    setEditPago({
      concepto: pago.concepto,
      monto: pago.monto.toString(),
      estado_pago: pago.estado.toLowerCase(),
      metodo_pago: pago.metodoPago === 'Tarjeta de Crédito' ? 'tarjeta_credito' :
                   pago.metodoPago === 'Transferencia' ? 'transferencia_bancaria' :
                   pago.metodoPago === 'Efectivo' ? 'efectivo' : ''
    });
    setShowEditModal(true);
  };

  // Función para guardar cambios de edición
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setUpdatingPago(true);
    
    try {
      await authService.updatePayment(selectedPago.id, {
        monto: parseFloat(editPago.monto),
        estado_pago: editPago.estado_pago,
        metodo_pago: editPago.metodo_pago
      });
      
      // Recargar la lista de pagos desde el backend
      await loadPagos();
      
      setShowEditModal(false);
      alert('Pago actualizado exitosamente en la base de datos');
    } catch (error) {
      console.error('Error actualizando pago:', error);
      alert(error.mensaje || 'Error al actualizar el pago. Verifica que el backend esté funcionando.');
    } finally {
      setUpdatingPago(false);
    }
  };

  // Función para marcar como pagado
  const handleMarkAsPaid = async (pago) => {
    try {
      const metodoPago = prompt('Selecciona método de pago:\n1. Efectivo\n2. Transferencia\n3. Tarjeta de Crédito\n\nEscribe el número:');
      
      if (!metodoPago) return;
      
      const metodos = {
        '1': 'efectivo',
        '2': 'transferencia_bancaria',
        '3': 'tarjeta_credito'
      };
      
      const metodoSeleccionado = metodos[metodoPago];
      if (!metodoSeleccionado) {
        alert('Opción inválida');
        return;
      }
      
      await authService.markPaymentAsPaid(pago.id, metodoSeleccionado);
      
      // Recargar la lista de pagos desde el backend
      await loadPagos();
      
      alert('Pago marcado como pagado exitosamente en la base de datos');
    } catch (error) {
      console.error('Error marcando pago como pagado:', error);
      alert(error.mensaje || 'Error al marcar el pago como pagado. Verifica que el backend esté funcionando.');
    }
  };

  // Función para eliminar pago
  const handleDeletePago = async (pago) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el pago de ${formatSoles(pago.monto)}?`)) {
      try {
        await authService.deletePayment(pago.id);
        
        // Recargar la lista de pagos desde el backend
        await loadPagos();
        
        alert('Pago eliminado exitosamente de la base de datos');
      } catch (error) {
        console.error('Error eliminando pago:', error);
        alert(error.mensaje || 'Error al eliminar el pago. Verifica que el backend esté funcionando.');
      }
    }
  };

  // Función para mostrar opciones de exportación
  const handleExportPagos = () => {
    if (pagos.length === 0) {
      alert('No hay pagos para exportar');
      return;
    }

    const formato = prompt('Selecciona el formato de exportación:\n1. Excel (.xlsx)\n2. PDF\n\nEscribe el número:');
    
    if (!formato) return;
    
    if (formato === '1') {
      exportToExcel();
    } else if (formato === '2') {
      exportToPDF();
    } else {
      alert('Opción inválida. Selecciona 1 para Excel o 2 para PDF.');
    }
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    const headers = ['Inquilino', 'Concepto', 'Monto (S/)', 'Estado', 'Fecha Vencimiento', 'Método de Pago', 'Fecha de Pago'];
    
    // Para Excel, usamos formato CSV que Excel puede abrir
    const csvContent = [
      headers.join(','),
      ...pagos.map(pago => [
        `"${pago.inquilino}"`,
        `"${pago.concepto}"`,
        pago.monto,
        `"${pago.estado}"`,
        `"${pago.fechaVencimiento || ''}"`,
        `"${pago.metodoPago || ''}"`,
        `"${pago.fechaPago || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pagos_${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('Archivo Excel descargado exitosamente');
  };

  // Función para exportar a PDF
  const exportToPDF = () => {
    // Crear contenido HTML para el PDF
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Reporte de Pagos</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .summary { margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>Reporte de Pagos</h1>
          <div class="summary">
            <p><strong>Total de pagos:</strong> ${pagos.length}</p>
            <p><strong>Ingresos totales:</strong> ${formatSoles(pagos.filter(p => p.estado === 'Pagado').reduce((sum, p) => sum + p.monto, 0))}</p>
            <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString('es-PE')}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Inquilino</th>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Fecha Vencimiento</th>
                <th>Método de Pago</th>
                <th>Fecha de Pago</th>
              </tr>
            </thead>
            <tbody>
              ${pagos.map(pago => `
                <tr>
                  <td>${pago.inquilino}</td>
                  <td>${pago.concepto}</td>
                  <td>${formatSoles(pago.monto)}</td>
                  <td>${pago.estado}</td>
                  <td>${pago.fechaVencimiento || '-'}</td>
                  <td>${pago.metodoPago || '-'}</td>
                  <td>${pago.fechaPago || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Crear el PDF usando print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Esperar a que cargue y luego imprimir/guardar como PDF
    setTimeout(() => {
      printWindow.print();
      alert('Se abrió la ventana para guardar como PDF. Selecciona "Guardar como PDF" en las opciones de impresión.');
    }, 500);
  };

  // Función para cerrar modales
  const handleModalClose = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedPago(null);
    setNewPago({ concepto: 'Alquiler mensual', monto: '', id_contrato: 1 });
    setEditPago({ concepto: '', monto: '', estado_pago: '', metodo_pago: '' });
  };

  // Filtrar pagos según la búsqueda
  const filteredPagos = pagos.filter(pago =>
    pago.inquilino?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pago.concepto?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pago.estado?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loadingPagos) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h2>
              <p className="text-gray-600 mt-1">Administra recibos, pagos y reportes financieros</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={handleExportPagos}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar (PDF/Excel)
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Crear
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Sección: Todos los estados */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Todos los estados</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Ingresos del Mes</p>
                    <p className="text-2xl font-bold text-gray-900">{formatSoles(pagoStats.ingresosMes)}</p>
                    <p className="text-sm text-gray-500">{pagoStats.ingresosMes > 0 ? '+32% vs mes anterior' : 'Sin ingresos aún'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pagos Pendientes</p>
                    <p className="text-2xl font-bold text-gray-900">{pagoStats.pagosPendientes}</p>
                    <p className="text-sm text-gray-500">{pagoStats.pagosPendientes > 0 ? 'Por cobrar' : 'Sin pendientes'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pagos Vencidos</p>
                    <p className="text-2xl font-bold text-gray-900">{pagoStats.pagosVencidos}</p>
                    <p className="text-sm text-red-600">{pagoStats.pagosVencidos > 0 ? 'Requiere atención' : 'Sin vencidos'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Tasa de Cobro</p>
                    <p className="text-2xl font-bold text-gray-900">{pagoStats.tasaCobro}%</p>
                    <p className="text-sm text-teal-600">{pagoStats.tasaCobro >= 90 ? 'Excelente' : pagoStats.tasaCobro >= 70 ? 'Buena' : 'Mejorable'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Progreso Mensual */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Progreso Mensual</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Enero</span>
                  <span className="text-sm text-gray-500">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Febrero</span>
                  <span className="text-sm text-gray-500">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Marzo</span>
                  <span className="text-sm text-gray-500">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Tabla de Pagos */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Lista de Pagos</h3>
              <div className="flex space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar pagos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {pagos.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pagos registrados</h3>
                <p className="mt-1 text-sm text-gray-500">Comienza creando tu primer pago.</p>
                <div className="mt-6">
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Crear Pago
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inquilino
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Concepto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Vencimiento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Método de Pago
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha de Pago
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPagos.map((pago) => (
                      <tr key={pago.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {pago.inquilino?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{pago.inquilino}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pago.concepto}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatSoles(pago.monto)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pago.fechaVencimiento}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            pago.estado === 'Pagado' 
                              ? 'bg-green-100 text-green-800' 
                              : pago.estado === 'Pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {pago.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pago.metodoPago || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pago.fechaPago || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewPago(pago)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Ver
                            </button>
                            <button 
                              onClick={() => handleEditPago(pago)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Editar
                            </button>
                            {pago.estado !== 'Pagado' && (
                              <button 
                                onClick={() => handleMarkAsPaid(pago)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Marcar Pagado
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeletePago(pago)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
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

      {/* Modal para crear pago */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Crear Nuevo Pago</h3>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreatePago}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Concepto
                  </label>
                  <input
                    type="text"
                    value={newPago.concepto}
                    onChange={(e) => setNewPago(prev => ({ ...prev, concepto: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto (S/)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={newPago.monto}
                    onChange={(e) => setNewPago(prev => ({ ...prev, monto: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                  />
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
                    disabled={creatingPago}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {creatingPago ? 'Creando...' : 'Crear Pago'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver pago */}
      {showViewModal && selectedPago && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Detalles del Pago</h3>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inquilino</label>
                  <div className="text-lg text-gray-900">{selectedPago.inquilino}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Concepto</label>
                  <div className="text-lg text-gray-900">{selectedPago.concepto}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                  <div className="text-lg font-bold text-gray-900">{formatSoles(selectedPago.monto)}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedPago.estado === 'Pagado' 
                      ? 'bg-green-100 text-green-800' 
                      : selectedPago.estado === 'Pendiente'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedPago.estado}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
                  <div className="text-lg text-gray-900">{selectedPago.fechaVencimiento || 'No especificada'}</div>
                </div>

                {selectedPago.metodoPago && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                    <div className="text-lg text-gray-900">{selectedPago.metodoPago}</div>
                  </div>
                )}

                {selectedPago.fechaPago && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Pago</label>
                    <div className="text-lg text-gray-900">{selectedPago.fechaPago}</div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar pago */}
      {showEditModal && selectedPago && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Editar Pago</h3>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSaveEdit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto (S/)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={editPago.monto}
                    onChange={(e) => setEditPago(prev => ({ ...prev, monto: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={editPago.estado_pago}
                    onChange={(e) => setEditPago(prev => ({ ...prev, estado_pago: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="vencido">Vencido</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago
                  </label>
                  <select
                    value={editPago.metodo_pago}
                    onChange={(e) => setEditPago(prev => ({ ...prev, metodo_pago: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar método</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia_bancaria">Transferencia Bancaria</option>
                    <option value="tarjeta_credito">Tarjeta de Crédito</option>
                  </select>
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
                    disabled={updatingPago}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {updatingPago ? 'Guardando...' : 'Guardar Cambios'}
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

export default PaymentsManagement;
