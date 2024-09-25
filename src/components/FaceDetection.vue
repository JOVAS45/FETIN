<template>
  <div class="text-center">
    <h2 class="text-xl font-bold mb-4">Detección Facial</h2>

    <div class="flex items-center justify-center space-x-4 mb-4">
      <div>
        <select id="cameraSelect" v-model="selectedCamera" class="bg-white border rounded-lg px-4 py-2" :disabled="isCameraOn">
          <option v-for="(device, index) in videoDevices" :key="device.deviceId" :value="device.deviceId">
            {{ device.label || `Cámara ${index + 1}` }}
          </option>
        </select>
      </div>

      <div>
        <button v-if="!isCameraOn" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300" @click="startCamera">Iniciar Cámara</button>
        <button v-if="isCameraOn" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300" @click="stopCamera">Detener Cámara</button>
      </div>
    </div>

    <div class="mt-4">
      <video id="video" class="w-full h-64 bg-black rounded-lg" autoplay muted></video>
      <canvas id="canvas" class="w-full h-64 rounded-lg" style="display: none;"></canvas>
    </div>
  </div>
</template>

<script>
import * as faceapi from 'face-api.js';

export default {
  data() {
    return {
      isCameraOn: false,
      videoStream: null,
      videoDevices: [],
      selectedCamera: '',
    };
  },
  methods: {
    async loadFaceApiModels() {
      const MODEL_URL = process.env.VUE_APP_FACE_API_MODEL_URL || 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights'; 
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    },

    async startCamera() {
      const videoElement = document.getElementById('video');

      if (this.selectedCamera && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: this.selectedCamera }
          });
          this.videoStream = stream;
          videoElement.srcObject = stream;
          videoElement.play();
          this.isCameraOn = true;

          this.detectFaces();
        } catch (err) {
          console.error("Error al acceder a la cámara: ", err);
        }
      } else {
        alert("Selecciona una cámara disponible o tu navegador no soporta la captura de vídeo.");
      }
    },

    stopCamera() {
      const videoElement = document.getElementById('video');
      if (this.videoStream) {
        const tracks = this.videoStream.getTracks();
        tracks.forEach(track => track.stop());
        videoElement.srcObject = null;
        this.isCameraOn = false;
        this.videoStream = null;
      }
    },

    async getVideoDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.videoDevices = devices.filter(device => device.kind === 'videoinput');
      if (this.videoDevices.length > 0) {
        this.selectedCamera = this.videoDevices[0].deviceId;
      }
    },

    async detectFaces() {
      const videoElement = document.getElementById('video');
      const canvas = document.getElementById('canvas');
      faceapi.matchDimensions(canvas, { width: videoElement.width, height: videoElement.height });

      const detect = async () => {
        const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        const resizedDetections = faceapi.resizeResults(detections, { width: videoElement.width, height: videoElement.height });
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        requestAnimationFrame(detect);
      };

      detect();
    }
  },
  mounted() {
    this.getVideoDevices();
    this.loadFaceApiModels(); // Cargar modelos de FaceAPI
  },
  beforeUnmount() {
    this.stopCamera();
  }
};
</script>

<style scoped>
/* Estilos personalizados si es necesario */
</style>
