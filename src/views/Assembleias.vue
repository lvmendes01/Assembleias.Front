<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-9">
        <div class="card shadow border-0">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Gerenciamento de Assembleias</h4>
            <button class="btn btn-light btn-sm" @click="resetForm">
              <i class="bi bi-plus-circle"></i> Nova Assembleia
            </button>
          </div>

          <div class="card-body">
            <!-- Formulário -->
            <form @submit.prevent="saveAssembleia" class="row g-3 mb-4">

              <!-- Seleção do Condomínio -->
              <div class="col-md-6">
                <label class="form-label fw-semibold">Condomínio</label>
                <select v-model="assembleia.condominioId" class="form-select" required>
                  <option value="">Selecione um condomínio</option>
                  <option v-for="cond in condominios" :key="cond.id" :value="cond.id">
                    {{ cond.nome }}
                  </option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Título</label>
                <input
                  type="text"
                  v-model="assembleia.titulo"
                  class="form-control"
                  placeholder="Ex: Assembleia Geral Ordinária"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Tipo</label>
                <select v-model="assembleia.tipo" class="form-select" required>
                  <option value="">Selecione</option>
                  <option value="Ordinária">Ordinária</option>
                  <option value="Extraordinária">Extraordinária</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>

              <div class="col-12">
                <label class="form-label fw-semibold">Pauta</label>
                <textarea
                  v-model="assembleia.pauta"
                  class="form-control"
                  rows="3"
                  placeholder="Descreva a pauta da assembleia"
                  required
                ></textarea>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Data de Início</label>
                <input
                  type="datetime-local"
                  v-model="assembleia.dataInicio"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Data de Fim</label>
                <input
                  type="datetime-local"
                  v-model="assembleia.dataFim"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-8">
                <label class="form-label fw-semibold">Link da Reunião</label>
                <input
                  type="url"
                  v-model="assembleia.linkReuniao"
                  class="form-control"
                  placeholder="https://..."
                />
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold">Status</label>
                <select v-model="assembleia.status" class="form-select">
                  <option value="">Selecione</option>
                  <option value="Agendada">Agendada</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Encerrada">Encerrada</option>
                </select>
              </div>

              <div class="col-12 text-end">
                <button type="submit" class="btn btn-success me-2">
                  <i class="bi bi-save"></i> Salvar
                </button>
                <button type="button" class="btn btn-secondary" @click="resetForm">
                  <i class="bi bi-x-circle"></i> Limpar
                </button>
              </div>
            </form>

            <!-- Tabela -->
            <div class="table-responsive">
              <table class="table table-striped table-hover align-middle">
                <thead class="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Condomínio</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Início</th>
                    <th>Fim</th>
                    <th>Status</th>
                    <th class="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in assembleias" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ getCondominioName(item.condominioId) }}</td>
                    <td>{{ item.titulo }}</td>
                    <td>{{ item.tipo }}</td>
                    <td>{{ formatDate(item.dataInicio) }}</td>
                    <td>{{ formatDate(item.dataFim) }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="{
                          'bg-success': item.status === 'Encerrada',
                          'bg-warning text-dark': item.status === 'Em Andamento',
                          'bg-info text-dark': item.status === 'Agendada',
                        }"
                      >
                        {{ item.status || '-' }}
                      </span>
                    </td>
                    <td class="text-center">
                      <button class="btn btn-warning btn-sm me-2" @click="editAssembleia(item)">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" @click="deleteAssembleia(item.id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="assembleias.length === 0">
                    <td colspan="8" class="text-center text-muted py-3">
                      Nenhuma assembleia cadastrada
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card-footer text-muted text-end small">
            © {{ new Date().getFullYear() }} Sistema de Assembleias
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import assembleiaApi from '../api/assembleia';
import condominioApi from '../api/condominio';

export default {
  data() {
    return {
      assembleias: [],
      condominios: [],
      assembleia: {
        id: null,
        condominioId: '',
        titulo: '',
        pauta: '',
        dataInicio: '',
        dataFim: '',
        tipo: '',
        linkReuniao: '',
        status: '',
        criadoPor: '',
        criadoEm: '',
      },
    };
  },
  methods: {
    async fetchAssembleias() {
      this.assembleias = await assembleiaApi.getAll();
    },
    async fetchCondominios() {
      this.condominios = await condominioApi.getAll();
    },
    getCondominioName(id) {
      const cond = this.condominios.find(c => c.id === id);
      return cond ? cond.nome : '-';
    },
   async saveAssembleia() {
  if (this.assembleia.id) {
    await assembleiaApi.update(this.assembleia.id, this.assembleia);
  } else {
    await assembleiaApi.create(this.assembleia);
  }
  this.resetForm();
  this.fetchAssembleias();
},
    editAssembleia(item) {
      this.assembleia = { ...item };
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async deleteAssembleia(id) {
      if (confirm('Deseja realmente excluir esta assembleia?')) {
        await assembleiaApi.delete(id);
        this.fetchAssembleias();
      }
    },
    resetForm() {
      this.assembleia = {
        id: null,
        condominioId: '',
        titulo: '',
        pauta: '',
        dataInicio: '',
        dataFim: '',
        tipo: '',
        linkReuniao: '',
        status: '',
        criadoPor: '',
        criadoEm: '',
      };
    },
    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleString('pt-BR');
    },
  },
  mounted() {
    this.fetchCondominios();
    this.fetchAssembleias();
  },
};
</script>
