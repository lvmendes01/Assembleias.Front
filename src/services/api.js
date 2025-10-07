
import axios from 'axios'

const api = axios.create({

  baseURL:'https://localhost:7183/api',
//  baseURL: 'http://www.lvmendes.com.br.iron.hostazul.com.br/api',
  timeout: 5000
})

// Adicionar token automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
