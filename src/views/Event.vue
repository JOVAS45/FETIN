<template>
    <div class="row">
        <div class="section p-10">
            <div class="container mx-auto">
                <!-- Layout principal -->
                <div class="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-10">
                    <!-- Formulario a la izquierda -->
                    
                    <!-- Lista a la derecha -->
                    <div class="w-full md:w-12/12 bg-white p-6 rounded-lg shadow-md">
                        <h2 class="text-2xl font-semibold text-gray-700 mb-6">Listas de Asistencia</h2>
                         <button 
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-300"
                    
                >
                    Crear Lista
                </button>
                        <ul >                           
                            <div class="w-full max-w-7xl px-4 md:px-5 lg-12 mx-auto">
                                <li v-for="(w, index) in event.paricipantes" :key="index">
                                    <div class="rounded-3xl border-2 border-gray-200 p-4 lg:p-8 grid grid-cols-12 mb-6 max-lg:max-w-lg max-lg:mx-auto gap-y-4 ">
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
                                            </div>                                            
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
import { db } from '@/config/firebase.js';
import { ref, onValue, push, remove } from 'firebase/database';

export default {
    name: 'App',
    data() {
        return {
            editingWebsiteId: null,
            showingWebsiteId: null,
            event: {
                nombre: '',
                paricipantes: []
            }
        }
    },
    methods: {
        showWebsite(wId) {
            console.log("ver", wId);
        },
        addWebsite() {
            push(ref(db, 'websites'), this.event);
            this.clearForm();
        },
        editWebsite(wId, w) {
            this.editingWebsiteId = wId;
            
        },
        deleteWebsite(wId) {
            console.log('Eliminando', wId);
            remove(ref(db, `websites/${wId}`));
        },
        clearForm() {
            this.event = {
                nombre: '',
                paricipantes: []
               
            };
        }
    },
    created() {
        // Obtener el ID del evento desde $route.params
        var id = this.$route.params.id;
        onValue(ref(db, 'events/' + id), (snapshot) => {
            this.event = snapshot.val();
        });
        onValue(ref(db, 'events/'+id+'/participantes'), (snapshot) => {
            console.log(snapshot.val())
            this.event.paricipantes = snapshot.val();
        });
        
    }
}
</script>
