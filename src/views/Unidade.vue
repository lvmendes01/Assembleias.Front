<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-9">
        <div class="card shadow border-0">
          <!-- Header -->
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Gerenciamento de Unidades</h4>
            <button class="btn btn-light btn-sm" @click="resetForm">
              <i class="bi bi-plus-circle"></i> Nova Unidade
            </button>
          </div>

          <!-- Corpo -->
          <div class="card-body">
            <!-- Formulário -->
            <form @submit.prevent="saveUnidade" class="row g-3 mb-4">
              <div class="col-md-4">
                <label class="form-label fw-semibold">Condomínio</label>
                <select v-model="unidade.condominioId" class="form-select" required>
                  <option value="" disabled>Selecione o condomínio</option>
                  <option v-for="c in condominios" :key="c.id" :value="c.id">{{ c.nome }}</option>
                </select>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold">Número da Unidade</label>
                <input type="text" v-model="unidade.numero" class="form-control" placeholder="Número ou bloco" required />
              </div>

              <div class="col-md-2">
                <label class="form-label fw-semibold">Fração Ideal (%)</label>
                <input type="number" v-model.number="unidade.fracao" class="form-control" min="0" step="0.01" required />
              </div>

              <div class="col-md-2 d-flex align-items-center mt-4">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="unidade.ativa" id="ativaCheck">
                  <label class="form-check-label" for="ativaCheck">Ativa</label>
                </div>
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
              <div class="col-md-6">
                <input type="text" v-model="filtros.numero" class="form-control" placeholder="Filtrar por número" />
              </div>
              <div class="col-md-6">
                <select v-model="filtros.condominioId" class="form-select">
                  <option value="">Todos os condomínios</option>
                  <option v-for="c in condominios" :key="c.id" :value="c.id">{{ c.nome }}</option>
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
                    <th>Número</th>
                    <th>Fraçao (%)</th>
                    <th>Status</th>
                    <th class="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in unidadesFiltradas" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ getCondominioNome(item.condominioId) }}</td>
                    <td>{{ item.numero }}</td>
                    <td>{{ item.fracao }}</td>
                    <td>{{ item.ativa ? 'Ativa' : 'Inativa' }}</td>
                    <td class="text-center">
                      <button class="btn btn-warning btn-sm me-2" @click="editUnidade(item)">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" @click="confirmDelete(item.id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="unidadesFiltradas.length === 0">
                    <td colspan="6" class="text-center text-muted py-3">
                      Nenhuma unidade encontrada
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card-footer text-muted text-end small">
            © {{ new Date().getFullYear() }} Sistema de Condomínios
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toasts e Modal Delete -->
  <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
    <div class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" ref="successToast">
      <div class="d-flex">
        <div class="toast-body">{{ toastMessage }}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="hideToast"></button>
      </div>
    </div>

    <div class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true" ref="errorToast">
      <div class="d-flex">
        <div class="toast-body">{{ toastMessage }}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="hideToast"></button>
      </div>
    </div>
  </div>

  <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true" ref="deleteModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="deleteModalLabel">Confirmar Exclusão</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          Deseja realmente excluir esta unidade?
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
import unidadeApi from '../api/unidade';
import condominioApi from '../api/condominio';
import * as bootstrap from 'bootstrap';

export default {
  data() {
    return {
      unidades: [],
      condominios: [],
      unidade: { id: null, condominioId: '', numero: '', fracao: 0, ativa: true },
      filtros: { numero: '', condominioId: '' },
      toastMessage: '',
      idParaExcluir: null,
    };
  },
  computed: {
    unidadesFiltradas() {
      return this.unidades.filter(u => {
        const matchNumero = u.numero.toLowerCase().includes(this.filtros.numero.toLowerCase());
        const matchCondominio = this.filtros.condominioId ? u.condominioId === this.filtros.condominioId : true;
        return matchNumero && matchCondominio;
      });
    }
  },
  methods: {
    async fetchData() {
      this.unidades = await unidadeApi.getAll();
      this.condominios = await condominioApi.getAll();
    },
    getCondominioNome(id) {
      const c = this.condominios.find(c => c.id === id);
      return c ? c.nome : 'Desconhecido';
    },
    async saveUnidade() {
      try {
        if (this.unidade.id) {
          await unidadeApi.update(this.unidade.id, this.unidade);
          this.showToast('Unidade atualizada com sucesso!', 'success');
        } else {
          await unidadeApi.create(this.unidade);
          this.showToast('Unidade criada com sucesso!', 'success');
        }
        this.resetForm();
        this.fetchData();
      } catch (error) {
        console.error(error);
        this.showToast('Erro ao salvar a unidade.', 'error');
      }
    },
    editUnidade(item) {
      this.unidade = { ...item };
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
        await unidadeApi.delete(this.idParaExcluir);
        this.showToast('Unidade excluída com sucesso!', 'success');
        this.fetchData();
      } catch (error) {
        console.error(error);
        this.showToast('Erro ao excluir a unidade.', 'error');
      } finally {
        this.deleteModalInstance.hide();
      }
    },
    resetForm() {
      this.unidade = { id: null, condominioId: '', numero: '', fracao: 0, ativa: true };
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
    this.fetchData();
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

.btn i {
  vertical-align: middle;
  margin-right: 4px;
}

.toast {
  min-width: 250px;
}
</style>
