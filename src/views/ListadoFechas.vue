<template>
    <div>
        <!-- Selector de fecha y botón para generar reporte -->
        <div class="mb-4 flex justify-center items-center">
            <label for="fecha-select" class="mr-2 text-white">Seleccionar Fecha:</label>
            <select id="fecha-select" v-model="fechaSeleccionada" @change="cargarAsistencias"
                class="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option disabled value="">-- Selecciona una Fecha --</option>
                <option v-for="fecha in fechas" :key="fecha" :value="fecha">
                    {{ formatFecha(fecha) }}
                </option>
            </select>

            <!-- Botón para generar reporte -->
            <button @click="generarReporte"
                class="ml-4 p-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-500">
                Generar Reporte
            </button>
             <button @click="generarReporteExcel"
                class="ml-4 p-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:ring focus:ring-green-500">
                Generar Reporte en Excel
            </button>
        </div>

        <!-- Tabla de asistencias (se oculta cuando mostrarReporte es true) -->
        <div v-if="asistencias.length > 0 && !mostrarReporte" class="overflow-x-auto">
            <table class="min-w-full bg-white border rounded-lg overflow-hidden">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="py-2 px-4 border text-center">N°</th>
                        <th class="py-2 px-4 border text-left">Nombre</th>
                        <th class="py-2 px-4 border text-left">Registro</th>
                        <th class="py-2 px-4 border text-center">Asistencia</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(asistencia, index) in asistencias" :key="asistencia.id" class="hover:bg-gray-50">
                        <td class="border px-4 py-2 text-center">{{ index + 1 }}</td>
                        <td class="border px-4 py-2">{{ asistencia.nombre }}</td>
                        <td class="border px-4 py-2">{{ asistencia.registro }}</td>
                        <td class="border px-4 py-2 text-center">
                            <span v-if="asistencia.presente" class="text-green-500 font-semibold">✔️</span>
                            <span v-else class="text-red-500 font-semibold">❌</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Tabla del reporte (se muestra cuando mostrarReporte es true) -->
        <div v-if="mostrarReporte">
            <h3 class="text-lg font-bold mb-4">Reporte de Asistencias - Fecha: {{ formatFecha(fechaSeleccionada) }}</h3>
            <table class="min-w-full bg-white border rounded-lg overflow-hidden">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="py-2 px-4 border text-center">N°</th>
                        <th class="py-2 px-4 border text-left">Nombre</th>
                        <th class="py-2 px-4 border text-left">Registro</th>
                        <th class="py-2 px-4 border text-center">Asistencia</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(asistencia, index) in asistencias" :key="asistencia.id" class="hover:bg-gray-50">
                        <td class="border px-4 py-2 text-center">{{ index + 1 }}</td>
                        <td class="border px-4 py-2">{{ asistencia.nombre }}</td>
                        <td class="border px-4 py-2">{{ asistencia.registro }}</td>
                        <td class="border px-4 py-2 text-center">
                            <span v-if="asistencia.presente" class="text-green-500 font-semibold">✔️</span>
                            <span v-else class="text-red-500 font-semibold">❌</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { ref as dbRef, onValue } from 'firebase/database';
import { db } from '@/config/firebase.js';

export default {
    name: 'ListaAsistencias',
    data() {
        return {
            id: this.$route.params.id,
            materia: {},
            fechas: [],
            fechaSeleccionada: '',
            asistencias: [],
            mostrarReporte: false, // Controla la visibilidad del reporte y la tabla de asistencias
        };
    },
    mounted() {
        this.obtenerMateria();
    },
    methods: {
                generarReporteExcel() {
            if (!this.fechas || this.fechas.length === 0) {
                alert('No hay fechas registradas para generar un reporte.');
                return;
            }

            const estudiantesRef = dbRef(db, `materias/${this.id}/estudiantes`);
            onValue(estudiantesRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const estudiantes = Object.keys(data).map((key) => {
                        return {
                            id: key,
                            nombre: data[key].nombre,
                            registro: data[key].registro,
                            asistencias: data[key].asistencias || {}
                        };
                    });

                    // Preparamos los datos para Excel
                    const hojaDatos = [];

                    // Primera fila con los encabezados
                    const encabezado = ['Nombre', 'Registro'];
                    this.fechas.forEach(fecha => {
                        encabezado.push(this.formatFecha(fecha));
                    });
                    hojaDatos.push(encabezado);

                    // Filas con los datos de cada estudiante
                    estudiantes.forEach(estudiante => {
                        const fila = [estudiante.nombre, estudiante.registro];
                        this.fechas.forEach(fecha => {
                            fila.push(estudiante.asistencias[fecha] ? 'Presente' : 'Ausente');
                        });
                        hojaDatos.push(fila);
                    });

                    // Crear la hoja de Excel
                    const libro = XLSX.utils.book_new();
                    const hoja = XLSX.utils.aoa_to_sheet(hojaDatos);
                    XLSX.utils.book_append_sheet(libro, hoja, 'Reporte de Asistencias');

                    // Exportar el archivo Excel
                    XLSX.writeFile(libro, 'Reporte_Asistencias.xlsx');
                } else {
                    alert('No se encontraron estudiantes.');
                }
            }, (error) => {
                console.error('Error al generar el reporte de Excel:', error);
            });
        },
        obtenerMateria() {
            const materiaRef = dbRef(db, `materias/${this.id}`);
            onValue(materiaRef, (snapshot) => {
                if (snapshot.exists()) {
                    this.materia = snapshot.val();
                    this.fechas = this.materia.fechas || [];
                } else {
                    console.error('La materia no existe');
                }
            }, (error) => {
                console.error('Error al obtener la materia:', error);
            });
        },
        cargarAsistencias() {
            if (!this.fechaSeleccionada) {
                this.asistencias = [];
                return;
            }

            const estudiantesRef = dbRef(db, `materias/${this.id}/estudiantes`);
            onValue(estudiantesRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    this.asistencias = Object.keys(data).map((key) => {
                        return {
                            id: key,
                            nombre: data[key].nombre,
                            registro: data[key].registro,
                            presente: data[key].asistencias && data[key].asistencias[this.fechaSeleccionada] ? true : false,
                        };
                    });
                } else {
                    this.asistencias = [];
                }
            }, (error) => {
                console.error('Error al cargar las asistencias:', error);
                this.asistencias = [];
            });
        },
        formatFecha(fecha) {
            const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(fecha).toLocaleDateString(undefined, opciones);
        },
        generarReporte() {
            if (!this.fechaSeleccionada) {
                alert('Por favor selecciona una fecha para generar el reporte.');
                return;
            }

            // Ocultar la tabla de asistencias y mostrar la tabla de reporte
            this.mostrarReporte = true;
        }
    }
};
</script>

<style scoped>
/* Estilos personalizados */
</style>
