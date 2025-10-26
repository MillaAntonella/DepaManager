import api from './axiosConfig';

export const authService = {
  // Login para propietarios e inquilinos
  login: async (email, password, rolEsperado) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        rolEsperado
      });
      
      // Guardar token y usuario en localStorage
      const { token, usuario } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Registro solo para propietarios
  register: async (nombre, email, password) => {
    try {
      const response = await api.post('/auth/registro', {
        nombre,
        email,
        password,
        rol: 'propietario' // Solo propietarios pueden registrarse
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Crear inquilino (solo propietarios pueden hacerlo)
  createTenant: async (nombre, email, password) => {
    try {
      const response = await api.post('/auth/crear-inquilino', {
        nombre,
        email,
        password
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener perfil del usuario logueado
  getProfile: async () => {
    try {
      const response = await api.get('/auth/perfil');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Dashboard (información según rol)
  getDashboard: async () => {
    try {
      const response = await api.get('/auth/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar perfil (email y/o contraseña)
  updateProfile: async (email, password, passwordActual) => {
    try {
      const updateData = {};
      
      if (email) updateData.email = email;
      if (password) {
        updateData.password = password;
        updateData.passwordActual = passwordActual;
      }

      const response = await api.put('/auth/perfil', updateData);
      
      // Actualizar usuario en localStorage si cambió el email
      if (email) {
        const currentUser = JSON.parse(localStorage.getItem('usuario'));
        currentUser.email = email;
        localStorage.setItem('usuario', JSON.stringify(currentUser));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/';
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }
};

export default authService;