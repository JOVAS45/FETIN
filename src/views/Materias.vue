<!-- Materias.vue -->
<template>
    <div class="row">
        <div class="section p-10">
            <div class="container mx-auto">
                <!-- Título principal -->
                <h1 class="text-4xl font-bold text-white mb-8 text-center">Gestión de Materias</h1>
                <!-- Layout principal -->
                <div class="flex flex-col md:flex-row md:space-x-10">
                    <!-- Formulario a la izquierda -->
                    <div class="w-full md:w-1/3 bg-white p-8 rounded-lg shadow-lg mb-10 md:mb-0">
                        <h2 class="text-2xl font-semibold text-gray-700 mb-6 text-center">
                            {{ isEditing ? 'Editar Materia' : 'Registrar Materia' }}
                        </h2>
                        <form @submit.prevent="isEditing ? updateMateria() : addMateria()" class="space-y-6">
                            <!-- Campo para el nombre de la materia -->
                            <div>
                                <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre de la Materia</label>
                                <input v-model="materia.nombre" placeholder="Ej: Matemáticas" type="text" id="nombre"
                                    class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                            </div>
                            <!-- Campo para la sigla de la materia -->
                            <div>
                                <label for="sigla" class="block text-sm font-medium text-gray-700 mb-1">Sigla de la Materia</label>
                                <input v-model="materia.sigla" placeholder="Ej: MAT101" type="text" id="sigla"
                                    class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                            </div>
                            <!-- Campo para la fecha -->
                            <div>
                                <label for="fecha" class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                <input v-model="materia.fecha" type="date" id="fecha"
                                    class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                            </div>
                            <!-- Botón de acción -->
                            <div>
                                <button type="submit"
                                    class="w-full bg-indigo-600 text-white py-3 rounded-md shadow hover:bg-indigo-700 transition duration-300">
                                    {{ isEditing ? 'Actualizar Materia' : 'Guardar Materia' }}
                                </button>
                            </div>
                        </form>
                    </div>
                    <!-- Lista de materias a la derecha -->
                    <div class="w-full md:w-2/3">
                        <h2 class="text-2xl font-bold text-white mb-8 text-center">Lista de Materias</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                v-for="(materia, id) in materias"
                                :key="id"
                                @click="goToMateriaDetalle(id)"
                                class="bg-white p-6 rounded-lg shadow-md cursor-pointer transform transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-indigo-50 hover:shadow-xl"
                            >
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h3 class="text-xl font-bold text-indigo-600 mb-2">{{ materia.nombre }}</h3>
                                        <p class="text-gray-700"><strong>Sigla:</strong> {{ materia.sigla }}</p>
                                        <p class="text-gray-700"><strong>Fecha:</strong> {{ materia.fecha }}</p>
                                    </div>
                                    <!-- Botones de editar y eliminar -->
                                    <div class="flex space-x-2">
                                        <button @click.stop="editMateria(id, materia)"
                                            class="text-blue-500 hover:text-blue-700 focus:outline-none">
                                            <!-- Icono de editar -->
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L12 14l-4 1 1-4 7.5-7.5z" />
                                            </svg>
                                        </button>
                                        <button @click.stop="deleteMateria(id)"
                                            class="text-red-500 hover:text-red-700 focus:outline-none">
                                            <!-- Icono de eliminar -->
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> <!-- Este es el cierre del div con class="row" -->
            </div>
        </div>
    </div>
</template>

<script>
import { ref as firebaseRef, onValue, push, remove, update } from 'firebase/database';
import { db } from '@/config/firebase.js';

export default {
    name: 'Materias',
    data() {
        return {
            materia: null,
            materias: {},
            isEditing: false,
            editingId: null,
        };
    },
    methods: {
        // Método para obtener el estado inicial de una materia
        getInitialMateria() {
            return {
                nombre: '',
                sigla: '',
                fecha: new Date().toISOString().split('T')[0],
            };
        },
        // Método para agregar una nueva materia a Firebase
        addMateria() {
            push(firebaseRef(db, 'materias'), this.materia)
                .then(() => {
                    this.materia = this.getInitialMateria();
                    this.isEditing = false;
                    this.editingId = null;
                })
                .catch((error) => {
                    console.error('Error al guardar la materia:', error);
                });
        },
        // Método para preparar la edición de una materia
        editMateria(id, materia) {
            this.isEditing = true;
            this.editingId = id;
            this.materia = { ...materia };
        },
        // Método para actualizar una materia en Firebase
        updateMateria() {
            if (this.editingId) {
                update(firebaseRef(db, `materias/${this.editingId}`), this.materia)
                    .then(() => {
                        this.materia = this.getInitialMateria();
                        this.isEditing = false;
                        this.editingId = null;
                    })
                    .catch((error) => {
                        console.error('Error al actualizar la materia:', error);
                    });
            }
        },
        // Método para eliminar una materia de Firebase
        deleteMateria(id) {
            if (confirm('¿Estás seguro de que deseas eliminar esta materia?')) {
                remove(firebaseRef(db, `materias/${id}`))
                    .catch((error) => {
                        console.error('Error al eliminar la materia:', error);
                    });
            }
        },
        // Método para redirigir a la página de detalles de la materia
        goToMateriaDetalle(id) {
            this.$router.push({ name: 'MateriaDetalle', params: { id } });
        },
    },
    created() {
        // Inicializamos la materia al estado inicial
        this.materia = this.getInitialMateria();
        // Escucha cambios en la base de datos de materias
        onValue(firebaseRef(db, 'materias'), (snapshot) => {
            this.materias = snapshot.val() || {};
        });
    },
};
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí si lo deseas */
</style>
