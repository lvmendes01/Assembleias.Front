import api from './api'

export default {
  // Retorna todas as assembleias
  getAll: async () => {
    const response = await api.get('/assembleia')
    return response.data
  },

  // Busca uma assembleia pelo ID
  getById: async (id) => {
    const response = await api.get(`/assembleia/${id}`)
    return response.data
  },

  // Cria uma nova assembleia
create: async (assembleia) => {
  // Clona o objeto para não alterar o original
  const payload = { ...assembleia };
  
  // Remove o id se estiver vazio ou null
  if (!payload.id) delete payload.id;

  const response = await api.post('/assembleia', payload);
  return response.data;
},

  // Atualiza uma assembleia existente
  update: async (id, assembleia) => {
    const response = await api.put(`/assembleia/${id}`, assembleia)
    return response.data
  },

  // Remove uma assembleia pelo ID
  delete: async (id) => {
    const response = await api.delete(`/assembleia/${id}`)
    return response.data
  },
}
