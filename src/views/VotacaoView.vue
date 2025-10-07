<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">

        <!-- Login -->
        <div v-if="!usuarioLogado">
          <div class="card shadow mb-4">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Login</h5>
            </div>
            <div class="card-body">
              <input v-model="login.email" type="email" class="form-control mb-3" placeholder="Email" />
              <input v-model="login.senha" type="password" class="form-control mb-3" placeholder="Senha" />
              <button class="btn btn-primary" @click="logar">Entrar</button>
            </div>
          </div>
        </div>

        <!-- Enquetes -->
        <div v-else>
          <div class="card shadow mb-4" v-for="enquete in enquetes" :key="enquete.id">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">{{ enquete.pergunta }}</h5>
            </div>
            <div class="card-body">

              <div v-if="enqueteUnidadesVotadas[enquete.id]?.length === usuario.unidades.length" class="alert alert-success">
                Você já votou em todas as unidades desta enquete.
              </div>

              <div v-else>
                <div v-for="unidade in usuario.unidades" :key="unidade.id" class="mb-3">
                  <div v-if="!enqueteUnidadesVotadas[enquete.id]?.includes(unidade.id)">
                    <strong>Unidade: {{ unidade.nome }}</strong>
                    <div v-for="opcao in enquete.opcoes" :key="opcao.id" class="form-check">
                      <input class="form-check-input" type="radio"
                             :id="`${enquete.id}-${unidade.id}-${opcao.id}`"
                             v-model="votos[enquete.id][unidade.id]"
                             :value="opcao.id" />
                      <label class="form-check-label" :for="`${enquete.id}-${unidade.id}-${opcao.id}`">
                        {{ opcao.texto }}
                      </label>
                    </div>
                    <button class="btn btn-success btn-sm mt-1"
                            :disabled="!votos[enquete.id][unidade.id]"
                            @click="votar(enquete.id, unidade.id)">
                      Votar
                    </button>
                  </div>
                  <div v-else class="text-success">Você já votou nesta unidade.</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Toasts -->
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
          <div class="toast align-items-center text-bg-success border-0" ref="successToast">
            <div class="d-flex">
              <div class="toast-body">{{ toastMessage }}</div>
              <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="hideToast"></button>
            </div>
          </div>
          <div class="toast align-items-center text-bg-danger border-0" ref="errorToast">
            <div class="d-flex">
              <div class="toast-body">{{ toastMessage }}</div>
              <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="hideToast"></button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import votoApi from '../services/voto';
import enqueteApi from '../services/enquete';
import * as bootstrap from 'bootstrap';

export default {
  data() {
    return {
      login: { email: '', senha: '' },
      usuario: null, // { id, nome, unidades: [{id, nome}] }
      usuarioLogado: false,
      enquetes: [],
      votos: {}, // votos[enqueteId][unidadeId] = opcaoId
      enqueteUnidadesVotadas: {}, // enqueteId -> array de unidadeId votadas
      toastMessage: ''
    };
  },
  methods: {
    async logar() {
      try {
        // Simula login e busca usuário e unidades
        // Substituir pelo seu endpoint real
        const response = await fetch('/api/usuario/login', {
          method: 'POST',
          body: JSON.stringify(this.login),
          headers: { 'Content-Type': 'application/json' }
        });
        this.usuario = await response.json();
        this.usuarioLogado = true;

        await this.fetchEnquetes();
      } catch (err) {
        console.error(err);
        this.showToast('Erro ao logar', 'error');
      }
    },
    async fetchEnquetes() {
      try {
        this.enquetes = await enqueteApi.getAll();

        // Inicializa votos e enqueteUnidadesVotadas
        this.enquetes.forEach(enq => {
          if (!this.votos[enq.id]) this.votos[enq.id] = {};
          this.usuario.unidades.forEach(u => this.votos[enq.id][u.id] = '');
        });

        // Busca votos já realizados pelo usuário
        for (const enq of this.enquetes) {
          const votosUsuario = await votoApi.getByEnqueteUsuario(enq.id, this.usuario.id);
          this.enqueteUnidadesVotadas[enq.id] = votosUsuario.map(v => v.unidadeId);
        }
      } catch (err) {
        console.error(err);
      }
    },
    async votar(enqueteId, unidadeId) {
      try {
        const opcaoId = this.votos[enqueteId][unidadeId];
        const payload = {
          enqueteId,
          unidadeId,
          usuarioId: this.usuario.id,
          opcaoId,
          peso: 1
        };
        await votoApi.create(payload);

        if (!this.enqueteUnidadesVotadas[enqueteId]) this.enqueteUnidadesVotadas[enqueteId] = [];
        this.enqueteUnidadesVotadas[enqueteId].push(unidadeId);

        this.showToast('Voto registrado com sucesso!', 'success');
      } catch (err) {
        console.error(err);
        this.showToast('Erro ao registrar voto.', 'error');
      }
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
  }
};
</script>

<style scoped>
.card {
  border-radius: 12px;
}
.toast {
  min-width: 250px;
}
</style>
