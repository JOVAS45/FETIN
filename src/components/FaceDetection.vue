<template>
    <div class="face-detection">
      <h1>Detección de Rostros en Tiempo Real</h1>
      <div class="video-container">
        <video ref="video" width="320" height="360" autoplay muted></video>
        <canvas ref="canvas"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'FaceDetection',
    data() {
      return {
        result: '',
        apiEndpoint: 'http://127.0.0.1:5000/detect_faces',
        captureInterval: 300, // Intervalo para capturar imágenes en ms
        intervalId: null, // Guardar el ID del intervalo para detenerlo
        stream: null, // Guardar el stream de la cámara
      };
    },
    mounted() {
      this.startVideo();
      this.startFaceDetection();
    },
    methods: {
      async startVideo() {
        const video = this.$refs.video;
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
          this.stream = stream;
          video.srcObject = stream;
        } catch (err) {
          console.error('Error al acceder a la cámara:', err);
        }
      },
      async sendImageToApi(imageBlob) {
        const formData = new FormData();
        formData.append('image', imageBlob, 'frame.jpg');
  
        try {
          const response = await axios.post(this.apiEndpoint, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          this.drawFaceBoxes(response.data.faces);
        } catch (error) {
          console.error('Error al enviar la imagen a la API:', error);
          this.result = 'Error al detectar rostros.';
        }
      },
      captureFrame() {
        const video = this.$refs.video;
        const canvas = this.$refs.canvas;
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
  
        // Aplicar la transformación para corregir la inversión horizontal
        context.save();
        context.scale(-1, 1); // Invertir horizontalmente
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();
  
        // Convertir el canvas en Blob
        canvas.toBlob((blob) => {
          if (blob) {
            this.sendImageToApi(blob);
          }
        }, 'image/jpeg');
      },
      drawFaceBoxes(faces) {
        const canvas = this.$refs.canvas;
        const context = canvas.getContext('2d');
        if (faces) {
          faces.forEach((face) => {
            const { startX, startY, endX, endY } = face;
            context.strokeStyle = '#00FF00';
            context.lineWidth = 3;
            context.strokeRect(startX, startY, endX - startX, endY - startY);
            context.fillStyle = '#FF0000'; // Color del texto
            context.font = '14px Arial';
            context.fillText(
              `x: ${Math.round(startX)}, y: ${Math.round(startY)}, w: ${Math.round(endX - startX)}, h: ${Math.round(endY - startY)}`,
              startX,
              startY > 10 ? startY - 10 : startY + 10
            );
          });
        }
      },
      startFaceDetection() {
        this.intervalId = setInterval(() => this.captureFrame(), this.captureInterval);
      },
      stopFaceDetection() {
        if (this.intervalId) {
          clearInterval(this.intervalId); // Detener el intervalo
        }
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop()); // Detener la cámara
        }
      }
    },
    beforeDestroy() {
      this.stopFaceDetection(); // Limpiar los recursos cuando se desmonta el componente (Vue 2)
    },
    unmounted() {
      this.stopFaceDetection(); // Limpiar los recursos cuando se desmonta el componente (Vue 3)
    },
  };
  </script>
  
  <style scoped>
  .face-detection {
    font-family: Arial, sans-serif;
  }
  
  .video-container {
    position: relative;
    width: 420px;
    height: 360px;
  }
  
  video {
    width: 100%;
    height: 100%;
  }
  
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Permite clics pasar al video */
  }
  
  #result {
    margin-top: 10px;
    white-space: pre-wrap; /* Mantiene el formato del JSON */
  }
  </style>
  