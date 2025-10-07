

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Condomínios</a>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><router-link class="nav-link" to="/assembleias">Assembleias</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/condominios">Condominios</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/enquetes">Enquetes</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/usuarios">Usuarios</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/unidades">Unidades</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/votos">Votos</router-link></li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view />
</template>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
