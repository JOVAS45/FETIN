<template>
    <div class="container mx-auto p-6">
        <h2 class="text-4xl font-bold text-white mb-8 text-center">
            Fechas de Asistencia para {{ materia.nombre }}
        </h2>

        <!-- Botones para añadir fecha y generar reporte -->
        <div class="mb-4 flex space-x-4">
            <button @click="abrirModal"
                class="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                ➕ Añadir Nueva Fecha
            </button>
            <button @click="abrirModalReporte"
                class="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                ➕ Generar Reporte
            </button>
        </div>

        <!-- Listado de Fechas (sólo visible si no se está generando el reporte) -->
        <div v-if="!mostrarReporte" class="flex flex-col items-center">
            <ul class="w-full bg-white rounded-lg shadow-md">
                <li v-for="fecha in fechas" :key="fecha" @click="toggleFecha(fecha)"
                    :class="{'bg-green-500 text-white': fechaSeleccionada === fecha, 'hover:bg-gray-100': fechaSeleccionada !== fecha}"
                    class="cursor-pointer p-4 border-b">
                    {{ formatFecha(fecha) }}
                </li>
            </ul>
            
        </div>

        <!-- Listado de Estudiantes para la fecha seleccionada (sólo visible si no se está generando el reporte) -->
        <div v-if="!mostrarReporte && fechaSeleccionada && estudiantes.length > 0" class="mt-8">
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
                            <!-- Marcado de asistencia -->
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

        <!-- Mostrar reporte generado en una tabla -->
        <div v-if="mostrarReporte" class="mt-8">
            <h3 class="text-2xl font-bold mb-4 text-center">Reporte de Asistencia</h3>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border rounded-lg overflow-hidden">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="py-2 px-2 border text-center w-12">N°</th>
                            <th class="py-2 px-2 border text-left w-48">Nombre</th>
                            <!-- Fechas del reporte -->
                            <th v-for="fecha in fechasFiltradas" :key="fecha" class="py-2 px-2 border text-center w-24">
                                {{ formatFecha(fecha) }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(estudiante, index) in reporteGenerado" :key="estudiante.id" class="hover:bg-gray-50">
                            <td class="border px-2 py-2 text-center">{{ index + 1 }}</td>
                            <td class="border px-2 py-2">{{ estudiante.nombre }}</td>
                            <!-- Asistencia para cada fecha -->
                            <td v-for="fecha in fechasFiltradas" :key="fecha" class="border px-2 py-2 text-center">
                                {{ estudiante.asistencias[fecha] ? 'Presente' : 'Ausente' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="flex justify-between mt-4">
                <button @click="exportarExcel" class="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">
                    Exportar a Excel
                </button>
                <button @click="volverAlInicio" class="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600">
                    Volver
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

        <!-- Modal para seleccionar el rango de fechas -->
        <div v-if="modalReporteVisible" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h3 class="text-2xl font-bold mb-4">Seleccionar Rango de Fechas</h3>
                <form @submit.prevent="generarReporte">
                    <div class="mb-4">
                        <label for="fechaInicio" class="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                        <input v-model="fechaInicio" type="date" id="fechaInicio" class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div class="mb-4">
                        <label for="fechaFin" class="block text-sm font-medium text-gray-700">Fecha Fin</label>
                        <input v-model="fechaFin" type="date" id="fechaFin" class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button type="button" @click="cerrarModalReporte" class="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 focus:outline-none">
                            Cancelar
                        </button>
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none">
                            Generar Reporte
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import * as XLSX from 'xlsx';
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
            modalVisible: false, // Control del modal para añadir fecha
            modalReporteVisible: false, // Control del modal para el reporte
            fechaInicio: '', // Fecha de inicio para el reporte
            fechaFin: '', // Fecha de fin para el reporte
            fechasFiltradas: [], // Fechas seleccionadas dentro del rango para el reporte
            reporteGenerado: [], // Estudiantes con sus asistencias para el reporte
            asistencias: {}, // Objeto para almacenar las asistencias de los estudiantes
            mostrarReporte: false, // Control para mostrar u ocultar el reporte
        };
    },
    mounted() {
        this.obtenerMateria();
    },
    methods: {
          exportarExcel() {
            const data = [];
            this.reporteGenerado.forEach((estudiante, index) => {
                const row = {
                    'N°': index + 1,
                    'Nombre': estudiante.nombre,
                };
                // Agregar asistencias por fecha
                this.fechasFiltradas.forEach((fecha) => {
                    row[this.formatFecha(fecha)] = estudiante.asistencias[fecha] ? 'Presente' : 'Ausente';
                });
                data.push(row);
            });

            // Crear el libro de Excel
            const worksheet = XLSX.utils.json_to_sheet(data, { header: ['N°', 'Nombre', ...this.fechasFiltradas.map(this.formatFecha)] });
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte de Asistencia');

            // Ajustar el ancho de las columnas
            const wscols = [
                { wch: 3 },  // N°
                { wch: 30 }, // Nombre
                ...this.fechasFiltradas.map(() => ({ wch: 12 })), // Fechas
            ];
            worksheet['!cols'] = wscols;

            // Exportar el archivo
            XLSX.writeFile(workbook, `Reporte_Asistencia_${this.materia.nombre}.xlsx`);
        },
        volverAlInicio() {
            this.mostrarReporte = false;
        },
        // Obtener datos de la materia
        obtenerMateria() {
            const materiaRef = firebaseRef(db, `materias/${this.$route.params.id}`);
            get(materiaRef).then((snapshot) => {
                if (snapshot.exists()) {
                    this.materia = snapshot.val();
                    this.fechas = this.materia.fechas || [];
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
                        const estudiante = snapshot.val()[key];
                        const asistenciaRegistrada = estudiante.asistencias && estudiante.asistencias[fecha];
                        return {
                            id: key,
                            ...estudiante,
                            asistencia: asistenciaRegistrada !== undefined ? asistenciaRegistrada : false
                        };
                    });
                    this.inicializarAsistencias();
                }
            });
        },
        // Inicializar asistencias
        inicializarAsistencias() {
            this.asistencias = {};
            this.estudiantes.forEach(estudiante => {
                this.asistencias[estudiante.id] = estudiante.asistencia !== undefined ? estudiante.asistencia : false;
            });
        },
        // Guardar la asistencia en Firebase
        guardarAsistencias() {
            const updates = this.estudiantes.map(estudiante => {
                const asistenciaRef = firebaseRef(db, `materias/${this.$route.params.id}/estudiantes/${estudiante.id}/asistencias`);
                return update(asistenciaRef, {
                    [this.fechaSeleccionada]: this.asistencias[estudiante.id]
                });
            });

            Promise.all(updates)
                .then(() => {
                    alert('Asistencias guardadas correctamente.');
                })
                .catch(error => {
                    console.error('Error al guardar asistencias:', error);
                    alert('Ocurrió un error al guardar las asistencias.');
                });
        },
        // Abrir el modal para crear una nueva fecha
        abrirModal() {
            this.modalVisible = true;
        },
        // Cerrar el modal
        cerrarModal() {
            this.modalVisible = false;
            this.nuevaFecha = '';
        },
        // Abrir el modal para generar el reporte
        abrirModalReporte() {
            this.modalReporteVisible = true;
        },
        // Cerrar el modal de reporte
        cerrarModalReporte() {
            this.modalReporteVisible = false;
            this.fechaInicio = '';
            this.fechaFin = '';
        },
        // Generar el reporte de asistencia
        generarReporte() {
            if (!this.fechaInicio || !this.fechaFin) {
                alert('Por favor selecciona el rango de fechas.');
                return;
            }

            // Filtrar las fechas dentro del rango seleccionado
            this.fechasFiltradas = this.fechas.filter(fecha => fecha >= this.fechaInicio && fecha <= this.fechaFin);

            // Generar el reporte de asistencia para cada estudiante
            this.reporteGenerado = this.estudiantes.map(estudiante => {
                const asistencias = this.fechasFiltradas.reduce((acc, fecha) => {
                    acc[fecha] = estudiante.asistencias[fecha] || false;
                    return acc;
                }, {});
                return {
                    id: estudiante.id,
                    nombre: estudiante.nombre,
                    asistencias,
                };
            });

            // Ocultar el listado de fechas y mostrar el reporte
            this.mostrarReporte = true;

            this.cerrarModalReporte();
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
.fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.bg-green-500 {
    background-color: #10b981;
}

.text-white {
    color: white;
}
</style>
