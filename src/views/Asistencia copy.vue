<template>
  <div class="row">
    <div class="col-5">
      <div class="section p-5">
        <div class="card">
          <div class="card-header">
            Agregar sitio web
          </div>
          <div class="card-body">
            <form @submit.prevent="addWebsite">
              <div class="mb-3">
                <input type="text" class="form-control" v-model="website.nombre" placeholder="nombre">
              </div>
              <div class="mb-3">
                <input type="text" class="form-control" v-model="website.author" placeholder="author">
              </div>
              <div class="mb-3">
                <input type="text" class="form-control" v-model="website.url" placeholder="url">
              </div>
              <button type="button" class="btn btn-secondary mx-2" @click="clearForm">Limpiar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="col-7">
      <div class="section p-5">
        <div class="card">
          <div class="card-header">
            Listado sitios web
          </div>
          <div class="card-body">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Author</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(w, wId) in websites" :key="wId">
                  <th scope="row">
                    <a v-bind:href="w.url" target="_blank">{{ w.nombre }}</a>
                  </th>
                  <td>{{ w.author }}</td>
                  <td>
                    <button class="btn btn-info mx-2" @click="showWebsite(wId)">Ver</button>
                    <button class="btn btn-warning mx-2" @click="editWebsite(wId, w)">Editar</button>
                    <button class="btn btn-danger" @click="deleteWebsite(wId)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
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
      websites: {},
      website: {
        nombre: '',
        author: '',
        url: ''
      }
    }
  },
  methods: {
    showWebsite(wId) {
      console.log("ver", wId);
    },
    addWebsite() {
      push(ref(db, 'websites'), this.website);
      this.clearForm();
    },
    editWebsite(wId, w) {
      this.editingWebsiteId = wId;
      this.website = { ...w };
    },
    deleteWebsite(wId) {
      console.log('Eliminando', wId);
      remove(ref(db, `websites/${wId}`));
    },
    clearForm() {
      this.website = {
        nombre: '',
        author: '',
        url: ''
      };
    }
  },
  created() {
    onValue(ref(db, 'websites'), (snapshot) => {
      this.websites = snapshot.val();
    });
  }
}
</script>

<style></style>
