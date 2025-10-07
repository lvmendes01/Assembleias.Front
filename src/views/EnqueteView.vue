<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-9">
        <div class="card shadow border-0">
          <!-- Header -->
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Gerenciamento de Enquetes</h4>
            <button class="btn btn-light btn-sm" @click="resetForm">
              <i class="bi bi-plus-circle"></i> Nova Enquete
            </button>
          </div>

          <!-- Corpo -->
          <div class="card-body">
            <!-- Formulário -->
            <form @submit.prevent="saveEnquete" class="mb-4">
              <!-- Assembleia -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Assembleia</label>
                <select v-model="enquete.assembleiaId" class="form-select" required>
                  <option value="">Selecione uma assembleia</option>
                  <option v-for="asm in assembleias" :key="asm.id" :value="asm.id">
                    {{ asm.titulo }}
                  </option>
                </select>
              </div>

              <!-- Pergunta -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Pergunta</label>
                <input type="text" v-model="enquete.pergunta" class="form-control" placeholder="Digite a pergunta" required />
              </div>

              <!-- Tipo -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Tipo</label>
                <select v-model="enquete.tipo" class="form-select">
                  <option value="sim_nao">Sim/Não</option>
                  <option value="multipla_escolha">Múltipla escolha</option>
                  <option value="aberta">Aberta</option>
                </select>
              </div>

              <!-- Datas de abertura e fechamento -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Data/Hora de Abertura</label>
                  <input type="datetime-local" v-model="enquete.abertaEm" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Data/Hora de Fechamento</label>
                  <input type="datetime-local" v-model="enquete.fechadaEm" class="form-control" required />
                </div>
              </div>

              <!-- Opções -->
              <div class="mb-3" v-if="enquete.tipo !== 'aberta'">
                <label class="form-label fw-semibold">Opções</label>
                <div v-for="(opcao, index) in enquete.opcoes" :key="opcao.id" class="input-group mb-2">
                  <input type="text" v-model="opcao.texto" class="form-control" placeholder="Texto da opção" required />
                  <button class="btn btn-danger" type="button" @click="removerOpcao(index)">
                    <i class="bi bi-x-circle"></i>
                  </button>
                </div>
                <button class="btn btn-secondary btn-sm" type="button" @click="adicionarOpcao">
                  <i class="bi bi-plus-circle"></i> Adicionar Opção
                </button>
              </div>

              <div class="text-end">
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
                <input type="text" v-model="filtros.pergunta" class="form-control" placeholder="Filtrar por pergunta" />
              </div>
              <div class="col-md-6">
                <select v-model="filtros.assembleiaId" class="form-select">
                  <option value="">Todas as assembleias</option>
                  <option v-for="asm in assembleias" :key="asm.id" :value="asm.id">
                    {{ asm.titulo }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Tabela -->
            <div class="table-responsive">
              <table class="table table-striped table-hover align-middle">
                <thead class="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Assembleia</th>
                    <th>Pergunta</th>
                    <th>Tipo</th>
                    <th>Opções</th>
                    <th class="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in enquetesFiltradas" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ getAssembleiaTitulo(item.assembleiaId) }}</td>
                    <td>{{ item.pergunta }}</td>
                    <td>{{ item.tipo }}</td>
                    <td>
                      <ul class="mb-0">
                        <li v-for="op in item.opcoes" :key="op.id">{{ op.texto }}</li>
                      </ul>
                    </td>
                    <td class="text-center">
                      <button class="btn btn-warning btn-sm me-2" @click="editEnquete(item)">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" @click="confirmDelete(item.id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="enquetesFiltradas.length === 0">
                    <td colspan="6" class="text-center text-muted py-3">
                      Nenhuma enquete encontrada
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card-footer text-muted text-end small">
            © {{ new Date().getFullYear() }} Sistema de Enquetes
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import enqueteApi from '../api/enquete';
import assembleiaApi from '../api/assembleia';
import * as bootstrap from 'bootstrap';
import { v4 as uuidv4 } from 'uuid';

export default {
  data() {
    return {
      assembleias: [],
      enquetes: [],
      enquete: {
        id: null,
        assembleiaId: '',
        pergunta: '',
        tipo: 'sim_nao',
        abertaEm: '',
        fechadaEm: '',
        opcoes: []
      },
      filtros: {
        pergunta: '',
        assembleiaId: ''
      },
      toastMessage: '',
      idParaExcluir: null
    };
  },
  computed: {
    enquetesFiltradas() {
      return this.enquetes.filter(e => {
        const matchPergunta = e.pergunta.toLowerCase().includes(this.filtros.pergunta.toLowerCase());
        const matchAssembleia = this.filtros.assembleiaId ? e.assembleiaId === this.filtros.assembleiaId : true;
        return matchPergunta && matchAssembleia;
      });
    }
  },
  methods: {
    async fetchAssembleias() {
      this.assembleias = await assembleiaApi.getAll();
    },
    async fetchEnquetes() {
      this.enquetes = await enqueteApi.getAll();
    },
    getAssembleiaTitulo(id) {
      const asm = this.assembleias.find(a => a.id === id);
      return asm ? asm.titulo : '-';
    },
    adicionarOpcao() {
      this.enquete.opcoes.push({ id: uuidv4(), texto: '', ordem: this.enquete.opcoes.length });
    },
    removerOpcao(index) {
      this.enquete.opcoes.splice(index, 1);
    },
    editEnquete(item) {
      this.enquete = JSON.parse(JSON.stringify(item));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async saveEnquete() {
      if (!this.enquete.assembleiaId) {
        this.showToast('Selecione uma assembleia válida!', 'error');
        return;
      }

      try {
        // converter datetime-local para ISO
        const abertaISO = new Date(this.enquete.abertaEm).toISOString();
        const fechadaISO = new Date(this.enquete.fechadaEm).toISOString();

        const payload = {
          id: this.enquete.id || uuidv4(),
          assembleiaId: this.enquete.assembleiaId,
          pergunta: this.enquete.pergunta,
          tipo: this.enquete.tipo,
          abertaEm: abertaISO,
          fechadaEm: fechadaISO,
          opcoes: this.enquete.opcoes.map((o, i) => ({
            id: o.id || uuidv4(),
            enqueteId: this.enquete.id || uuidv4(),
            texto: o.texto,
            ordem: i
          }))
        };

        if (this.enquete.id) {
          await enqueteApi.update(this.enquete.id, payload);
          this.showToast('Enquete atualizada com sucesso!', 'success');
        } else {
          await enqueteApi.create(payload);
          this.showToast('Enquete criada com sucesso!', 'success');
        }

        this.resetForm();
        this.fetchEnquetes();
      } catch (error) {
        console.error(error);
        this.showToast('Erro ao salvar a enquete.', 'error');
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
        await enqueteApi.delete(this.idParaExcluir);
        this.showToast('Enquete excluída com sucesso!', 'success');
        this.fetchEnquetes();
      } catch (error) {
        console.error(error);
        this.showToast('Erro ao excluir a enquete.', 'error');
      } finally {
        this.deleteModalInstance.hide();
      }
    },
    resetForm() {
      this.enquete = {
        id: null,
        assembleiaId: '',
        pergunta: '',
        tipo: 'sim_nao',
        abertaEm: '',
        fechadaEm: '',
        opcoes: []
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
    this.fetchAssembleias();
    this.fetchEnquetes();
  }
};
</script>
