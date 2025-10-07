<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">

        <!-- Enquetes -->
        <div v-for="enquete in enquetes" :key="enquete.id" class="card shadow mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">{{ enquete.pergunta }}</h5>
          </div>
          <div class="card-body">

            <!-- Lista de votos já realizados -->
            <div v-if="votosPorEnquete[enquete.id]?.length" class="mb-3">
              <h6>Votos realizados:</h6>
              <ul class="list-group">
                <li v-for="v in votosPorEnquete[enquete.id]" :key="v.unidadeId" class="list-group-item d-flex justify-content-between">
                  <span>{{ v.unidadeNome }}</span>
                  <span><strong>{{ v.opcaoTexto }}</strong></span>
                </li>
              </ul>
            </div>

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
  </div>
</template>

<script>
import votoApi from '../services/voto';
import enqueteApi from '../services/enquete';

export default {
  data() {
    return {
      usuario: {
        id: 1,
        nome: 'Fulano',
        unidades: [
          { id: 101, nome: 'Unidade 101' },
          { id: 102, nome: 'Unidade 102' }
        ]
      },
      enquetes: [],
      votos: {},
      enqueteUnidadesVotadas: {},
      votosPorEnquete: {}
    };
  },
  async created() {
    await this.fetchEnquetes();
  },
  methods: {
    async fetchEnquetes() {
      this.enquetes = await enqueteApi.getAll();

      // Inicializa votos
      this.enquetes.forEach(enq => {
        if (!this.votos[enq.id]) this.votos[enq.id] = {};
        this.usuario.unidades.forEach(u => this.votos[enq.id][u.id] = '');
      });

      // Busca votos já realizados
      for (const enq of this.enquetes) {
        const votosUsuario = await votoApi.getByEnqueteUsuario(enq.id, this.usuario.id);
        this.enqueteUnidadesVotadas[enq.id] = votosUsuario.map(v => v.unidadeId);

        // Prepara lista detalhada de votos
        this.votosPorEnquete[enq.id] = votosUsuario.map(v => ({
          unidadeId: v.unidadeId,
          unidadeNome: this.usuario.unidades.find(u => u.id === v.unidadeId)?.nome || '',
          opcaoTexto: enq.opcoes.find(o => o.id === v.opcaoId)?.texto || ''
        }));
      }
    },
    async votar(enqueteId, unidadeId) {
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

      // Atualiza lista de votos
      const enquete = this.enquetes.find(e => e.id === enqueteId);
      const unidade = this.usuario.unidades.find(u => u.id === unidadeId);
      const opcao = enquete.opcoes.find(o => o.id === opcaoId);
      if (!this.votosPorEnquete[enqueteId]) this.votosPorEnquete[enqueteId] = [];
      this.votosPorEnquete[enqueteId].push({
        unidadeId,
        unidadeNome: unidade.nome,
        opcaoTexto: opcao.texto
      });
    }
  }
};
</script>
