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


  // Cria uma nova condominio
create: async (condominio) => {
  // Clona o objeto para não alterar o original
  const payload = { ...condominio };
  
  // Remove o id se estiver vazio ou null
  if (!payload.id) delete payload.id;

  const response = await api.post('/condominio', payload);
  return response.data;
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
