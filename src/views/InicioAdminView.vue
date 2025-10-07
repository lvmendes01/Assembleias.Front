<template>
  <div class="init-admin">
    <h2>Criar Administrador Inicial</h2>
    <form @submit.prevent="criarAdmin">
      <div>
        <label>Nome:</label>
        <input v-model="nome" required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label>Senha:</label>
        <input type="password" v-model="senha" required />
      </div>
      <button type="submit">Criar Administrador</button>
    </form>
    <p v-if="mensagem">{{ mensagem }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nome: '',
      email: '',
      senha: '',
      mensagem: ''
    };
  },
  methods: {
    criarAdmin() {
      // Aqui você chamaria sua API para criar o admin
      // Exemplo fictício:
      const admin = {
        nome: this.nome,
        email: this.email,
        senha: this.senha,
        tipo: 'admin'
      };

      // Simulação: salvar no localStorage
      localStorage.setItem('adminCreated', 'true');
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('tipoUsuario', 'admin');

      this.mensagem = 'Administrador criado com sucesso!';
      // Redireciona para assembleias
      this.$router.push('/assembleias');
    }
  }
};
</script>
