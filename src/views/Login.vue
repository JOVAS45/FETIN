<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-4xl">
      <div class="md:flex">
        <!-- Formulario de inicio de sesión -->
        <div class="w-full md:w-1/2 p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Iniciar Sesión</h2>

       <form @submit.prevent="loginUser">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
      <input type="email" v-model="email" required placeholder="Ingresa tu correo"
             class="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
    </div>

    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
      <input type="password" v-model="password" required placeholder="Ingresa tu contraseña"
             class="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
    </div>

    <button type="submit" class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Iniciar Sesión
    </button>
  </form>

          <div class="mt-6 text-center">
            <button @click="openModal"
              class="text-indigo-500 hover:underline text-sm font-semibold">¿No tienes cuenta? Regístrate aquí
            </button>
          </div>
        </div>

        <!-- Sección social de la derecha -->
        <div class="w-full md:w-1/2 bg-gradient-to-r from-blue-400 to-white-500 text-white p-8 flex flex-col justify-center">
          <h2 class="text-2xl font-bold mb-6 text-center">Iniciar Sesión con Redes Sociales</h2>
          <button @click="loginWithGoogle"
            class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 mb-4 rounded focus:outline-none focus:shadow-outline">
            Iniciar Sesión con Google
          </button>

        </div>
      </div>
    </div>
    
    <!-- Modal de Registro -->
    <div v-if="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 py-6">
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div class="px-4 py-6 bg-white">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-gray-700">Regístrate</h2>
              <button @click="closeModal" class="text-gray-600 hover:text-gray-900">&times;</button>
            </div>
            
            <form @submit.prevent="registerUser">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
                <input type="email" v-model="registerEmail" required placeholder="Ingresa tu correo"
                       class="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              </div>

              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
                <input type="password" v-model="registerPassword" required placeholder="Ingresa tu contraseña"
                       class="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              </div>

              <div class="flex justify-between">
                <button type="submit" class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Registrarse
                </button>
              </div>
            </form>

            <div class="mt-6">
              <button @click="registerWithGoogle"
                class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 mb-4 rounded focus:outline-none focus:shadow-outline">
                Registrarse con Google
              </button>

  
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');
const registerEmail = ref('');
const registerPassword = ref('');
const isModalOpen = ref(false);

const clientId = '904133473522-4aoglih7ou4ivd3bv1j8e3d8ln892l5a.apps.googleusercontent.com';

const loginWithGoogle = async () => {
  // Carga la SDK de Google OAuth
  google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'email profile openid',  // Puedes añadir más scopes si los necesitas
    callback: async (response) => {
      try {
        const accessToken = response.access_token;
        console.log("Access token recibido:", accessToken);

        // Solicita los datos del usuario con el token de acceso
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }).then(res => res.json());

        console.log("Información del usuario:", userInfo);

        // Guarda la información del usuario localmente o úsala como necesites
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('userData', JSON.stringify(userInfo));

        // Redirige al dashboard o cualquier otra ruta
        router.push('/dashboard');
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    }
  }).requestAccessToken(); // Solicita el token de acceso
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>