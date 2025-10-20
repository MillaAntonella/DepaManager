import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SeleccionRol from './components/SeleccionRol';
import PropietarioAuth from './components/PropietarioAuth';
import InquilinoAuth from './components/InquilinoAuth';
import Inicio from './components/Inicio';
import Login from './components/Login';
import Registro from './components/Registro';
import Dashboard from './components/Dashboard';
import './App.css';

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
