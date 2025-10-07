import api from './api'

export default {
  // Retorna todos os usuários
  getAll: async () => {
    const response = await api.get('/usuario')
    return response.data
  },

  // Retorna um usuário pelo ID
  getById: async (id) => {
    const response = await api.get(`/usuario/${id}`)
    return response.data
  },

  // Cria um novo usuário

  create: async (usuario) => {
  // Clona o objeto para não alterar o original
  const payload = { ...usuario };
  
  // Remove o id se estiver vazio ou null
  if (!payload.id) delete payload.id;

  const response = await api.post('/usuario', payload);
  return response.data;
},
  
  // Atualiza um usuário existente
  update: async (id, usuario) => {
    const response = await api.put(`/usuario/${id}`, usuario)
    return response.data
  },

  // Exclui um usuário
  delete: async (id) => {
    const response = await api.delete(`/usuario/${id}`)
    return response.data
  },
}
