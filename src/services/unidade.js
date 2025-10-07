import api from './api'

export default {
  // Retorna todas as unidades
  getAll: async () => {
    const response = await api.get('/unidade')
    return response.data
  },

  // Retorna uma unidade pelo ID
  getById: async (id) => {
    const response = await api.get(`/unidade/${id}`)
    return response.data
  },

  // Cria uma nova unidade
  create: async (unidade) => {
  // Clona o objeto para não alterar o original
  const payload = { ...unidade };
  
  // Remove o id se estiver vazio ou null
  if (!payload.id) delete payload.id;

  const response = await api.post('/unidade', payload);
  return response.data;
},

  // Atualiza uma unidade existente
  update: async (id, unidade) => {
    const response = await api.put(`/unidade/${id}`, unidade)
    return response.data
  },

  // Exclui uma unidade pelo ID
  delete: async (id) => {
    const response = await api.delete(`/unidade/${id}`)
    return response.data
  },
}
