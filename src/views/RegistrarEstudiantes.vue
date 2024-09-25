<!-- RegistrarEstudiantes.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
        <div class="container mx-auto">
            <!-- Título principal -->
            <h1 class="text-4xl font-bold text-white mb-8 text-center">
                Registrar Estudiantes en {{ materia.nombre }}
            </h1>
            <!-- Layout principal -->
            <div class="flex flex-col md:flex-row md:space-x-10">
                <!-- Formulario a la izquierda -->
                <div class="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-lg mb-10 md:mb-0">
                    <h2 class="text-2xl font-semibold text-gray-700 mb-6 text-center">
                        Datos del Estudiante
                    </h2>
                    <form @submit.prevent="submitForm" enctype="multipart/form-data">
                        <!-- Campo para el nombre del estudiante -->
                        <div class="mb-4">
                            <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">Nombre del Estudiante</label>
                            <input v-model="estudiante.nombre" placeholder="Ej: Juan Pérez" type="text" id="nombre"
                                class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <!-- Campo para el registro del estudiante -->
                        <div class="mb-4">
                            <label for="registro" class="block text-sm font-medium text-gray-700 mb-1">Registro</label>
                            <input v-model="estudiante.registro" placeholder="Ej: 20210001" type="text" id="registro"
                                class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <!-- Selección de método de carga de foto -->
                        <div class="mb-4">
                            <span class="block text-sm font-medium text-gray-700 mb-1">Método de Carga de Foto</span>
                            <div class="flex items-center">
                                <input type="radio" id="cargarArchivo" value="archivo" v-model="metodoCarga"
                                    class="mr-2">
                                <label for="cargarArchivo" class="text-gray-700">Subir desde Archivo</label>
                            </div>
                            <div class="flex items-center mt-2">
                                <input type="radio" id="capturarCamara" value="camara" v-model="metodoCarga"
                                    class="mr-2">
                                <label for="capturarCamara" class="text-gray-700">Capturar con Cámara</label>
                            </div>
                        </div>
                        <!-- Campo para subir archivo -->
                        <div v-if="metodoCarga === 'archivo'" class="mb-4">
                            <label for="foto" class="block text-sm font-medium text-gray-700 mb-1">Subir Foto</label>
                            <input type="file" id="foto" ref="fotoInput" @change="handleFileUpload"
                                class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <!-- Botón para abrir la cámara -->
                        <div v-if="metodoCarga === 'camara'" class="mb-4">
                            <button type="button" @click="abrirCamara"
                                class="w-full bg-blue-500 text-white py-3 rounded-md shadow hover:bg-blue-600 transition duration-300"
                                :disabled="camaraActiva">
                                Abrir Cámara
                            </button>
                        </div>
                        <!-- Botón para guardar -->
                        <div>
                            <button type="submit"
                                class="w-full bg-green-500 text-white py-3 rounded-md shadow hover:bg-green-600 transition duration-300">
                                Guardar Estudiante
                            </button>
                        </div>
                    </form>
                </div>
                <!-- Sección de captura de foto a la derecha -->
                <div class="w-full md:w-1/2 flex flex-col items-center">
                    <!-- Mostrar la cámara y botones cuando está activa -->
                    <div v-if="camaraActiva" class="face-capture mt-8 md:mt-0 w-full">
                        <h2 class="text-2xl font-semibold text-gray-700 mb-6 text-center">
                            Capturar Foto del Estudiante
                        </h2>
                        <!-- Selector de cámaras -->
                        <div class="camera-selection mt-4 w-full">
                            <label for="camera-select" class="block text-sm font-medium text-gray-700 mb-1">Seleccionar Cámara:</label>
                            <select id="camera-select" v-model="selectedCameraId" @change="cambiarCamara"
                                class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option v-for="camera in cameras" :key="camera.deviceId" :value="camera.deviceId">
                                    {{ camera.label || 'Cámara ' + camera.deviceId }}
                                </option>
                            </select>
                        </div>
                        <!-- Video y canvas de overlay -->
                        <div class="video-container relative mt-4">
                            <video ref="video" class="rounded-lg shadow-lg w-full" autoplay muted playsinline></video>
                            <canvas ref="canvas" class="absolute top-0 left-0 w-full h-full"></canvas>
                        </div>
                        <!-- Botón para tomar foto -->
                        <div class="mt-4 w-full">
                            <button @click="tomarFoto"
                                class="w-full bg-green-500 text-white py-2 rounded-md shadow hover:bg-green-600 transition duration-300"
                                :disabled="!faceBox">
                                Tomar Foto
                            </button>
                        </div>
                        <!-- Botón para cerrar la cámara -->
                        <div class="mt-2 w-full">
                            <button @click="cerrarCamara"
                                class="w-full bg-red-500 text-white py-2 rounded-md shadow hover:bg-red-600 transition duration-300">
                                Cerrar Cámara
                            </button>
                        </div>
                    </div>
                    <!-- Mostrar la foto capturada y botones de guardar y retomar -->
                    <div v-else-if="fotoCapturada" class="photo-preview mt-8 md:mt-0 w-full">
                        <h2 class="text-2xl font-semibold text-gray-700 mb-6 text-center">
                            Foto Capturada
                        </h2>
                        <img :src="fotoPreview" alt="Foto del Estudiante" class="rounded-lg shadow-lg mb-4 w-full">
                        <!-- Botones para guardar o retomar foto -->
                        <div class="w-full flex space-x-4">
                            <button @click="guardarEstudiante"
                                class="w-1/2 bg-green-500 text-white py-2 rounded-md shadow hover:bg-green-600 transition duration-300">
                                Guardar Estudiante
                            </button>
                            <button @click="retomarFoto"
                                class="w-1/2 bg-yellow-500 text-white py-2 rounded-md shadow hover:bg-yellow-600 transition duration-300">
                                Retomar Foto
                            </button>
                        </div>
                    </div>
                    <!-- Mensaje inicial -->
                    <div v-else class="flex flex-col items-center">
                        <p class="text-gray-500 text-center">Por favor, completa los datos y selecciona un método para cargar la foto del estudiante.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref as firebaseRef, push, get } from 'firebase/database';
