<!-- ListaEstudiantes.vue -->
<template>
    <div class="container mx-auto p-6">
        <h2 class="text-4xl font-bold text-white mb-8 text-center">
            Listas de asistencias
        </h2>
        <div class="flex justify-between items-center mb-4">
            <button @click="volver"
                class="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                ← Volver
            </button>
            <button @click="crearListaDeAsistencia"
                class="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Crear
            </button>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border rounded-lg overflow-hidden">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="py-2 px-2 border text-center w-12">N°</th>
                        <th class="py-2 px-2 border text-left w-48">Nombre</th>
                        <th class="py-2 px-2 border text-left w-32">Registro</th>
                        <!-- Generar dinámicamente las fechas como encabezados de columna -->
                        <th v-for="fecha in fechas" :key="fecha" class="py-2 px-2 border text-center w-24">{{ formatFecha(fecha) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(estudiante, index) in estudiantes" :key="estudiante.id" class="hover:bg-gray-50">
                        <td class="border px-2 py-2 text-center">{{ index + 1 }}</td>
                        <td class="border px-2 py-2">{{ estudiante.nombre }}</td>
                        <td class="border px-2 py-2">{{ estudiante.registro }}</td>
                        <!-- Mostrar asistencia por fecha con color verde o rojo -->
                        <td v-for="fecha in fechas" :key="fecha" class="border px-2 py-2 text-center">
                            <span v-if="estudiante.asistencias && estudiante.asistencias[fecha]"
                                class="text-green-500 font-bold">✔️</span>
                            <span v-else-if="estudiante.asistencias && estudiante.asistencias[fecha] === false"
                                class="text-red-500 font-bold">❌</span>
                            <span v-else class="text-gray-400">-</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { ref as dbRef, get } from 'firebase/database';
import { db } from '@/config/firebase.js';

export default {
    name: 'ListaEstudiantes',
    data() {
        return {
            id: this.$route.params.id, // ID de la materia desde la ruta
            materia: {
                nombre: '',
                sigla: '',
            },
            estudiantes: [],
            fechas: [], // Lista de todas las fechas de asistencia
        };
    },
    methods: {
        volver() {
            this.$router.go(-1); // Volver a la página anterior
        },
        
        exportarExcel() {
            // Preparar los datos para exportar
            const data = [];
            this.estudiantes.forEach((estudiante, index) => {
                const row = {
                    'N°': index + 1,
                    'Nombre': estudiante.nombre,
                    'Registro': estudiante.registro,
                };
                // Agregar asistencias por fecha
                this.fechas.forEach((fecha) => {
                    if (estudiante.asistencias && fecha in estudiante.asistencias) {
                        row[this.formatFecha(fecha)] = estudiante.asistencias[fecha] ? 'Presente' : 'Ausente';
                    } else {
                        row[this.formatFecha(fecha)] = '-';
                    }
                });
                data.push(row);
            });
            // Crear el libro de Excel
            const worksheet = XLSX.utils.json_to_sheet(data, { header: ['N°', 'Nombre', 'Registro', ...this.fechas.map(this.formatFecha)] });
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Estudiantes');

            // Ajustar el ancho de las columnas
            const wscols = [
                { wch: 3 },  // N°
                { wch: 30 }, // Nombre
                { wch: 15 }, // Registro
                ...this.fechas.map(() => ({ wch: 12 })), // Fechas
            ];
            worksheet['!cols'] = wscols;

            // Exportar el archivo
            XLSX.writeFile(workbook, `Estudiantes_${this.materia.sigla}.xlsx`);
        },
        obtenerFechas() {
            const fechasSet = new Set();
            this.estudiantes.forEach((estudiante) => {
                if (estudiante.asistencias) {
                    for (let fecha in estudiante.asistencias) {
                        fechasSet.add(fecha);
                    }
                }
            });
            // Ordenar las fechas
            this.fechas = Array.from(fechasSet).sort((a, b) => new Date(a) - new Date(b));
        },
        formatFecha(fecha) {
            const opciones = { day: '2-digit', month: '2-digit', year: '2-digit' };
            return new Date(fecha).toLocaleDateString('es-ES', opciones);
        },
        obtenerMateria() {
            const materiaRef = dbRef(db, `materias/${this.id}`);
            get(materiaRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        this.materia = snapshot.val();
                    } else {
                        console.error('La materia no existe');
                    }
                })
                .catch((error) => {
                    console.error('Error al obtener la materia:', error);
                });
        },
        obtenerEstudiantes() {
            const estudiantesRef = dbRef(db, `materias/${this.id}/estudiantes`);
            get(estudiantesRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        // Convertir el objeto en un array
                        this.estudiantes = Object.keys(data).map((key) => {
                            return {
                                id: key,
                                nombre: data[key].nombre,
                                registro: data[key].registro,
                                asistencias: data[key].asistencias || {},
                            };
                        });
                        // Una vez obtenidos los estudiantes, obtener las fechas
                        this.obtenerFechas();
                    } else {
                        console.log('No hay estudiantes registrados');
                    }
                })
                .catch((error) => {
                    console.error('Error al obtener los estudiantes:', error);
                });
        },
    },
    mounted() {
        this.obtenerMateria();
        this.obtenerEstudiantes();
    },
};
</script>

<style scoped>
/* Estilos personalizados */
table {
    border-collapse: collapse;
}
th, td {
    white-space: nowrap;
}
th {
    font-weight: bold;
}
.w-12 {
    width: 1rem; /* N° */
}
.w-32 {
    width: 6rem; /* Registro */
}
.w-48 {
    width: 4rem; /* Nombre */
}
.w-24 {
    width: 8rem; /* Fechas */
}
</style>
