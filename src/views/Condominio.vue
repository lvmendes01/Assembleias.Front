<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-9">
        <div class="card shadow border-0">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Gerenciamento de Condomínios</h4>
            <button class="btn btn-light btn-sm" @click="resetForm">
              <i class="bi bi-plus-circle"></i> Novo Condomínio
            </button>
          </div>

          <div class="card-body">
            <!-- Formulário -->
            <form @submit.prevent="saveCondominio" class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Nome</label>
                <input
                  type="text"
                  v-model="condominio.nome"
                  class="form-control"
                  placeholder="Nome do condomínio"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Endereço</label>
                <input
                  type="text"
                  v-model="condominio.endereco"
                  class="form-control"
                  placeholder="Endereço completo"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">CNPJ</label>
                <input
                  type="text"
                  v-model="condominio.cnpj"
                  class="form-control"
                  placeholder="00.000.000/0000-00"
                />
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
                    <th>Nome</th>
                    <th>Endereço</th>
                    <th>CNPJ</th>
                    <th class="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in condominios" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nome }}</td>
                    <td>{{ item.endereco }}</td>
                    <td>{{ item.cnpj }}</td>
                    <td class="text-center">
                      <button class="btn btn-warning btn-sm me-2" @click="editCondominio(item)">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" @click="deleteCondominio(item.id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="condominios.length === 0">
                    <td colspan="5" class="text-center text-muted py-3">
                      Nenhum condomínio cadastrado
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
import condominioApi from '../api/condominio';

export default {
  data() {
    return {
      condominios: [],
      condominio: { id: null, nome: '', endereco: '', cnpj: '' },
    };
  },
  methods: {
    async fetchCondominios() {
      this.condominios = await condominioApi.getAll();
    },
    async saveCondominio() {
      if (this.condominio.id) {
        await condominioApi.update(this.condominio.id, this.condominio);
      } else {
        await condominioApi.create(this.condominio);
      }
      this.resetForm();
      this.fetchCondominios();
    },
    editCondominio(item) {
      this.condominio = { ...item };
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async deleteCondominio(id) {
      if (confirm('Deseja realmente excluir este condomínio?')) {
        await condominioApi.delete(id);
        this.fetchCondominios();
      }
    },
    resetForm() {
      this.condominio = { id: null, nome: '', endereco: '', cnpj: '' };
    },
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
</style>
