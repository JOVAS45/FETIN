// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import Events from "@/views/Events.vue";
import Event from "@/views/Event.vue";
import ControlMonitoreo from "@/views/ControlMonitoreo.vue";
import Reporte from "@/views/Reporte.vue";
import Materias from "@/views/Materias.vue";
import MateriaMenu from "@/views/MateriaMenu.vue";
import MateriaDetalle from "@/views/MateriaDetalle.vue";
import ListaEstudiantes from "@/views/ListaEstudiantes.vue";
import RegistrarEstudiantes from "@/views/RegistrarEstudiantes.vue";
import Reconocimiento from "@/views/Reconocimiento.vue";
import Asistencias from "@/views/Asistencias.vue";
import ListadoFechas from "@/views/ListadoFechas.vue";


const routes = [
  { path: "/", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/login", component: Login },
  { path: "/events", component: Events, meta: { requiresAuth: true } }, 
  { path: "/event/:id", component: Event, meta: { requiresAuth: true } }, 
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/control", component: ControlMonitoreo, meta: { requiresAuth: true } },
  { path: "/control/:id", component: ControlMonitoreo, meta: { requiresAuth: true } },
  { path: "/reporte/:id", component: Reporte, meta: { requiresAuth: true } },
  { path: "/materias", component: Materias, meta: { requiresAuth: true } }, 
  { path: "/materiasMenu/:id", component: MateriaMenu, meta: { requiresAuth: true } },
  { path: "/materia/:id", component: MateriaDetalle, name: 'MateriaDetalle', meta: { requiresAuth: true }, props: true },
  { path: "/materia/:id/estudiantes", component: ListaEstudiantes, name: 'ListaEstudiantes', meta: { requiresAuth: true }, props: true },
  { path: "/materia/:id/registrar-estudiantes", component: RegistrarEstudiantes, name: 'RegistrarEstudiantes', meta: { requiresAuth: true }, props: true },
  { path: "/materia/:id/asistencias", component: Asistencias, name: 'Asistencias', meta: { requiresAuth: true } }, 
  { path: "/materias/:id/reconocimiento", component: Reconocimiento, name: 'Reconocimiento', meta: { requiresAuth: false } }, 
  { path: "/materia/:id/listadoFechas", component: ListadoFechas, name: 'ListadoFechas', meta: { requiresAuth: true } }, 
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("authToken");
  if (to.meta.requiresAuth && !token) {
    next("/login"); // Redirige al login si no está autenticado
  } else {
    next();
  }
});

export default router;
