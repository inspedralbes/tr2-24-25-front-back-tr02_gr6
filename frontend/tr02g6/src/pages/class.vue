<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>BENVINGUT {{ userStore.email }}!</h1>
        </v-col>
      </v-row>
      <v-row class="mt-5">
        <v-col cols="12">
          <h2>ALUMNES REGISTRATS:</h2>
        </v-col>
      </v-row>


    </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useUserStore } from '@/stores/userStore';

  export default {
    setup() {
      const userStore = useUserStore();
      return {
        userStore
      };
    },
  };
  </script>
  
  <style>
  /* Puedes añadir estilos personalizados aquí */
  </style>
