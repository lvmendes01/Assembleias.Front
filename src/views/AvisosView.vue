<template>
  <div class="container py-4">
    <h2 class="mb-4 text-primary">Assembleias e Enquetes</h2>

    <!-- Estado de carregamento -->
    <div v-if="carregando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 text-secondary">Carregando informações, por favor aguarde...</p>
    </div>

    <!-- Nenhuma assembleia -->
    <div v-else-if="assembleias.length === 0" class="alert alert-info">
      Nenhuma assembleia disponível no momento.
    </div>

    <!-- Lista de assembleias -->
    <div
      v-else
      v-for="assembleia in assembleias"
      :key="assembleia.id"
      class="card mb-3 shadow-sm assembleia-card"
    >
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start">
          <h5 class="card-title">{{ assembleia.titulo }}</h5>
          <small class="text-muted">{{ formatarData(assembleia.dataInicio) }}</small>
        </div>

        <p class="card-text mt-2">Tipo: {{ assembleia.tipo }} | Status: {{ assembleia.status }}</p>

        <!-- Pautas -->
        <div v-if="assembleia.pauta">
          <h6>Pautas:</h6>
          <ul>
            <li v-for="(item, index) in assembleia.pauta.split('\n')" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- Enquetes -->
        <div v-if="assembleia.enquetes && assembleia.enquetes.length" class="mt-3">
          <h6>Enquetes:</h6>
          <div class="row g-3">
            <div
              v-for="enquete in (assembleia.enquetes ?? []).sort((a, b) => 
                (b.opcoes ?? []).reduce((s, o) => s + (o.votos ?? 0), 0) - 
                (a.opcoes ?? []).reduce((s, o) => s + (o.votos ?? 0), 0)
              )"
              :key="enquete.id"
              class="col-12 col-md-6 col-lg-4"
            >
              <div class="enquete-card p-3 rounded shadow-sm h-100">
                <strong class="enquete-pergunta">{{ enquete.pergunta }}</strong>
                <ul class="mb-0 mt-2">
                  <li v-for="opcao in (enquete.opcoes ?? [])" :key="opcao.id">
                    {{ opcao.texto }}
                    <span class="text-muted">({{ opcao.votos ?? 0 }} votos)</span>
                  </li>
                </ul>
                <div class="mt-2 text-end text-muted">
                  Total: {{ (enquete.opcoes ?? []).reduce((s, o) => s + (o.votos ?? 0), 0) }} votos
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Link reunião -->
        <div class="mt-3 text-end">
          <a :href="assembleia.linkReuniao" target="_blank" class="btn btn-sm btn-outline-primary">
            Participar da reunião
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import assembleiaApi from '../services/assembleia'
import enqueteApi from '../services/enquete'

interface Opcao {
  id: string
  texto: string
  votos?: number
}

interface Enquete {
  id: string
  pergunta: string
  opcoes?: Opcao[]
}

interface Assembleia {
  id: string
  titulo: string
  pauta: string
  dataInicio: string
  dataFim: string
  tipo: string
  linkReuniao: string
  status: string
  enquetes?: Enquete[]
}

export default defineComponent({
  setup() {
    const assembleias = ref<Assembleia[]>([])
    const carregando = ref(true)

    const carregarAssembleias = async () => {
      try {
        carregando.value = true
        const listaAssembleias = await assembleiaApi.getAll()

        // Busca enquetes para cada assembleia
        const assembleiasComEnquetes = await Promise.all(
          listaAssembleias.map(async (a) => {
            const enquetes = await enqueteApi.getByAssembleia(a.id)
            return { ...a, enquetes }
          })
        )

        assembleias.value = assembleiasComEnquetes
      } catch (err) {
        console.error('Erro ao carregar assembleias/enquetes:', err)
      } finally {
        carregando.value = false
      }
    }

    const formatarData = (data: string) => new Date(data).toLocaleString()

    onMounted(() => {
      carregarAssembleias()
    })

    return { assembleias, carregando, formatarData }
  }
})
</script>

<style scoped>
.assembleia-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.assembleia-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.enquete-card {
  background-color: #f0f8ff;
  border-left: 4px solid #0d6efd;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, box-shadow 0.2s;
}
.enquete-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.enquete-pergunta {
  font-size: 1.05rem;
  color: #0d6efd;
  margin-bottom: 0.5rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

@media (max-width: 576px) {
  .enquete-card {
    margin-bottom: 1rem;
  }
}
</style>
