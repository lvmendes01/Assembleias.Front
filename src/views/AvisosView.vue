<template>
  <div class="container py-4">
    <h2 class="mb-4 text-primary">Avisos aos Condôminos</h2>

    <div v-if="avisos.length === 0" class="alert alert-info">
      Nenhum aviso disponível no momento.
    </div>

    <div class="row g-3">
      <div v-for="aviso in avisos" :key="aviso.id" class="col-12 col-md-6 col-lg-4">
        <div class="card shadow-sm h-100">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start">
              <h5 class="card-title">{{ aviso.titulo }}</h5>
              <small class="text-muted">{{ aviso.data }}</small>
            </div>
            <p class="card-text mt-2 flex-grow-1">{{ aviso.mensagem }}</p>
            <div class="mt-3 text-end">
              <button class="btn btn-sm btn-outline-primary" @click="marcarComoLido(aviso.id)">
                Marcar como lido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

interface Aviso {
  id: number
  titulo: string
  mensagem: string
  data: string
  lido?: boolean
}

export default defineComponent({
  setup() {
    const avisos = ref<Aviso[]>([
      { id: 1, titulo: 'Manutenção do elevador', mensagem: 'O elevador do bloco A ficará fora de serviço das 10h às 14h.', data: '10/10/2025' },
      { id: 2, titulo: 'Assembleia Geral', mensagem: 'Assembleia marcada para 15/10/2025 às 19h no salão de festas.', data: '08/10/2025' },
      { id: 3, titulo: 'Limpeza das áreas comuns', mensagem: 'A limpeza do jardim será realizada na próxima terça-feira.', data: '09/10/2025' }
    ])

    const marcarComoLido = (id: number) => {
      const aviso = avisos.value.find(a => a.id === id)
      if (aviso) aviso.lido = true
    }

    return { avisos, marcarComoLido }
  }
})
</script>

<style scoped>
.card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}
.card-text {
  white-space: pre-line;
}
</style>
