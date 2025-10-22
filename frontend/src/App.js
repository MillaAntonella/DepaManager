import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SeleccionRol from './pages/SeleccionRol';
import PropietarioAuth from './pages/Auth/PropietarioAuth';
import InquilinoAuth from './pages/Auth/InquilinoAuth';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import './styles/App.css'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SeleccionRol />} />
        <Route path="/propietario" element={<PropietarioAuth />} />
        <Route path="/inquilino" element={<InquilinoAuth />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
