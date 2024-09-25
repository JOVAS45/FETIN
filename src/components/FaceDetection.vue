<template>
  <div class="text-center">
    <h2 class="text-xl font-bold mb-4">Detección Facial</h2>

    <!-- Fila con select y botón -->
    <div class="flex items-center justify-center space-x-4 mb-4">
      <!-- Selector de cámaras -->
      <div>
        
        <select id="cameraSelect" v-model="selectedCamera" class="bg-white border rounded-lg px-4 py-2"
          :disabled="isCameraOn">
          <option v-for="(device, index) in videoDevices" :key="device.deviceId" :value="device.deviceId">
            {{ device.label || `Cámara ${index + 1}` }}
          </option>
        </select>
      </div>

      <!-- Botón de iniciar/detener -->
      <div>
        <button v-if="!isCameraOn"
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
          @click="startCamera">Iniciar Cámara</button>

        <button v-if="isCameraOn"
          class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
          @click="stopCamera">Detener Cámara</button>
      </div>
    </div>

    <!-- Video donde se muestra la transmisión de la cámara -->
    <div class="mt-4">
      <video id="video" class="w-full h-64 bg-black rounded-lg" autoplay muted></video>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCameraOn: false,           // Control de la cámara
      videoStream: null,           // Almacena el stream de video
      videoDevices: [],            // Lista de dispositivos de video (cámaras)
      selectedCamera: '',          // ID de la cámara seleccionada
    };
  },
  methods: {
    // Método para iniciar la cámara con el dispositivo seleccionado
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
        } catch (err) {
          console.error("Error al acceder a la cámara: ", err);
        }
      } else {
        alert("Selecciona una cámara disponible o tu navegador no soporta la captura de vídeo.");
      }
    },

    // Método para detener la cámara
    stopCamera() {
      const videoElement = document.getElementById('video');
      if (this.videoStream) {
        const tracks = this.videoStream.getTracks();
        tracks.forEach(track => track.stop()); // Detener todas las pistas de video
        videoElement.srcObject = null;
        this.isCameraOn = false;
        this.videoStream = null;
      }
    },

    // Método para obtener las cámaras disponibles
    async getVideoDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.videoDevices = devices.filter(device => device.kind === 'videoinput');
      // Si hay cámaras disponibles, seleccionamos la primera por defecto
      if (this.videoDevices.length > 0) {
        this.selectedCamera = this.videoDevices[0].deviceId;
      }
    }
  },
  mounted() {
    // Obtener las cámaras disponibles cuando el componente se monta
    this.getVideoDevices();
  },
  beforeUnmount() {
    // Detener la cámara automáticamente cuando el componente se destruye
    this.stopCamera();
  }
};
</script>

<style scoped>
/* Estilos personalizados si es necesario */
</style>
