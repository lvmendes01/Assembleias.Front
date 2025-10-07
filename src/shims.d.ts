// Permite importar arquivos .vue
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Declara módulos JS que não têm tipos
declare module 'bootstrap'

// Declare outros módulos sem tipos, se aparecerem futuramente
// declare module 'nome-do-modulo'
