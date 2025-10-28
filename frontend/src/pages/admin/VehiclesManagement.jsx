import React from 'react';

const VehiclesManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Vehículos</h1>
          <p className="text-gray-600 mt-1">Administra los vehículos registrados</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Próximamente</h3>
        <p className="text-gray-500">Esta funcionalidad estará disponible pronto.</p>
      </div>
    </div>
  );
};

export default VehiclesManagement;
