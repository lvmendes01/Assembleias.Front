import api from './api'

export default {
  getAll: async (enqueteId) => {
    const response = await api.get(`/enquete/${enqueteId}/opcoes`)
    return response.data
  },

  getById: async (enqueteId, id) => {
    const response = await api.get(`/enquete/${enqueteId}/opcoes/${id}`)
    return response.data
  },

  create: async (enqueteId, opcao) => {
    const response = await api.post(`/enquete/${enqueteId}/opcoes`, opcao)
    return response.data
  },

  
  update: async (enqueteId, id, opcao) => {
    const response = await api.put(`/enquete/${enqueteId}/opcoes/${id}`, opcao)
    return response.data
  },

  delete: async (enqueteId, id) => {
    const response = await api.delete(`/enquete/${enqueteId}/opcoes/${id}`)
    return response.data
  },
}