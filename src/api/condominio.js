import api from './api'

export default {
  getAll: async () => {
    const response = await api.get('/condominio')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/condominio/${id}`)
    return response.data
  },

  create: async (condominio) => {
    const response = await api.post('/condominio', condominio)
    return response.data
  },

  update: async (id, condominio) => {
    const response = await api.put(`/condominio/${id}`, condominio)
    return response.data
  },

  remove: async (id) => {
    const response = await api.delete(`/condominio/${id}`)
    return response.data
  },
}
