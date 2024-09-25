// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importa el archivo de configuración del router
import vue3GoogleLogin from 'vue3-google-login'

// Crea la instancia de la aplicación
const app = createApp(App);

// Usa el router en la instancia de la aplicación
app.use(router);
app.use(vue3GoogleLogin, {
  clientId: '904133473522-4aoglih7ou4ivd3bv1j8e3d8ln892l5a.apps.googleusercontent.com'
})

// Monta la aplicación en el elemento con id 'app'
app.mount('#app');

