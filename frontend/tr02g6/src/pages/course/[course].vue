<template>
  <v-container>
    <h1>Gestió de {{ formattedCourse }}</h1>
    <v-row>
      <v-col cols="12" md="6" v-for="classe in classes" :key="classe.id_classe">
        <v-card class="mb-4">
          <v-card-title>{{ classe.classe }}</v-card-title>
          <v-card-subtitle>ID: {{ classe.codi_random }}</v-card-subtitle>
          <v-card-actions>
            <v-btn @click="details(user)">INFOc:</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <br><br>
    <v-btn color="primary" @click="details">Afegir Classe</v-btn>
    <v-btn @click="navegarapantalla">Formulario</v-btn>

  </v-container>
  <v-dialog v-model="dialog" max-width="600">
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

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { callFetchClasses, callAddClass } from '@/services/communicationManager';
import { useSessionStore } from "@/stores/sessionStore";

const dialog = ref(false);
const route = useRoute();
const router = useRouter();
const formattedCourse = ref(route.params.course);
let reformattedCourse = '0';
const nomNouClasse = ref('');
const courseValue = formattedCourse.value.toUpperCase();

const match = courseValue.match(/\d+/);

if (match) {
  reformattedCourse = match[0];
} else if (courseValue === 'PFI') {
  reformattedCourse = '5';
} else {
  reformattedCourse = '0';
}

const classes = ref([]);

const fetchClasses = async () => {
  const sessionStore = useSessionStore();
  const sessionId = sessionStore.sessionId;

  if (!sessionId) {
    console.error("No session ID available.");
    return;
  }

  try {
    console.log("Fetching classes for course:", formattedCourse.value);
    const data = await callFetchClasses(formattedCourse.value, sessionId);
    classes.value = data;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error.message);
  }
};


const details = async () => {
  dialog.value = true;
}

const hideDetails = async () => {
  if (!nomNouClasse.value.trim()) {
        console.error("El nom de la classe és obligatori.");
        return;
    }
    const classeData = {
      classe: nomNouClasse.value,
      codi_random: generateRandomCode(),
      id_curs: reformattedCourse,
    };
    console.log("Enviando datos al backend:", classeData);


    try {
      await callAddClass(classeData);
         nomNouClasse.value = ''; 
         dialog.value = false;
         fetchClasses();

        } catch (error) {
      console.error(error.message);
    }
  };

const generateRandomCode = () => {
  return Math.random().toString(36).substring(2, 12);
};
const navegarapantalla = () =>{
  router.push('/formPage')
}
onMounted(fetchClasses);
</script>