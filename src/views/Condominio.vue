<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-9">
        <div class="card shadow border-0">
          <!-- Header -->
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Gerenciamento de Condomínios</h4>
            <button class="btn btn-light btn-sm" @click="resetForm">
              <i class="bi bi-plus-circle"></i> Novo Condomínio
            </button>
          </div>

          <!-- Corpo -->
          <div class="card-body">
            <!-- Formulário -->
            <form @submit.prevent="saveCondominio" class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Nome</label>
                <input type="text" v-model="condominio.nome" class="form-control" placeholder="Nome do condomínio" required />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Endereço</label>
                <input type="text" v-model="condominio.endereco" class="form-control" placeholder="Endereço completo" />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">CNPJ</label>
                <input type="text" v-model="condominio.cnpj" class="form-control" placeholder="00.000.000/0000-00" />
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
                <input type="text" v-model="filtros.nome" class="form-control" placeholder="Filtrar por nome" />
              </div>
              <div class="col-md-6">
                <input type="text" v-model="filtros.cnpj" class="form-control" placeholder="Filtrar por CNPJ" />
              </div>
            </div>

            <!-- Tabela -->
            <div class="table-responsive">
              <table class="table table-striped table-hover align-middle">
                <thead class="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Endereço</th>
                    <th>CNPJ</th>
                    <th class="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in condominiosFiltrados" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nome }}</td>
                    <td>{{ item.endereco }}</td>
                    <td>{{ item.cnpj }}</td>
                    <td class="text-center">
                      <button class="btn btn-warning btn-sm me-2" @click="editCondominio(item)">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" @click="confirmDelete(item.id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="condominiosFiltrados.length === 0">
                    <td colspan="5" class="text-center text-muted py-3">
                      Nenhum condomínio encontrado
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

  <!-- Toasts -->
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

  <!-- Modal Delete -->
  <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true" ref="deleteModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="deleteModalLabel">Confirmar Exclusão</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          Deseja realmente excluir este condomínio?
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
import condominioApi from '../api/condominio';
import * as bootstrap from 'bootstrap';

export default {
  data() {
    return {
      condominios: [],
      condominio: { id: null, nome: '', endereco: '', cnpj: '' },
      filtros: { nome: '', cnpj: '' },
      toastMessage: '',
      idParaExcluir: null,
    };
  },
  computed: {
    condominiosFiltrados() {
      return this.condominios.filter(c => {
        const matchNome = c.nome.toLowerCase().includes(this.filtros.nome.toLowerCase());
        const matchCnpj = this.filtros.cnpj ? c.cnpj.includes(this.filtros.cnpj) : true;
        return matchNome && matchCnpj;
      });
    }
  },
  methods: {
    async fetchCondominios() {
      this.condominios = await condominioApi.getAll();
    },
    async saveCondominio() {
      try {
        if (this.condominio.id) {
          await condominioApi.update(this.condominio.id, this.condominio);
          this.showToast('Condomínio atualizado com sucesso!', 'success');
        } else {
          await condominioApi.create(this.condominio);
          this.showToast('Condomínio criado com sucesso!', 'success');
        }
        this.resetForm();
        this.fetchCondominios();
      } catch (error) {
        console.error(error);
        this.showToast('Erro ao salvar o condomínio.', 'error');
      }
    },
    editCondominio(item) {
      this.condominio = { ...item };
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
        await condominioApi.delete(this.idParaExcluir);
        this.showToast('Condomínio excluído com sucesso!', 'success');
        this.fetchCondominios();
      } catch (error) {
        console.error(error);
        this.showToast('Erro ao excluir o condomínio.', 'error');
      } finally {
        this.deleteModalInstance.hide();
      }
    },
    resetForm() {
      this.condominio = { id: null, nome: '', endereco: '', cnpj: '' };
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
