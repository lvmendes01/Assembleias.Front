<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-9">
        <div class="card shadow border-0">
          <!-- Header -->
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Gerenciamento de Assembleias</h4>
            <button class="btn btn-light btn-sm" @click="resetForm">
              <i class="bi bi-plus-circle"></i> Nova Assembleia
            </button>
          </div>

          <!-- Corpo -->
          <div class="card-body">
            <!-- Formulário -->
            <form @submit.prevent="saveAssembleia" class="row g-3 mb-4">
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
                <input type="text" v-model="assembleia.titulo" class="form-control" placeholder="Ex: Assembleia Geral Ordinária" required />
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
                <textarea v-model="assembleia.pauta" class="form-control" rows="3" placeholder="Descreva a pauta da assembleia" required></textarea>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Data de Início</label>
                <input type="datetime-local" v-model="assembleia.dataInicio" class="form-control" required />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Data de Fim</label>
                <input type="datetime-local" v-model="assembleia.dataFim" class="form-control" required />
              </div>

              <div class="col-md-8">
                <label class="form-label fw-semibold">Link da Reunião</label>
                <input type="url" v-model="assembleia.linkReuniao" class="form-control" placeholder="https://..." />
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

            <!-- Filtros -->
            <div class="row mb-3">
              <div class="col-md-4">
                <input
                  type="text"
                  v-model="filtros.titulo"
                  class="form-control"
                  placeholder="Filtrar por título"
                />
              </div>
              <div class="col-md-4">
                <select v-model="filtros.condominioId" class="form-select">
                  <option value="">Todos os condomínios</option>
                  <option v-for="cond in condominios" :key="cond.id" :value="cond.id">
                    {{ cond.nome }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <select v-model="filtros.status" class="form-select">
                  <option value="">Todos os status</option>
                  <option value="Agendada">Agendada</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Encerrada">Encerrada</option>
                </select>
              </div>
            </div>

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
                  <tr v-for="(item, index) in assembleiasFiltradas" :key="item.id">
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
                      <button class="btn btn-danger btn-sm" @click="confirmDelete(item.id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="assembleiasFiltradas.length === 0">
                    <td colspan="8" class="text-center text-muted py-3">
                      Nenhuma assembleia encontrada
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

  <!-- Toasts -->
  <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
    <div
      class="toast align-items-center text-bg-success border-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      ref="successToast"
    >
      <div class="d-flex">
        <div class="toast-body">{{ toastMessage }}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="hideToast"></button>
      </div>
    </div>

    <div
      class="toast align-items-center text-bg-danger border-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      ref="errorToast"
    >
      <div class="d-flex">
        <div class="toast-body">{{ toastMessage }}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="hideToast"></button>
      </div>
    </div>
  </div>

  <!-- Modal Delete -->
  <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true" ref="deleteModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="deleteModalLabel">Confirmar Exclusão</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          Deseja realmente excluir esta assembleia?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" @click="deleteConfirmed">Excluir</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import assembleiaApi from '../services/assembleia';
import condominioApi from '../services/condominio';
import * as bootstrap from 'bootstrap';

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
      filtros: {
        titulo: '',
        condominioId: '',
        status: ''
      },
      toastMessage: '',
      idParaExcluir: null,
    };
  },
  computed: {
    assembleiasFiltradas() {
      return this.assembleias.filter(a => {
        const matchTitulo = a.titulo.toLowerCase().includes(this.filtros.titulo.toLowerCase());
        const matchCondominio = this.filtros.condominioId ? a.condominioId === this.filtros.condominioId : true;
        const matchStatus = this.filtros.status ? a.status === this.filtros.status : true;
        return matchTitulo && matchCondominio && matchStatus;
      });
    }
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
      try {
        if (this.assembleia.id) {
          await assembleiaApi.update(this.assembleia.id, this.assembleia);
          this.showToast('Assembleia atualizada com sucesso!', 'success');
        } else {
          await assembleiaApi.create(this.assembleia);
          this.showToast('Assembleia criada com sucesso!', 'success');
        }
        this.resetForm();
        this.fetchAssembleias();
      } catch (error) {
        console.error(error);
        this.showToast('Erro ao salvar a assembleia.', 'error');
      }
    },
    editAssembleia(item) {
      this.assembleia = { ...item };
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    confirmDelete(id) {
      this.idParaExcluir = id;
      const modalEl = this.$refs.deleteModal;
      this.deleteModalInstance = new bootstrap.Modal(modalEl);
      this.deleteModalInstance.show();
    },
    async deleteConfirmed() {
      try {
        await assembleiaApi.delete(this.idParaExcluir);
        this.showToast('Assembleia excluída com sucesso!', 'success');
        this.fetchAssembleias();
      } catch (error) {
        console.error(error);
        this.showToast('Erro ao excluir a assembleia.', 'error');
      } finally {
        this.deleteModalInstance.hide();
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
    showToast(message, type) {
      this.toastMessage = message;
      const toastRef = type === 'success' ? this.$refs.successToast : this.$refs.errorToast;
      const toast = new bootstrap.Toast(toastRef, { delay: 3000 });
      toast.show();
    },
    hideToast() {
      [this.$refs.successToast, this.$refs.errorToast].forEach(t => new bootstrap.Toast(t).hide());
    }
  },
  mounted() {
    this.fetchCondominios();
    this.fetchAssembleias();
  },
};
</script>

<style scoped>
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
  transition: 0.2s ease-in-out;
}

.card {
  border-radius: 12px;
}

textarea {
  resize: none;
}

.toast {
  min-width: 250px;
}
</style>
