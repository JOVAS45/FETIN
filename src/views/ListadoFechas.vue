<template>
    <div class="container mx-auto p-6">
        <h2 class="text-4xl font-bold text-white mb-8 text-center">
            Lista de Estudiantes en {{ materia.nombre }}
        </h2>
        <div class="flex justify-between items-center mb-4">
            <button @click="volver"
                class="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                ← Volver
            </button>
            <button @click="exportarExcel"
                class="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Exportar a Excel
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