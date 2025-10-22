import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield, FileText, Users, BrainCircuit, ChevronRight, UserCog, Home } from 'lucide-react';

function Inicio() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Building2 className="w-12 h-12 text-emerald-500" />,
      title: "Todo Centralizado",
      description: "Gestiona toda la información de inmuebles, inquilinos, propietarios y proveedores en un solo lugar."
    },
    {
      icon: <Shield className="w-12 h-12 text-emerald-500" />,
      title: "Seguridad Inteligente",
      description: "Sistema de reconocimiento de placas vehiculares con IA para control de accesos automatizado."
    },
    {
      icon: <FileText className="w-12 h-12 text-emerald-500" />,
      title: "Automatización Completa",
      description: "Facturas, recibos, pagos y notificaciones automáticas. Ahorra tiempo en tareas administrativas."
    },
    {
      icon: <Users className="w-12 h-12 text-emerald-500" />,
      title: "Gestión de Postulantes",
      description: "Proceso digital de evaluación y selección de nuevos inquilinos con seguimiento completo."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold text-slate-800">
                Depa<span className="text-emerald-600">Manager</span>
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-slate-700 hover:text-emerald-600 transition">Inicio</a>
              <a href="#funcionalidades" className="text-slate-700 hover:text-emerald-600 transition">Funcionalidades</a>
              <a href="#nosotros" className="text-slate-700 hover:text-emerald-600 transition">Nosotros</a>
              <a href="#acceso" className="text-slate-700 hover:text-emerald-600 transition">Acceso</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                Sistema de Gestión Inmobiliaria
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                Gestión Inteligente de <span className="text-emerald-600">Propiedades</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Plataforma integral para administrar inquilinos, propiedades y procesos. 
                Centraliza operaciones, automatiza pagos y refuerza la seguridad con tecnología de IA.
              </p>
              <div className="flex items-center space-x-3 text-slate-700 bg-white p-4 rounded-lg shadow-sm">
                <BrainCircuit className="w-6 h-6 text-purple-500" />
                <span className="text-sm font-medium">
                  Incluye reconocimiento de placas vehiculares con Inteligencia Artificial
                </span>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 backdrop-blur-lg rounded-lg p-6 text-white">
                    <Building2 className="w-8 h-8 mb-2" />
                    <p className="text-2xl font-bold">9+</p>
                    <p className="text-sm">Inmuebles Gratis</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-lg rounded-lg p-6 text-white">
                    <Shield className="w-8 h-8 mb-2" />
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-sm">Seguro</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-lg rounded-lg p-6 text-white">
                    <FileText className="w-8 h-8 mb-2" />
                    <p className="text-2xl font-bold">Auto</p>
                    <p className="text-sm">Facturas</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-lg rounded-lg p-6 text-white">
                    <Users className="w-8 h-8 mb-2" />
                    <p className="text-2xl font-bold">Digital</p>
                    <p className="text-sm">Gestión</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Toma el control, ahorra tiempo y dinero
            </h2>
            <p className="text-xl text-slate-600">
              Herramientas profesionales para una gestión eficiente
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 rounded-xl border-2 border-slate-100 hover:border-emerald-300 hover:shadow-xl transition duration-300 bg-gradient-to-br from-white to-slate-50"
              >
                <div className="mb-4 transform group-hover:scale-110 transition duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="nosotros" className="py-20 px-4 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">🤝 Nuestra Misión</h3>
              <p className="text-lg text-emerald-50 leading-relaxed">
                Facilitar la administración de propiedades mediante herramientas digitales modernas, 
                seguras y eficientes, permitiendo que los administradores y propietarios se enfoquen 
                en brindar una mejor experiencia a sus inquilinos.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">🌐 Nuestra Visión</h3>
              <p className="text-lg text-emerald-50 leading-relaxed">
                Convertirnos en la plataforma líder en gestión de inquilinos y propiedades a nivel 
                nacional, integrando tecnologías web y soluciones inteligentes que impulsen la 
                transformación digital del sector inmobiliario.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-2xl font-semibold text-white italic">
              💡 Innovación que administra, tecnología que protege
            </p>
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section id="acceso" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Accede al Sistema
            </h2>
            <p className="text-xl text-slate-600">
              Selecciona tu tipo de acceso
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Admin Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-slate-100 hover:border-emerald-400 transition duration-300">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                <UserCog className="w-12 h-12 mb-3" />
                <h3 className="text-2xl font-bold mb-2">Administradores</h3>
                <p className="text-emerald-50">
                  Gestiona propiedades, inquilinos y todas las operaciones del sistema
                </p>
              </div>
              <div className="p-6 space-y-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition duration-200"
                >
                  <span>Iniciar Sesión</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/registro')}
                  className="w-full bg-white hover:bg-slate-50 text-emerald-600 font-semibold py-3 px-6 rounded-lg border-2 border-emerald-600 flex items-center justify-center space-x-2 transition duration-200"
                >
                  <span>Registrarse</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <p className="text-sm text-slate-500 text-center">
                  ¿Primera vez? Crea tu cuenta de administrador
                </p>
              </div>
            </div>

            {/* Tenant Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-slate-100 hover:border-teal-400 transition duration-300">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
                <Home className="w-12 h-12 mb-3" />
                <h3 className="text-2xl font-bold mb-2">Inquilinos</h3>
                <p className="text-teal-50">
                  Accede a tu portal, revisa pagos, solicitudes y más
                </p>
              </div>
              <div className="p-6 space-y-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition duration-200"
                >
                  <span>Iniciar Sesión</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">Nota:</span> Las cuentas de inquilinos son creadas por los administradores del edificio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="w-8 h-8 text-emerald-400" />
            <span className="text-2xl font-bold">
              Depa<span className="text-emerald-400">Manager</span>
            </span>
          </div>
          <p className="text-slate-400 mb-2">
            Sistema integral de gestión inmobiliaria
          </p>
          <p className="text-slate-500 text-sm">
            © 2025 DepaManager. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Inicio;