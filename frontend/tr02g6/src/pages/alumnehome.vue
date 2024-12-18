<template>
    <v-app id="inspire">
      <v-system-bar>
        <v-spacer></v-spacer>  
        <v-icon>mdi-circle</v-icon>
      </v-system-bar>
  
      <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
  
        <v-app-bar-title>Application</v-app-bar-title>
      </v-app-bar>
  
      <v-navigation-drawer v-model="drawer" temporary>
      <v-avatar ma="5" class="mb-4" color="grey-darken-1" size="64"></v-avatar>
      <v-list-item :title="userStore.email" subtitle="Profesor/a"></v-list-item>

          </v-navigation-drawer>
  
      <v-main class="bg-grey-lighten-2">
        <v-container>
          <v-row>
            <template v-for="n in 4" :key="n">
              <v-col
                class="mt-2"
                cols="12"
              >
                <strong>Category {{ n }}</strong>
              </v-col>
  
              <v-col
                v-for="j in 6"
                :key="`${n}${j}`"
                cols="6"
                md="2"
              >
                <v-sheet height="150"></v-sheet>
              </v-col>
            </template>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script setup>
    import { ref } from 'vue'
    import { useUserStore } from '@/stores/userStore';
    const userStore = useUserStore();

    const drawer = ref(null)
  </script>
  
  <script>
    export default {
      data: () => ({ drawer: null }),
    }
  </script>