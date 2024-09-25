<template>
    <div class="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex flex-col items-center justify-center p-4">
      <h1 class="text-4xl font-bold text-white mb-6">¡Diviértete con el Reconocimiento Facial!</h1>
      
      <div class="relative">
        <!-- Video Element -->
        <video ref="video" class="rounded-lg shadow-lg" autoplay muted playsinline width="640" height="480"></video>
        
        <!-- Canvas Overlay -->
        <canvas ref="overlay" class="absolute top-0 left-0"></canvas>
        
        <!-- Efecto Dinámico (e.g., Dinosaurio) -->
        <img v-if="selectedEffect === 'dinosaur'" :src="effects.dinosaur" class="absolute top-0 left-0 w-full h-full pointer-events-none" />
        <img v-if="selectedEffect === 'sunglasses'" :src="effects.sunglasses" class="absolute top-0 left-0 w-full h-full pointer-events-none" />
        <img v-if="selectedEffect === 'hat'" :src="effects.hat" class="absolute top-0 left-0 w-full h-full pointer-events-none" />
      </div>
      
      <!-- Controles de Efectos -->
      <div class="mt-4 flex space-x-4">
        <button 
          @click="changeEffect('none')"
          class="bg-white text-indigo-600 px-4 py-2 rounded-md shadow hover:bg-gray-100 transition duration-300">
          Sin Efecto
        </button>
        <button 
          @click="changeEffect('dinosaur')"
          class="bg-white text-indigo-600 px-4 py-2 rounded-md shadow hover:bg-gray-100 transition duration-300">
          Dinosaurio
        </button>
        <button 
          @click="changeEffect('sunglasses')"
          class="bg-white text-indigo-600 px-4 py-2 rounded-md shadow hover:bg-gray-100 transition duration-300">
          Gafas de Sol
        </button>
        <button 
          @click="changeEffect('hat')"
          class="bg-white text-indigo-600 px-4 py-2 rounded-md shadow hover:bg-gray-100 transition duration-300">
          Sombrero
        </button>
      </div>
      
      <!-- Mensaje de Estado -->
      <p class="text-white mt-4">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import * as faceapi from 'face-api.js';
  
  export default {
    name: 'FaceFun',
    data() {
      return {
        videoStream: null,
        selectedEffect: 'none',
        message: 'Cargando modelos de reconocimiento facial...',
        effects: {
          dinosaur: require('@/assets/dinosaur.png'), // Asegúrate de tener estas imágenes en tu carpeta de assets
          sunglasses: require('@/assets/sunglasses.png'),
          hat: require('@/assets/hat.png'),
        },
      };
    },
    methods: {
      async startVideo() {
        try {
          this.videoStream = await navigator.mediaDevices.getUserMedia({ video: {} });
          this.$refs.video.srcObject = this.videoStream;
          this.$refs.video.onloadedmetadata = () => {
            this.$refs.video.play();
          };
          this.message = 'Video iniciado. Cargando detección de rostros...';
          await this.loadModels();
          this.message = 'Listo para divertirte!';
          this.detectFaces();
        } catch (error) {
          console.error('Error al acceder a la cámara:', error);
          this.message = 'No se pudo acceder a la cámara. Por favor, verifica los permisos.';
        }
      },
      async loadModels() {
        const MODEL_URL = process.env.BASE_URL + 'models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      },
      async detectFaces() {
        const video = this.$refs.video;
        const canvas = this.$refs.overlay;
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);
        
        setInterval(async () => {
          if (this.selectedEffect === 'none') {
            // Si no hay efecto seleccionado, limpiar el canvas
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
          }
          
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
          // Limpiar el canvas
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Dibujar detecciones si deseas (opcional)
          // faceapi.draw.drawDetections(canvas, resizedDetections);
          // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }, 100);
      },
      changeEffect(effect) {
        this.selectedEffect = effect;
        if (effect === 'none') {
          this.message = 'Sin efecto seleccionado.';
        } else {
          this.message = `Efecto "${effect}" aplicado. ¡Disfruta!`;
        }
      },
    },
    mounted() {
      this.startVideo();
    },
    beforeDestroy() {
      if (this.videoStream) {
        this.videoStream.getTracks().forEach(track => track.stop());
      }
    },
  };
  </script>
  
  <style scoped>
  .video-container {
    position: relative;
  }
  
  video {
    border-radius: 1rem;
  }
  
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
  
  img {
    pointer-events: none;
  }
  </style>
  