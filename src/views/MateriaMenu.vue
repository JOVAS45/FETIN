<template>
  <div class="dashboard">
    <div class="flex space-x-4 justify-center items-center h-screen">      
        
        <ButtonCard label="Estudiantes" :icon="materiasIcon" to="/materias" />
        
        <ButtonCard label="Lista de Asistencia" :icon="registroIcon" to="/event/-O74leLdmJ526Nc-j0Pb" />
       
     
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


</script>
