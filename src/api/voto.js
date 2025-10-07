// api/voto.js
import api from './api'

export default {
  // Recupera todos os votos de uma enquete
  getAll: async (enqueteId) => {
    const response = await api.get(`/enquete/${enqueteId}/votos`);
    return response.data;
  },

  // Recupera os votos de um usuário específico em uma enquete
  getByEnqueteUsuario: async (enqueteId, usuarioId) => {
    const response = await api.get(`/enquete/${enqueteId}/votos/usuario/${usuarioId}`);
    return response.data;
  },

  // Cria um novo voto

  create: async (voto) => {
  // Clona o objeto para não alterar o original
  const payload = { ...voto };
  
  // Remove o id se estiver vazio ou null
  if (!payload.id) delete payload.id;

  const response = await api.post('/voto', payload);
  return response.data;
},
  
  // Atualiza um voto existente
  update: async (id, voto) => {
    const response = await api.put(`/votos/${id}`, voto);
    return response.data;
  },

  // Remove um voto
  delete: async (id) => {
    const response = await api.delete(`/votos/${id}`);
    return response.data;
  }
}
