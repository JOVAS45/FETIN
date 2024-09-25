<!-- Reconocimiento.vue -->
<template>
    <div class="container mx-auto p-6">
        <h2 class="text-4xl font-bold text-white mb-8 text-center">Reconocimiento Facial en {{ materia.nombre }}</h2>
        <div class="flex flex-col md:flex-row md:space-x-6">
            <!-- Cámara para reconocimiento facial -->
            <div class="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-lg">
                <h3 class="text-2xl font-semibold text-gray-700 mb-4 text-center">Cámara de Reconocimiento</h3>
                <!-- Selector de cámaras -->
                <div class="camera-selection mt-4 w-full">
                    <label for="camera-select" class="block text-sm font-medium text-gray-700 mb-1">Seleccionar
                        Cámara:</label>
                    <select id="camera-select" v-model="selectedCameraId" @change="cambiarCamara"
                        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        <option v-for="camera in cameras" :key="camera.deviceId" :value="camera.deviceId">
                            {{ camera.label || 'Cámara ' + camera.deviceId }}
                        </option>
                    </select>
                </div>
                <!-- Video -->
                <div class="video-container relative mt-4">
                    <video ref="video" class="rounded-lg shadow-lg" autoplay muted playsinline></video>
                    <canvas ref="canvas" class="absolute top-0 left-0 w-full h-full"></canvas>
                </div>
                <!-- Botón para iniciar/detener reconocimiento -->
                <div class="mt-4 flex justify-center">
                    <button @click="toggleRecognition"
                        class="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-300">
                        {{ recognitionActive ? 'Detener Reconocimiento' : 'Iniciar Reconocimiento' }}
                    </button>
                </div>
            </div>
            <!-- Reporte en tiempo real -->
            <div class="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-lg mt-6 md:mt-0">
                <h3 class="text-2xl font-semibold text-gray-700 mb-4 text-center">Reporte en Tiempo Real Asistencia     </h3>
                <div>
                    Estudiantes Registrados
                    <CardEstudiante v-if="showMath" :estudiante="estudianteIdentificado"></CardEstudiante>
                </div>

                <!-- <ul class="divide-y divide-gray-200">
                    <li v-for="(estudiante, index) in recognizedStudents" :key="index" class="py-2">
                        <span class="font-medium">{{ estudiante.nombre }}</span> - Reconocido a las {{ estudiante.hora
                        }}
                    </li>
                </ul> -->
            </div>

        </div>
    </div>
</template>

<script>
import { ref as dbRef, get, update } from 'firebase/database';
import { db } from '@/config/firebase.js';
import axios from 'axios';
import RegistrarEstudiantes from './RegistrarEstudiantes.vue';
import CardEstudiante from '@/components/CardEstudiante.vue';

