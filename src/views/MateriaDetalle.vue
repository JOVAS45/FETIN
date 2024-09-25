<!-- MateriaDetalle.vue -->
<template>
    <div class="container mx-auto p-6">
        <!-- Botón de Volver -->
        <button @click="volver"
            class="mb-6 flex items-center text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 px-4 py-2 rounded-lg shadow-lg transition transform hover:-translate-y-1">
            <!-- Ícono de Flecha hacia Atrás -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 19l-7-7 7-7" />
            </svg>
            Volver
        </button>

        <!-- Título principal -->
        <h2 class="text-4xl font-bold text-white mb-8 text-center">Materia: {{ materia.nombre }}</h2>
        <div class="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
            <!-- Botón para ver la lista de estudiantes -->
            <button @click="verListaFechas"            
                class="w-40 h-40 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition duration-300 hover:-translate-y-1 flex flex-col items-center justify-center">
                <!-- Imagen representativa -->
                <img src="@/assets/list.png" alt="Lista de Estudiantes" class="mb-2 w-16 h-16" />
                <span class="text-center text-lg font-semibold">Listas de asistencias</span>
            </button>
            <!-- Botón para ver la lista de estudiantes -->
            <button @click="verListaEstudiantes"
                class="w-40 h-40 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition duration-300 hover:-translate-y-1 flex flex-col items-center justify-center">
                <!-- Imagen representativa -->
                <img src="@/assets/list.png" alt="Lista de Estudiantes" class="mb-2 w-16 h-16" />
                <span class="text-center text-lg font-semibold">Estudiantes</span>
            </button>
            <!-- Botón para registrar estudiantes -->
            <button @click="registrarEstudiantes"
                class="w-40 h-40 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition duration-300 hover:-translate-y-1 flex flex-col items-center justify-center">
                <!-- Imagen representativa -->
                <img src="@/assets/Registro1.png" alt="Registrar Estudiantes" class="mb-2 w-16 h-16" />
                <span class="text-center text-lg font-semibold">Registrar Estudiantes</span>
            </button>
            <!-- Botón para activar la cámara para reconocimiento facial -->
            <button @click="activarCamara"
                class="w-40 h-40 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition duration-300 hover:-translate-y-1 flex flex-col items-center justify-center">
                <!-- Imagen representativa -->
                <img src="@/assets/Registro.png" alt="Reconocimiento Facial" class="mb-2 w-16 h-16" />
                <span class="text-center text-lg font-semibold">Activar Reconocimiento Facial</span>
            </button>
        </div>
    </div>
</template>

<script>
import { ref as firebaseRef, get } from 'firebase/database';
import { db } from '@/config/firebase.js';
import ButtonCard from '@/components/ButtonCard.vue';

export default {
    name: 'MateriaDetalle',
    components:{
        ButtonCard
    },
    data() {
        return {
            id: this.$route.params.id,
            materia: {},
        };
    },
        methods: {
        verListaFecha() {
        this.$router.push({ name: 'ListadoFechas', params: { id: this.id } });
        },
        verListaEstudiantes() {
            this.$router.push({ name: 'ListaEstudiantes', params: { id: this.id } });
        },
        registrarEstudiantes() {
            this.$router.push({ name: 'RegistrarEstudiantes', params: { id: this.id } });
        },
        activarCamara() {
            this.$router.push({ name: 'Reconocimiento', params: { id: this.id } });
        },
        volver() {
            // Navegar de regreso a la página anterior
            this.$router.go(-1);

            // Alternativamente, para navegar a una ruta específica, usa:
            // this.$router.push({ name: 'NombreDeLaRuta' });
        },
        obtenerMateria() {
            const materiaRef = firebaseRef(db, `materias/${this.id}`);
            get(materiaRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        this.materia = snapshot.val();
                    } else {
                        console.error('La materia no existe');
                        alert('La materia no existe.');
                    }
                })
                .catch((error) => {
                    console.error('Error al obtener la materia:', error);
                    alert('Error al obtener la materia.');
                });
        },
    },
    created() {
        this.obtenerMateria();
    },
};
</script>

<style scoped>
/* Estilos personalizados si los necesitas */

/* Botón de Volver */
button:hover {
    /* Añadir efectos adicionales si es necesario */
}

/* Responsividad adicional si se requiere */
@media (max-width: 768px) {
    /* Ajustes para pantallas pequeñas */
}
</style>
