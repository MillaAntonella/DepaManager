import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Cambia esto si tu backend está en otra URL
});

export default api;
