import React, { useState, useEffect } from 'react';
import { tenantService } from '../../services/tenantService';

const TenantHistory = () => {
  const [pagos, setPagos] = useState([]);
  const [filteredPagos, setFilteredPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Filtros
  const [filters, setFilters] = useState({
    mes: 'Todos',
    año: '2025',
    estado: 'Todos'
  });

  const meses = [
    'Todos', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const años = ['2023', '2024', '2025'];
  const estados = ['Todos', 'Pagado', 'Pendiente', 'Atrasado'];

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, pagos]);

  const loadPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await tenantService.getMyPayments();
      
      if (response.success) {
        setPagos(response.data);
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
      // Sin datos ficticios - dejar array vacío
      setPagos([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...pagos];

    // Filtro por mes
    if (filters.mes !== 'Todos') {
      const mesIndex = meses.indexOf(filters.mes);
      filtered = filtered.filter(pago => {
        const fechaPago = new Date(pago.fecha_pago || pago.createdAt);
        return fechaPago.getMonth() + 1 === mesIndex;
      });
    }

    // Filtro por año
    if (filters.año !== 'Todos') {
      filtered = filtered.filter(pago => {
        const fechaPago = new Date(pago.fecha_pago || pago.createdAt);
        return fechaPago.getFullYear().toString() === filters.año;
      });
    }

    // Filtro por estado
    if (filters.estado !== 'Todos') {
      const estadoFiltro = filters.estado.toLowerCase();
      filtered = filtered.filter(pago => {
        if (estadoFiltro === 'pagado') return pago.estado_pago === 'pagado';
        if (estadoFiltro === 'pendiente') return pago.estado_pago === 'pendiente';
        if (estadoFiltro === 'atrasado') {
          return pago.estado_pago === 'pendiente' && new Date(pago.fecha_vencimiento) < new Date();
        }
        return true;
      });
    }

    setFilteredPagos(filtered);
    setCurrentPage(1); // Reset página al aplicar filtros
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      mes: 'Todos',
      año: '2025',
      estado: 'Todos'
    });
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
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getMetodoPagoDisplay = (metodo) => {
    const metodos = {
      'transferencia_bancaria': 'Transferencia',
      'tarjeta_credito': 'Tarjeta',
      'efectivo': 'Efectivo',
      'deposito': 'Depósito'
    };
    return metodos[metodo] || metodo;
  };

  const getMetodoPagoIcon = (metodo) => {
    if (metodo === 'transferencia_bancaria') {
      return (
        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
          <span className="text-blue-600 text-xs">💳</span>
        </div>
      );
    }
    if (metodo === 'deposito') {
      return (
        <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
          <span className="text-purple-600 text-xs">🏦</span>
        </div>
      );
    }
    if (metodo === 'efectivo') {
      return (
        <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
          <span className="text-green-600 text-xs">💵</span>
        </div>
      );
    }
    return (
      <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
        <span className="text-gray-600 text-xs">💰</span>
      </div>
    );
  };

  const exportToPDF = () => {
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Historial de Pagos</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #0d9488; text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #0d9488; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .header-info { margin-bottom: 20px; padding: 15px; background-color: #f0fdfa; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>Historial de Pagos - Juan Pérez</h1>
          <div class="header-info">
            <p><strong>Departamento:</strong> 301</p>
            <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString('es-PE')}</p>
            <p><strong>Total de registros:</strong> ${filteredPagos.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${filteredPagos.map(pago => `
                <tr>
                  <td>${formatDate(pago.fecha_pago || pago.createdAt)}</td>
                  <td>${pago.concepto}</td>
                  <td>${formatSoles(pago.monto)}</td>
                  <td>${getMetodoPagoDisplay(pago.metodo_pago)}</td>
                  <td>${pago.estado_pago === 'pagado' ? 'Pagado' : 'Pendiente'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const exportToExcel = () => {
    const headers = ['Fecha', 'Concepto', 'Monto (S/)', 'Método', 'Estado'];
    const csvContent = [
      headers.join(','),
      ...filteredPagos.map(pago => [
        `"${formatDate(pago.fecha_pago || pago.createdAt)}"`,
        `"${pago.concepto}"`,
        pago.monto,
        `"${getMetodoPagoDisplay(pago.metodo_pago)}"`,
        `"${pago.estado_pago === 'pagado' ? 'Pagado' : 'Pendiente'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historial_pagos_${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPagos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPagos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando historial...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <nav className="text-sm text-gray-500 mb-2">
          Dashboard {'>'} Historial
        </nav>
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Historial de Pagos</h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Filtro Mes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
            <select
              value={filters.mes}
              onChange={(e) => handleFilterChange('mes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {meses.map(mes => (
                <option key={mes} value={mes}>{mes}</option>
              ))}
            </select>
          </div>

          {/* Filtro Año */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
            <select
              value={filters.año}
              onChange={(e) => handleFilterChange('año', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {años.map(año => (
                <option key={año} value={año}>{año}</option>
              ))}
            </select>
          </div>

          {/* Filtro Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filters.estado}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {estados.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex space-x-2">
            <button
              onClick={applyFilters}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Aplicar filtros
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Botones de exportación */}
        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={exportToPDF}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar PDF
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concepto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método de Pago
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
              {currentItems.map((pago) => (
                <tr key={pago.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(pago.fecha_pago || pago.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{pago.concepto}</div>
                      <div className="text-sm text-gray-500">
                        {pago.concepto.includes('Renta') ? 'Alquiler mensual' : 'Cuota de mantenimiento'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{formatSoles(pago.monto)}</div>
                    <div className="text-sm text-gray-500">MXN</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getMetodoPagoIcon(pago.metodo_pago)}
                      <span className="ml-2 text-sm text-gray-900">
                        {getMetodoPagoDisplay(pago.metodo_pago)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center w-fit">
                      ✅ Pagado
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => exportToPDF()}
                        className="text-teal-600 hover:text-teal-900 p-1 rounded"
                        title="Descargar comprobante"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => alert(`Ver detalles del pago: ${pago.concepto}`)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded"
                        title="Ver detalles"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{' '}
                <span className="font-medium">{Math.min(indexOfLastItem, filteredPagos.length)}</span> de{' '}
                <span className="font-medium">{filteredPagos.length}</span> registros
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === index + 1
                        ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantHistory;