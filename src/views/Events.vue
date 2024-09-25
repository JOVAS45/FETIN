<template>
    <div class="row">
        <div class="section p-10">
            <div class="container mx-auto">
                <!-- Layout principal -->
                <div class="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-10">
                    <!-- Formulario a la izquierda -->
                    <div class="w-full md:w-4/12 bg-white p-6 rounded-lg shadow-md">
                        <h2 class="text-2xl font-semibold text-gray-700 mb-6">Evento</h2>
                        <form @submit.prevent="addWebsite" class="space-y-4">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
                                <input v-model="event.nombre" placeholder="nombre" type="text" id="name"
                                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label for="descripcion"
                                    class="block text-sm font-medium text-gray-700">Descripcion</label>
                                <textarea v-model="event.descripcion" placeholder="descripcion" type="text"
                                    id="descripcion"
                                    class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>
                            <!-- Contenedor de botones en fila -->
                            <div class="flex space-x-4">
                                <button type="button" @click="clearForm"
                                    class="w-full bg-blue-500 text-white p-2 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Limpiar
                                </button>
                                <button type="submit"
                                    class="flex items-center justify-center w-full bg-indigo-500 text-white p-2 rounded-md shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                    <!-- Lista a la derecha -->
                    <div class="w-full md:w-8/12 bg-white p-6 rounded-lg shadow-md">
                        <h2 class="text-2xl font-semibold text-gray-700 mb-6">Lista</h2>
                        <ul>
                            <div class="w-full max-w-7xl px-2 md:px-2 lg-6 mx-auto">
                                <li v-for="(w, wId) in events" :key="wId">
                                    <div
                                        class="rounded-3xl border-2 border-gray-200 p-2 lg:p-4 grid grid-cols-12 mb-6 max-lg:max-w-lg max-lg:mx-auto gap-y-4 ">
                                        <div class="col-span-12 lg:col-span-2 img box">
                                            <img src="https://pagedone.io/asset/uploads/1701162826.png"
                                                alt="speaker image"
                                                class="max-lg:w-full lg:w-[180px] rounded-lg object-cover">
                                        </div>
                                        <div class="col-span-12 lg:col-span-10 detail w-full lg:pl-3">
                                            <div class="flex items-center justify-between w-full mb-2">
                                                <h5 class="font-manrope font-bold text-2xl leading-9 text-gray-900">
                                                    {{ w.nombre }}
                                                </h5>
                                                <div class="flex justify-between items-center">
                                                    <div class="flex items-center gap-2">
                                                        <button @click="control(wId)"
                                                            class="rounded-full group flex items-center justify-center focus-within:outline-red-500">
                                                            monitor
                                                        </button>
                                                        <button @click="reporte(wId)"
                                                            class="rounded-full group flex items-center justify-center focus-within:outline-red-500">
                                                            Reporte
                                                        </button>
                                                        <button @click="showWebsite(wId)"
                                                            class="rounded-full group flex items-center justify-center focus-within:outline-red-500">
                                                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <circle
                                                                    class="fill-red-50 transition-all duration-500 group-hover:fill-red-400"
                                                                    cx="17" cy="17" r="17" fill="" />
                                                                <path
                                                                    class="stroke-red-500 transition-all duration-500 group-hover:stroke-white"
                                                                    d="M14.1673 13.5997V12.5923C14.1673 11.8968 14.7311 11.333 15.4266 11.333H18.5747C19.2702 11.333 19.834 11.8968 19.834 12.5923V13.5997M19.834 13.5997C19.834 13.5997 14.6534 13.5997 11.334 13.5997C6.90804 13.5998 27.0933 13.5998 22.6673 13.5997C21.5608 13.5997 19.834 13.5997 19.834 13.5997ZM12.4673 13.5997H21.534V18.8886C21.534 20.6695 21.534 21.5599 20.9807 22.1131C20.4275 22.6664 19.5371 22.6664 17.7562 22.6664H16.2451C14.4642 22.6664 13.5738 22.6664 13.0206 22.1131C12.4673 21.5599 12.4673 20.6695 12.4673 18.8886V13.5997Z"
                                                                    stroke="#EF4444" stroke-width="1.6"
                                                                    stroke-linecap="round" />
                                                            </svg>
                                                        </button>
                                                        <button @click="editWebsite(wId, w)"
                                                            class="rounded-full group flex items-center justify-center focus-within:outline-red-500">
                                                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <circle
                                                                    class="fill-red-50 transition-all duration-500 group-hover:fill-red-400"
                                                                    cx="17" cy="17" r="17" fill="" />
                                                                <path
                                                                    class="stroke-red-500 transition-all duration-500 group-hover:stroke-white"
                                                                    d="M14.1673 13.5997V12.5923C14.1673 11.8968 14.7311 11.333 15.4266 11.333H18.5747C19.2702 11.333 19.834 11.8968 19.834 12.5923V13.5997M19.834 13.5997C19.834 13.5997 14.6534 13.5997 11.334 13.5997C6.90804 13.5998 27.0933 13.5998 22.6673 13.5997C21.5608 13.5997 19.834 13.5997 19.834 13.5997ZM12.4673 13.5997H21.534V18.8886C21.534 20.6695 21.534 21.5599 20.9807 22.1131C20.4275 22.6664 19.5371 22.6664 17.7562 22.6664H16.2451C14.4642 22.6664 13.5738 22.6664 13.0206 22.1131C12.4673 21.5599 12.4673 20.6695 12.4673 18.8886V13.5997Z"
                                                                    stroke="#EF4444" stroke-width="1.6"
                                                                    stroke-linecap="round" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <p class="font-normal text-base leading-7 text-gray-500">
                                                Introducing our sleek round white portable speaker, the epitome of style
                                                and sound! Elevate your
                                                auditory experience with this compact yet powerful device that delivers
                                                crystal-clear audio wherever
                                                you go. <a href="javascript:;" class="text-indigo-600">More....</a>
                                            </p>

                                        </div>

                                    </div>
                                </li>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { db } from '@/config/firebase.js';
import { ref, onValue, push, remove } from 'firebase/database';

export default {
    name: 'App',
    data() {
        return {
            editingWebsiteId: null,
            showingWebsiteId: null,
            events: {},
            event: {
                nombre: '',
                descripcion: '',
                participantes: []
            },
           
        }
    },
    setup() {
        const router = useRouter(); // Definir el router en setup
        return {
            router // Devolver router para usarlo en los métodos
        };
    },
    methods: {
        control(wId) {
            this.router.push('/control/' + wId);
        },
        reporte(wId) {
            this.router.push('/reporte/' + wId);
        },
        showWebsite(wId) {
            this.router.push('/event/' + wId);
        },
        addWebsite() {
            push(ref(db, 'events'), this.event);
            this.clearForm();
        },
        editWebsite(wId, w) {
            this.editingWebsiteId = wId;
            this.event = { ...w };
        },
        deleteWebsite(wId) {
            remove(ref(db, `events/${wId}`));
        },
        clearForm() {
            this.event = {
                nombre: '',
                descripcion: '',
            };
        },

        
    },
    created() {
        onValue(ref(db, 'events'), (snapshot) => {
            this.events = snapshot.val();
        });
    }
}
</script>
