<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-9">
        <div class="card shadow border-0">
          <!-- Header -->
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Gerenciamento de Usuários</h4>
            <button class="btn btn-light btn-sm" @click="resetForm">
              <i class="bi bi-plus-circle"></i> Novo Usuário
            </button>
          </div>

          <!-- Corpo -->
          <div class="card-body">
            <!-- Formulário -->
            <form @submit.prevent="saveUsuario" class="row g-3 mb-4">
              <div class="col-md-4">
                <label class="form-label fw-semibold">Nome</label>
                <input type="text" v-model="usuario.nome" class="form-control" placeholder="Nome do usuário" required />
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold">Email</label>
                <input type="email" v-model="usuario.email" class="form-control" placeholder="Email" required />
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold">Papel</label>
                <select v-model="usuario.papel" class="form-select" required>
                  <option value="">Selecione o papel</option>
                  <option v-for="papel in papeis" :key="papel" :value="papel">{{ papel }}</option>
                </select>
              </div>

              <!-- Condominios -->
              <div class="col-12 mt-3">
                <label class="form-label fw-semibold">Condomínios disponíveis</label>
                <div v-for="c in condominiosDisponiveis" :key="c.id" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="'condominio-' + c.id"
                    :value="c.id"
                    v-model="usuario.condominiosSelecionados"
                  />
                  <label class="form-check-label" :for="'condominio-' + c.id">{{ c.nome }}</label>
                </div>
              </div>

              <!-- Unidades existentes -->
              <div class="col-12 mt-3" v-if="usuario.unidades && usuario.unidades.length">
                <label class="form-label fw-semibold">Unidades do usuário</label>
                <div v-for="u in usuario.unidades" :key="u.id" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="'unidade-usuario-' + u.id"
                    :value="u.id"
                    v-model="usuario.unidadesSelecionadasExistentes"
                  />
                  <label class="form-check-label" :for="'unidade-usuario-' + u.id">
                    {{ getCondominioNome(u.condominioId) }} - {{ u.numero }}
                  </label>
                </div>
                <small class="text-muted">Marque para manter ou desmarque para remover</small>
              </div>

              <!-- Unidades novas -->
              <div class="col-12 mt-3" v-if="unidadesDisponiveis.length">
                <label class="form-label fw-semibold">Unidades disponíveis</label>
                <div v-for="u in unidadesDisponiveis" :key="u.id" class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="'unidade-disponivel-' + u.id"
                    :value="u.id"
                    v-model="usuario.unidadesSelecionadasNovas"
                  />
                  <label class="form-check-label" :for="'unidade-disponivel-' + u.id">
                    {{ getCondominioNome(u.condominioId) }} - {{ u.numero }}
                  </label>
                </div>
              </div>

              <div class="col-12 text-end mt-3">
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
              <div class="col-md-3">
                <input type="text" v-model="filtros.nome" class="form-control" placeholder="Filtrar por nome" />
              </div>
              <div class="col-md-3">
                <input type="text" v-model="filtros.email" class="form-control" placeholder="Filtrar por email" />
              </div>
              <div class="col-md-3">
                <select v-model="filtros.papel" class="form-select">
                  <option value="">Todos os papéis</option>
                  <option v-for="p in papeis" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>
              <div class="col-md-3">
                <select v-model="filtros.condominioId" class="form-select">
                  <option value="">Todos os condomínios</option>
                  <option v-for="c in condominios" :key="c.id" :value="c.id">{{ c.nome }}</option>
                </select>
              </div>
            </div>

            <!-- Tabela de usuários -->
            <div class="table-responsive">
              <table class="table table-striped table-hover align-middle">
                <thead class="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Papel</th>
                    <th>Condomínios</th>
                    <th>Unidades</th>
                    <th class="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in usuariosFiltrados" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nome }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.papel }}</td>
                    <td>
                      <span v-for="c in item.condominios" :key="c.id" class="badge bg-primary me-1">{{ c.nome }}</span>
                    </td>
                    <td>
                      <span v-for="u in item.unidades" :key="u.id" class="badge bg-secondary me-1">
                        {{ getCondominioNome(u.condominioId) }} - {{ u.numero }}
                      </span>
                    </td>
                    <td class="text-center">
                      <button class="btn btn-warning btn-sm me-2" @click="editUsuario(item)">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" @click="confirmDelete(item.id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="usuariosFiltrados.length === 0">
                    <td colspan="7" class="text-center text-muted py-3">Nenhum usuário encontrado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card-footer text-muted text-end small">
            © {{ new Date().getFullYear() }} Sistema de Usuários
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
        <div class="modal-body">Deseja realmente excluir este usuário?</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-danger" @click="deleteConfirmed">Excluir</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import usuarioApi from '../api/usuario';
import condominioApi from '../api/condominio';
import unidadeApi from '../api/unidade';
import * as bootstrap from 'bootstrap';

export default {
  data() {
    return {
      usuarios: [],
      condominios: [],
      unidades: [],
      usuario: {
        id: null,
        nome: '',
        email: '',
        papel: '',
        condominiosSelecionados: [],
        unidadesSelecionadasExistentes: [],
        unidadesSelecionadasNovas: [],
        condominios: [],
        unidades: []
      },
      papeis: ['Condômino','Síndico','Presidente da Mesa','Secretário','Procurador','Convidado'],
      filtros: { nome: '', email: '', papel: '', condominioId: '' },
      toastMessage: '',
      idParaExcluir: null
    };
  },
  computed: {
    usuariosFiltrados() {
      return this.usuarios.filter(u => {
        const matchNome = u.nome.toLowerCase().includes(this.filtros.nome.toLowerCase());
        const matchEmail = this.filtros.email ? u.email.toLowerCase().includes(this.filtros.email.toLowerCase()) : true;
        const matchPapel = this.filtros.papel ? u.papel === this.filtros.papel : true;
        const matchCondominio = this.filtros.condominioId
          ? u.condominios.some(c => c.id === this.filtros.condominioId)
          : true;
        return matchNome && matchEmail && matchPapel && matchCondominio;
      });
    },
    condominiosDisponiveis() {
      if (!this.usuario.id) return this.condominios;
      return this.condominios.filter(c => !this.usuario.condominios.some(uc => uc.id === c.id));
    },
    unidadesDisponiveis() {
      return this.unidades.filter(u =>
        this.usuario.condominiosSelecionados.includes(u.condominioId) &&
        !this.usuario.unidades.some(uu => uu.id === u.id)
      );
    }
  },
  methods: {
    async fetchData() {
      this.usuarios = await usuarioApi.getAll();
      this.condominios = await condominioApi.getAll();
      this.unidades = await unidadeApi.getAll();
    },
    getCondominioNome(id) {
      const c = this.condominios.find(c => c.id === id);
      return c ? c.nome : 'Desconhecido';
    },
    editUsuario(item) {
      this.usuario = { 
        ...item,
        condominiosSelecionados: [],
        unidadesSelecionadasExistentes: item.unidades.map(u => u.id),
        unidadesSelecionadasNovas: []
      };
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async saveUsuario() {
      try {
        const unidadesPayload = [
          ...this.usuario.unidades.filter(u => this.usuario.unidadesSelecionadasExistentes.includes(u.id)),
          ...this.unidades.filter(u => this.usuario.unidadesSelecionadasNovas.includes(u.id))
            .map(u => ({
              id: u.id,
              condominioId: u.condominioId,
              numero: u.numero,
              fracao: u.fracao,
              ativa: u.ativa
            }))
        ];

        const payload = {
          id: this.usuario.id,
          nome: this.usuario.nome,
          email: this.usuario.email,
          papel: this.usuario.papel,
          unidades: unidadesPayload
        };

        if (this.usuario.id) {
          await usuarioApi.update(this.usuario.id, payload);
          this.showToast('Usuário atualizado com sucesso!', 'success');
        } else {
          await usuarioApi.create(payload);
          this.showToast('Usuário criado com sucesso!', 'success');
        }

        this.resetForm();
        this.fetchData();
      } catch (error) {
        console.error(error);
        this.showToast('Erro ao salvar o usuário.', 'error');
      }
    },
    confirmDelete(id) {
      this.idParaExcluir = id;
      const modalEl = this.$refs.deleteModal;
      this.deleteModalInstance = new bootstrap.Modal(modalEl);
      this.deleteModalInstance.show();
    },
    async deleteConfirmed() {
      try {
        await usuarioApi.delete(this.idParaExcluir);
        this.showToast('Usuário excluído com sucesso!', 'success');
        this.fetchData();
      } catch (error) {
        console.error(error);
        this.showToast('Erro ao excluir o usuário.', 'error');
      } finally {
        this.deleteModalInstance.hide();
      }
    },
    resetForm() {
      this.usuario = {
        id: null,
        nome: '',
        email: '',
        papel: '',
        condominiosSelecionados: [],
        unidadesSelecionadasExistentes: [],
        unidadesSelecionadasNovas: [],
        condominios: [],
        unidades: []
      };
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

textarea {
  resize: none;
}

.toast {
  min-width: 250px;
}
</style>