import { db } from '@/config/firebase.js';
import axios from 'axios';
import * as faceapi from 'face-api.js'; // Importar face-api.js

export default {
    name: 'RegistrarEstudiantes',
    data() {
        return {
            id: this.$route.params.id,
            materia: {},
            estudiante: {
                nombre: '',
                registro: '',
                foto: '',
                materiaNombre: '',
                materiaSigla: '',
                fotoUrl: '', // URL de la foto guardada
                // faceId eliminado
            },
            // Variables para la captura de foto
            camaraActiva: false,
            fotoCapturada: false,
            fotoBlob: null,
            fotoPreview: '',
            stream: null, // Stream de la cámara
            cameras: [], // Lista de cámaras disponibles
            selectedCameraId: null, // ID de la cámara seleccionada
            metodoCarga: 'archivo', // Método de carga seleccionado
            // apiEndpoint eliminado
            faceBox: null, // Coordenadas de la cara detectada
            intervalId: null, // ID del intervalo de detección
            faceDetectionModelLoaded: false, // Estado de carga del modelo
        };
    },
    async mounted() {
        await this.obtenerMateria();
        await this.getCameras();
        // Cargar modelos de detección de rostros
        await this.loadFaceDetectionModels();
    },
    methods: {
        async loadFaceDetectionModels() {
            try {
                // Cargar modelos desde la carpeta public/models
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
                this.faceDetectionModelLoaded = true;
                console.log('Modelos de detección de rostros cargados.');
            } catch (error) {
                console.error('Error al cargar los modelos de face-api.js:', error);
            }
        },
        async submitForm() {
    // Validar los campos si es necesario
    if (!this.estudiante.nombre || !this.estudiante.registro) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
    }

    if (this.metodoCarga === 'archivo' && !this.estudiante.foto) {
        alert("Por favor, sube una foto o captura una con la cámara.");
        return;
    }

    if (this.metodoCarga === 'camara' && !this.fotoBlob) {
        alert("Por favor, captura una foto con la cámara.");
        return;
    }

    try {
        let formData = new FormData();
        formData.append('nombre', this.estudiante.nombre);
        formData.append('registro', this.estudiante.registro);

        let imageFile = null;

        if (this.metodoCarga === 'archivo') {
            imageFile = this.estudiante.foto;
        } else if (this.metodoCarga === 'camara') {
            imageFile = this.fotoBlob;
        }

        if (imageFile) {
            formData.append('file', imageFile, 'face.jpg');
        }

        // Realizar la solicitud POST con Axios
        const response = await axios.post('http://34.39.149.130:8000/estudiantes/upload_photo_s3', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Manejar la respuesta exitosa
        const respuesta = response.data;
        const url_foto = respuesta.image_url;
        const face_id = respuesta.face_records[0]?.Face?.FaceId || '';

        // Asignar los datos al estudiante
        this.estudiante.fotoUrl = url_foto;
        this.estudiante.faceId = face_id; // Asegúrate de asignar faceId

        // Guardar el estudiante en Firebase bajo la materia correspondiente
        const newRef = await push(firebaseRef(db, `materias/${this.id}/estudiantes`), this.estudiante);
        const estudianteId = newRef.key; // Obtener el ID del estudiante

        console.log(url_foto, face_id);
        console.log("Respuesta del servidor:", response.data);
        alert("Estudiante registrado exitosamente.");

        // Limpiar el formulario
        this.resetForm();
    } catch (error) {
        // Manejar errores
        console.error("Error al registrar el estudiante:", error);
        alert("Hubo un error al registrar el estudiante. Por favor, intenta de nuevo.");
    }
},

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.estudiante.foto = file;
                console.log("Archivo seleccionado:", this.estudiante.foto);
            }
        },
        async obtenerMateria() {
            try {
                // Obtener los datos de la materia desde Firebase
                const materiaRef = firebaseRef(db, `materias/${this.id}`);
                const snapshot = await get(materiaRef);
                if (snapshot.exists()) {
                    this.materia = snapshot.val();
                    // Asignar nombre y sigla de la materia al estudiante
                    this.estudiante.materiaNombre = this.materia.nombre;
                    this.estudiante.materiaSigla = this.materia.sigla;
                } else {
                    console.error('La materia no existe');
                    alert('La materia no existe.');
                }
            } catch (error) {
                console.error('Error al obtener la materia:', error);
                alert('Error al obtener los datos de la materia.');
            }
        },
        // Métodos para manejar la cámara y captura de foto
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
                alert('No se pudo acceder a las cámaras. Por favor, verifica los permisos.');
            }
        },
        async abrirCamara() {
            if (!this.estudiante.nombre || !this.estudiante.registro) {
                alert('Por favor, completa todos los campos.');
                return;
            }
            this.camaraActiva = true; // Activar la cámara para que el elemento <video> se renderice

            await this.$nextTick(); // Esperar a que el DOM se actualice

            this.iniciarStream();
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
                    video.addEventListener('playing', () => {
                        this.startFaceDetection();
                    });
                };
            } catch (err) {
                console.error('Error al acceder a la cámara:', err);
                alert('No se pudo acceder a la cámara. Por favor, verifica los permisos y que tu cámara funcione correctamente.');
                this.cerrarCamara();
            }
        },
        async cambiarCamara() {
            // Reiniciar el stream al cambiar de cámara
            if (this.camaraActiva) {
                await this.iniciarStream();
            }
        },
        cerrarCamara() {
            this.camaraActiva = false;
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            }
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            this.faceBox = null;
            const canvas = this.$refs.canvas;
            if (canvas) {
                const context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        },
        startFaceDetection() {
            if (!this.faceDetectionModelLoaded) {
                console.error('Modelos de detección de rostros no cargados.');
                return;
            }
            const video = this.$refs.video;
            if (!video) {
                console.error('El elemento de video no está disponible.');
                return;
            }
            this.intervalId = setInterval(async () => {
                await this.detectFaces();
            }, 500); // Cada 500ms
        },
        async detectFaces() {
            const video = this.$refs.video;
            if (!video || video.readyState !== 4) { // Verificar que el video esté listo
                return;
            }
            try {
                const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions());
                this.drawFaceBox(detections);
            } catch (error) {
                console.error('Error en la detección de rostros:', error);
            }
        },
        drawFaceBox(detection) {
            const canvas = this.$refs.canvas;
            const video = this.$refs.video;
            if (!canvas || !video) {
                return;
            }
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.clearRect(0, 0, canvas.width, canvas.height);

            if (detection) {
                const { x, y, width, height } = detection.box;
                context.strokeStyle = '#00FF00';
                context.lineWidth = 2;
                context.strokeRect(x, y, width, height);
                this.faceBox = { startX: x, startY: y, endX: x + width, endY: y + height };
            } else {
                this.faceBox = null;
            }
        },
        tomarFoto() {
            if (!this.faceBox) {
                alert('No se detectó ninguna cara. Por favor, asegúrate de que tu rostro esté visible en la cámara.');
                return;
            }

            const video = this.$refs.video;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Recortar la imagen al área del rostro
            const faceCanvas = document.createElement('canvas');
            const { startX, startY, endX, endY } = this.faceBox;
            const width = endX - startX;
            const height = endY - startY;
            faceCanvas.width = width;
            faceCanvas.height = height;
            const faceContext = faceCanvas.getContext('2d');
            faceContext.drawImage(
                canvas,
                startX, startY, width, height,
                0, 0, width, height
            );

            // Obtener la imagen como Blob
            faceCanvas.toBlob((blob) => {
                if (!blob) {
                    console.error('No se pudo obtener el blob de la imagen.');
                    return;
                }
                this.fotoBlob = blob;
                this.fotoPreview = URL.createObjectURL(blob);
                this.fotoCapturada = true;
                // Cerrar la cámara después de tomar la foto
                this.cerrarCamara();
            }, 'image/jpeg', 0.9);
        },
        retomarFoto() {
            // Resetear variables y reabrir la cámara
            this.fotoBlob = null;
            this.fotoPreview = '';
            this.fotoCapturada = false;
            this.faceBox = null;
            this.abrirCamara();
        },
        async guardarEstudiante() {
            if (this.metodoCarga === 'archivo' && !this.estudiante.foto) {
                alert('Por favor, sube una foto antes de guardar.');
                return;
            }

            if (this.metodoCarga === 'camara' && !this.fotoBlob) {
                alert('Por favor, toma una foto antes de guardar.');
                return;
            }

            try {
                let formData = new FormData();
                formData.append('nombre', this.estudiante.nombre);
                formData.append('registro', this.estudiante.registro);

                let imageFile = null;

                if (this.metodoCarga === 'archivo') {
                    imageFile = this.estudiante.foto;
                } else if (this.metodoCarga === 'camara') {
                    imageFile = this.fotoBlob;
                }

                if (imageFile) {
                    formData.append('file', imageFile, 'face.jpg');
                }

                // Realizar la solicitud POST con Axios
                const response = await axios.post('http://34.39.149.130:8000/estudiantes/upload_photo_s3', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Manejar la respuesta exitosa
                const respuesta = response.data;
                const url_foto = respuesta.image_url;
                const face_id = respuesta.face_records[0]?.Face?.FaceId || '';

                // Asignar los datos al estudiante
                this.estudiante.fotoUrl = url_foto;
                // faceId eliminado si no se usa
                this.estudiante.faceId = face_id;

                // Guardar el estudiante en Firebase bajo la materia correspondiente
                const newRef = await push(firebaseRef(db, `materias/${this.id}/estudiantes`), this.estudiante);
                const estudianteId = newRef.key; // Obtener el ID del estudiante

                console.log(url_foto, face_id);
                console.log("Respuesta del servidor:", response.data);
                alert("Estudiante registrado exitosamente.");

                // Limpiar el formulario
                this.resetForm();
            } catch (error) {
                // Manejar errores
                console.error("Error al registrar el estudiante:", error);
                alert("Hubo un error al registrar el estudiante. Por favor, intenta de nuevo.");
            }
        },
        resetForm() {
            this.estudiante.nombre = '';
            this.estudiante.registro = '';
            this.estudiante.foto = '';
            this.estudiante.fotoUrl = '';
            // this.estudiante.faceId = ''; // Eliminado si no se usa
            this.fotoBlob = null;
            this.fotoPreview = '';
            this.fotoCapturada = false;
            this.faceBox = null;
            this.metodoCarga = 'archivo';
            // Reiniciar el input de archivo
            if (this.$refs.fotoInput) {
                this.$refs.fotoInput.value = '';
            }
        },
    },
    beforeUnmount() {
        this.cerrarCamara();
    },
};
</script>

<style scoped>
/* Estilos para mejorar la apariencia */
.face-capture {
    width: 100%;
}

.video-container {
    position: relative;
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
}

video {
    width: 100%;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

canvas {
    /* Para el overlay */
    position: absolute;
    top: 0;
    left: 0;
}

.photo-preview img {
    width: 100%;
    max-width: 640px;
    border-radius: 0.5rem;
}

.camera-selection {
    margin-top: 10px;
}

/* Mejora de los estilos del formulario */
form {
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 0.5rem;
}

input[type="text"],
input[type="file"],
select {
    margin-bottom: 1rem;
}

/* Mejora de los botones */
button {
    transition: background-color 0.3s ease;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
