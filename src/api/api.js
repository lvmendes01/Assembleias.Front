import axios from 'axios';

const api = axios.create({
  baseURL: 'http://www.lvmendes.com.br.iron.hostazul.com.br/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
