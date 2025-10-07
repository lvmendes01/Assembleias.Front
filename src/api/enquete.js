// api/enquete.js
import api from './api'

export default {
  getAll: async () => {
    const response = await api.get('/enquete')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/enquete/${id}`)
    return response.data
  },


  create: async (enquete) => {
  // Clona o objeto para não alterar o original
  const payload = { ...enquete };
  
  // Remove o id se estiver vazio ou null
  if (!payload.id) delete payload.id;

  const response = await api.post('/enquete', payload);
  return response.data;
},
  

  update: async (id, enquete) => {
    const response = await api.put(`/enquete/${id}`, enquete)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/enquete/${id}`)
    return response.data
  },
}