export default {
    name: 'Reconocimiento',
    components: {
        CardEstudiante
    },
    data() {
        return {
            id: this.$route.params.id,
            materia: {},
            estudiantes: [],
            recognizedStudents: [],
            recognitionActive: false,
            stream: null,
            intervalId: null,
            apiEndpoint: 'http://34.39.149.130:8000/asistencias/buscar_rostro', // Asegúrate de que este sea el endpoint correcto
            cameras: [], // Lista de cámaras disponibles
            selectedCameraId: null,
            message: '',
            estudianteIdentificado: null,
            showMath: false
            // ID de la cámara seleccionada
        };
    },
    mounted() {
        this.obtenerMateria();
        this.obtenerEstudiantes();
        this.getCameras(); // Obtener las cámaras disponibles al montar el componente
        

    },
    methods: {
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
                                fotoUrl: data[key].fotoUrl,
                            };
                        });
                    } else {
                        console.log('No hay estudiantes registrados');
                    }
                })
                .catch((error) => {
                    console.error('Error al obtener los estudiantes:', error);
                });
        },
        async getCameras() {
            try {
                // Pedir permiso para acceder a dispositivos multimedia
                await navigator.mediaDevices.getUserMedia({ video: true });
                const devices = await navigator.mediaDevices.enumerateDevices();
                this.cameras = devices.filter(device => device.kind === 'videoinput');
                // Seleccionar la primera cámara por defecto
                if (this.cameras.length > 0) {
                    this.selectedCameraId = this.cameras[0].deviceId;
                }
            } catch (err) {
                console.error('Error al acceder a las cámaras:', err);
            }
        },
        async cambiarCamara() {
            // Reiniciar el stream al cambiar de cámara
            if (this.recognitionActive) {
                await this.iniciarStream();
            }
        },
        async iniciarStream() {
            if (this.stream) {
                // Detener el stream anterior si existe
                this.stream.getTracks().forEach(track => track.stop());
            }
            const video = this.$refs.video;
            try {
                const constraints = {
                    video: { deviceId: this.selectedCameraId ? { exact: this.selectedCameraId } : undefined },
                };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                this.stream = stream;
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play();
                };
            } catch (err) {
                console.error('Error al acceder a la cámara:', err);
                alert('No se pudo acceder a la cámara. Por favor, verifica los permisos y que tu cámara funcione correctamente.');
            }
        },
        toggleRecognition() {
            if (this.recognitionActive) {
                // Detener reconocimiento
                this.recognitionActive = false;
                if (this.intervalId) {
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                }
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                    this.stream = null;
                }
            } else {
                // Iniciar reconocimiento
                this.recognitionActive = true;
                this.iniciarStream().then(() => {
                    this.startFaceRecognition();
                });
            }
        },
        startFaceRecognition() {
            this.intervalId = setInterval(() => {
                this.detectFaces();
            }, 4000); // Cada 1 segundo
        },
        async buscarEstudiante(faceid) {
            try {
                // Obtén la referencia a la colección de estudiantes
                const estudiantesRef = dbRef(db, 'materias/' + this.id + '/estudiantes');

                // Lee los datos de la referencia
                const snapshot = await get(estudiantesRef);

                if (snapshot.exists()) {
                    // Obtén los datos como un objeto
                    const estudiantes = snapshot.val();

                    // Filtra los estudiantes para encontrar el que coincida con el faceid
                    const estudianteEncontrado = Object.values(estudiantes).find(estudiante => estudiante.faceId === faceid);
                    console.log("ESTUDIATE ENCONTRADOS", estudianteEncontrado);
                    return estudianteEncontrado || null; // Retorna el estudiante encontrado o null si no se encuentra
                } else {
                    console.log('No hay datos disponibles');
                    return null;
                }
            } catch (error) {
                console.error('Error al buscar el estudiante:', error);
                throw error;
            }
        },
        async detectFaces() {
            const video = this.$refs.video;
            if (!video || video.readyState !== 4) {
                return;
            }
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(async (blob) => {
                if (!blob) {
                    console.error('No se pudo obtener el blob de la imagen.');
                    return;
                }
                const formData = new FormData();
                formData.append('image', blob, 'frame.jpg');
                formData.append('materiaId', this.id); // Enviar el id de la materia

                try {
                    const response = await axios.post(this.apiEndpoint, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    const resultado = response.data;
                    ///console.log("este es el resultado", resultado);
                    if (resultado.matches) {
                        var idEstudent = resultado.matches[0].FaceId;
                        var datosEstudiante = await this.buscarEstudiante(idEstudent);
                        if(datosEstudiante){
                            this.showMath = true
                            this.estudianteIdentificado = datosEstudiante
                            console.log(this.estudianteIdentificado)
                            this.message = 'ESTUDIANTE AUTENTIFICADO CON EXITO';
                        }
                        //console.log('esudinte encontrado ', datosEstudiante);
                        //this.registrarEstudiantes
                    } else {
                        console.log('No se encontró coincidencia:', resultado.message || '');
                    }
                } catch (error) {
                    console.error('Error al enviar la imagen a la API:', error);
                }
            }, 'image/jpeg');
        },
        procesarReconocimiento(estudianteId) {
            // Verificar si el estudiante ya fue reconocido
            const yaReconocido = this.recognizedStudents.find(est => est.id === estudianteId);
            if (!yaReconocido) {
                // Obtener datos del estudiante
                const estudiante = this.estudiantes.find(est => est.id === estudianteId);
                if (estudiante) {
                    const now = new Date();
                    const hora = now.toLocaleTimeString();
                    this.recognizedStudents.push({
                        id: estudiante.id,
                        nombre: estudiante.nombre,
                        hora: hora,
                    });
                    // Actualizar asistencia en Firebase
                    const fechaActual = now.toISOString().split('T')[0]; // YYYY-MM-DD
                    const asistenciaRef = dbRef(db, `materias/${this.id}/estudiantes/${estudiante.id}/asistencias`);
                    update(asistenciaRef, {
                        [fechaActual]: true,
                    })
                        .then(() => {
                            console.log(`Asistencia registrada para ${estudiante.nombre}`);
                        })
                        .catch((error) => {
                            console.error('Error al actualizar la asistencia:', error);
                        });
                } else {
                    console.error('Estudiante no encontrado en la lista local.');
                }
            }
        },
    },
    beforeUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
    },
};
</script>

<style scoped>
.video-container {
    position: relative;
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
}

video {
    width: 100%;
    border-radius: 0.5rem;
}

canvas {
    /* Para el overlay */
    position: absolute;
    top: 0;
    left: 0;
}
</style>
