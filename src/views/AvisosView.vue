<template>
  <div class="container py-4">
    <h2 class="mb-4 text-primary">Assembleias</h2>

    <div v-if="assembleias.length === 0" class="alert alert-info">
      Nenhuma assembleia disponível no momento.
    </div>

    <div v-for="assembleia in assembleias" :key="assembleia.id" class="card mb-3 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <h5 class="card-title">{{ assembleia.titulo }}</h5>
          <small class="text-muted">{{ formatarData(assembleia.dataInicio) }}</small>
        </div>

        <p class="card-text mt-2">Tipo: {{ assembleia.tipo }} | Status: {{ assembleia.status }}</p>

        <div v-if="assembleia.pauta">
          <h6>Pautas:</h6>
          <ul>
            <li v-for="(item, index) in assembleia.pauta.split('\n')" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>

        <div class="mt-2">
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
import assembleiaApi from '../services/assembleia' // seu serviço de API

interface Assembleia {
  id: string
  titulo: string
  pauta: string
  dataInicio: string
  dataFim: string
  tipo: string
  linkReuniao: string
  status: string
}

export default defineComponent({
  setup() {
    const assembleias = ref<Assembleia[]>([])

    const carregarAssembleias = async () => {
      try {
        assembleias.value = await assembleiaApi.getAll() // busca direto da API
      } catch (err) {
        console.error('Erro ao carregar assembleias:', err)
      }
    }

    onMounted(() => {
      carregarAssembleias()
    })

    const formatarData = (data: string) => {
      return new Date(data).toLocaleString()
    }

    return { assembleias, formatarData }
  }
})
</script>

<style scoped>
.card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}
</style>
