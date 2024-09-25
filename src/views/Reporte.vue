<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center py-10">
        <div class="w-full max-w-6xl bg-white p-8 rounded-lg shadow-lg">
            <h1 class="text-2xl font-bold text-gray-800 mb-6">{{ courseData.courseName }} - Listas de Asistencia</h1>
            
            <div class="flex justify-end mb-4">
                <button 
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-300"
                    @click="exportToExcel"
                >
                    Exportar a Excel
                </button>
            </div>

            <div class="overflow-x-auto">
                <table class="table-auto w-full bg-gray-50 shadow-md rounded-lg">
                    <thead class="bg-blue-500 text-white">
                        <tr>
                            <th class="px-4 py-2">Estudiantes</th>
                            <th v-for="date in courseData.attendanceDates" :key="date" class="px-4 py-2">
                                {{ formatDate(date) }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="student in courseData.students" :key="student.id">
                            <td class="px-4 py-2 font-medium text-gray-700">{{ student.name }}</td>
                            <td v-for="date in courseData.attendanceDates" :key="date" class="px-4 py-2">
                                <span v-if="student.attendance[date]" class="bg-green-200 text-green-800 text-sm font-semibold px-2 py-1 rounded-lg">
                                    Presente
                                </span>
                                <span v-else class="bg-red-200 text-red-800 text-sm font-semibold px-2 py-1 rounded-lg">
                                    Ausente
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx';

// Datos de ejemplo
const courseData = ref({
    courseId: 1,
    courseName: "Matemáticas",
    students: [
        { id: 1, name: "John Doe", attendance: { "2024-09-01": true, "2024-09-02": false } },
        { id: 2, name: "Jane Smith", attendance: { "2024-09-01": true, "2024-09-02": true } }
    ],
    attendanceDates: ["2024-09-01", "2024-09-02"]
});

// Formatear las fechas
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
};

// Exportar a Excel usando SheetJS
const exportToExcel = () => {
    const wsData = [['Estudiantes', ...courseData.value.attendanceDates.map(formatDate)]];

    // Llenar la tabla con los datos de asistencia
    courseData.value.students.forEach((student) => {
        const row = [student.name];
        courseData.value.attendanceDates.forEach((date) => {
            row.push(student.attendance[date] ? 'Presente' : 'Ausente');
        });
        wsData.push(row);
    });

    // Crear la hoja de cálculo
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Asistencia');

    // Descargar el archivo
    XLSX.writeFile(wb, `Asistencia_${courseData.value.courseName}.xlsx`);
};
</script>

<style scoped>
/* No additional custom styles are needed, as Tailwind CSS handles the styling */
</style>
