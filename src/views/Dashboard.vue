<template>
  <div class="dashboard">
    <div class="flex space-x-4 justify-center items-center h-screen">              
        <ButtonCard label="materias" :icon="materiasIcon"  to="/materias" />
        <ButtonCard label="Eventos" :icon="asistenciaIcon" to="/events" />
        <ButtonCard label="Registro" :icon="registroIcon" to="/materias" />
        <ButtonCard label="Salir" :icon="logotIcon" to="/login" />
     
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ButtonCard from '@/components/ButtonCard.vue'
import asistencia from "@/assets/asistencia.jpg"
import logoutIcon from "@/assets/logout.jpg"
import materias from "@/assets/Materia.png"
import registro from "@/assets/Registro.png"
const router = useRouter();
const loading = ref(true);
const asistenciaIcon = asistencia;
const logotIcon = logoutIcon;
const materiasIcon = materias;
const registroIcon = registro;
const logout = () => {
  localStorage.removeItem('authToken');
  router.push('/login');
};

</script>
