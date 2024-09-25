<template>
    <div class="container mx-auto p-6">
        <h2 class="text-4xl font-bold text-white mb-8 text-center">
            Fechas de Asistencia para {{ materia.nombre }}
        </h2>
        <!-- Listado de Fechas -->
        <div class="mb-4">
            <button @click="abrirModal"
                class="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                ➕ Añadir Nueva Fecha
            </button>
        </div>
        <div class="flex flex-col items-center">
            <ul class="w-full bg-white rounded-lg shadow-md">
                <!-- Añadimos una clase condicional para cambiar el color de la fecha seleccionada -->
                <li v-for="fecha in fechas" :key="fecha" @click="toggleFecha(fecha)"
                    :class="{'bg-green-500 text-white': fechaSeleccionada === fecha, 'hover:bg-gray-100': fechaSeleccionada !== fecha}"
                    class="cursor-pointer p-4 border-b">
                    {{ formatFecha(fecha) }}
                </li>
            </ul>
        </div>

        <!-- Listado de Estudiantes -->
        <div v-if="fechaSeleccionada && estudiantes.length > 0" class="mt-8">
            <h3 class="text-2xl font-bold mb-4 text-center">Estudiantes para la fecha: {{ formatFecha(fechaSeleccionada) }}</h3>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border rounded-lg overflow-hidden">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="py-2 px-2 border text-center w-12">N°</th>
                            <th class="py-2 px-2 border text-left w-48">Nombre</th>
                            <th class="py-2 px-2 border text-left w-32">Registro</th>
                            <th class="py-2 px-2 border text-center w-24">Asistencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(estudiante, index) in estudiantes" :key="estudiante.id" class="hover:bg-gray-50">
                            <td class="border px-2 py-2 text-center">{{ index + 1 }}</td>
                            <td class="border px-2 py-2">{{ estudiante.nombre }}</td>
                            <td class="border px-2 py-2">{{ estudiante.registro }}</td>
                            <!-- Aquí marcamos la asistencia de cada estudiante -->
                            <td class="border px-2 py-2 text-center">
                                <input type="checkbox" v-model="asistencias[estudiante.id]" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button @click="guardarAsistencias" class="bg-green-500 text-white px-4 py-2 mt-4 rounded-md shadow hover:bg-green-600">
                    Guardar Asistencia
                </button>
            </div>
        </div>

        <!-- Modal para agregar fechas -->
        <div v-if="modalVisible" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h3 class="text-2xl font-bold mb-4">Crear Nueva Fecha</h3>
                <form @submit.prevent="crearNuevaFecha">
                    <div class="mb-4">
                        <label for="fecha" class="block text-sm font-medium text-gray-700">Seleccionar Fecha</label>
                        <input v-model="nuevaFecha" type="date" id="fecha" class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button type="button" @click="cerrarModal" class="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 focus:outline-none">
                            Cancelar
                        </button>
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none">
                            Guardar Fecha
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref as firebaseRef, get, update } from 'firebase/database';
import { db } from '@/config/firebase.js';

export default {
    name: 'FechasAsistencia',
    data() {
        return {
            materia: {},
            fechas: [], // Arreglo para almacenar las fechas
            estudiantes: [], // Estudiantes para la fecha seleccionada
            fechaSeleccionada: '', // Fecha seleccionada
            nuevaFecha: '', // Fecha seleccionada en el modal
            modalVisible: false, // Control de la visibilidad del modal
            asistencias: {}, // Objeto para almacenar las asistencias de los estudiantes
        };
    },
    mounted() {
        this.obtenerMateria();
    },
    methods: {
        // Obtener datos de la materia
        obtenerMateria() {
            const materiaRef = firebaseRef(db, `materias/${this.$route.params.id}`);
            get(materiaRef).then((snapshot) => {
                if (snapshot.exists()) {
                    this.materia = snapshot.val();
                    this.fechas = this.materia.fechas || []; // Inicializa las fechas desde la base de datos
                }
            });
        },
        // Método para crear una nueva fecha
        crearNuevaFecha() {
            const fecha = this.nuevaFecha;

            if (!fecha) {
                alert('Selecciona una fecha');
                return;
            }

            if (!this.fechas.includes(fecha)) {
                this.fechas.push(fecha); // Agregar la nueva fecha al arreglo local
                this.actualizarFechasFirebase(); // Actualizar las fechas en Firebase
            } else {
                alert('Esta fecha ya está registrada.');
            }

            this.cerrarModal();
        },
        // Actualizar las fechas en Firebase
        actualizarFechasFirebase() {
            const materiaRef = firebaseRef(db, `materias/${this.$route.params.id}`);
            update(materiaRef, { fechas: this.fechas })
                .then(() => {
                    console.log('Fechas actualizadas en Firebase.');
                })
                .catch(error => {
                    console.error('Error al actualizar fechas:', error);
                });
        },
        // Mostrar u ocultar estudiantes al seleccionar una fecha
        toggleFecha(fecha) {
            if (this.fechaSeleccionada === fecha) {
                this.fechaSeleccionada = ''; // Si haces clic en la misma fecha, se oculta la lista
                this.estudiantes = [];
            } else {
                this.fechaSeleccionada = fecha; // Cambiar a la nueva fecha
                this.obtenerEstudiantes(fecha);
            }
        },
        // Obtener estudiantes al seleccionar una fecha
        obtenerEstudiantes(fecha) {
            const estudiantesRef = firebaseRef(db, `materias/${this.$route.params.id}/estudiantes`);
            get(estudiantesRef).then((snapshot) => {
                if (snapshot.exists()) {
                    this.estudiantes = Object.keys(snapshot.val()).map(key => {
                        return { id: key, ...snapshot.val()[key] };
                    });
                    this.inicializarAsistencias(); // Inicializar las asistencias como vacías
                }
            });
        },
        // Inicializar asistencias de estudiantes como vacías
        inicializarAsistencias() {
            this.asistencias = {};
            this.estudiantes.forEach(estudiante => {
                this.asistencias[estudiante.id] = false; // Asistencia inicial como no presente
            });
        },
        // Guardar la asistencia en Firebase
        guardarAsistencias() {
            this.estudiantes.forEach(estudiante => {
                const asistenciaRef = firebaseRef(db, `materias/${this.$route.params.id}/estudiantes/${estudiante.id}/asistencias`);
                update(asistenciaRef, {
                    [this.fechaSeleccionada]: this.asistencias[estudiante.id] // Actualizar asistencia por fecha
                });
            });
            alert('Asistencias guardadas correctamente.');
        },
        // Abrir el modal para crear una nueva fecha
        abrirModal() {
            this.modalVisible = true;
        },
        // Cerrar el modal
        cerrarModal() {
            this.modalVisible = false;
            this.nuevaFecha = ''; // Limpiar la fecha seleccionada
        },
        // Formatear la fecha
        formatFecha(fecha) {
            const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(fecha).toLocaleDateString(undefined, opciones);
        }
    }
};
</script>

<style scoped>
/* Estilos para el modal */
.fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

/* Estilos para la lista */
.bg-green-500 {
    background-color: #10b981; /* Verde personalizado */
}

.text-white {
    color: white;
}
</style>
