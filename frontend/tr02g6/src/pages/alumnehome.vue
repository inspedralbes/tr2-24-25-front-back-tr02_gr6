<template>
    <v-app id="inspire">
      <v-system-bar>
        <v-spacer></v-spacer>  
        <v-icon>mdi-circle</v-icon>
      </v-system-bar>
  
      <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
  
        <v-app-bar-title>CESC</v-app-bar-title>
      </v-app-bar>
  
      <v-navigation-drawer v-model="drawer" temporary>
      <v-avatar ma="5" class="mb-4" color="grey-darken-1" size="64"></v-avatar>
      <v-list-item :title="userStore.email" subtitle="user.role"></v-list-item>
      <v-list-item :title="userStore.email" subtitle="Profesor/a"></v-list-item>

          </v-navigation-drawer>
  
      <v-main class="bg-grey-lighten-2">
        <v-container>
          <v-row>
            <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card prepend-icon="mdi-account" title="Crear classe">
      <v-card-text>
        <v-row dense>
          <v-col>
            <v-text-field label="Nom de la classe (obligatori)" v-model="nomNouClasse" required></v-text-field>
            <v-btn text="Tancar" variant="plain" @click="dialog = false"></v-btn>

            <v-btn color="primary" text="Crear" variant="tonal" @click="hideDetails"></v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script setup>
    import { ref } from 'vue'
    import { useUserStore } from '@/stores/userStore';
    import { callfetchRole } from '@/services/communicationManager';

    const userStore = useUserStore();
    const dialog = ref(true);
    const user = userStore.email
    var role = ref("")
    if (esProfe(user)){
      role = "Professor/a"
    } else {
      role = "Alumne"
    }
    const fetchRole = async ()=> {
      const sessionStore = useSessionStore();
      const sessionId = sessionStore.sessionId;
      if (!sessionId) {
    console.error("No session ID available.");
    return;
  }

  try {
    const data = await callFetchRole(sessionId);
    classes.value = data;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error.message);
  }
};

function esProfe(email) {
    const teNumeros = /\d/;
    return !teNumeros.test(email);
}

    const drawer = ref(null)
  </script>