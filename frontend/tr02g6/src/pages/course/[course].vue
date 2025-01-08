<template>
  <v-main>
  <v-container>
    <h1 class="mb-5 mt-3">Gestió de {{ formattedCourse }}</h1>
    <v-row>
      <v-col cols="12" md="6" v-for="classe in classes" :key="classe.id_classe">
        <v-card class="mb-4" @click="goToClass" disabled="true">
          <v-card-title>{{ classe.classe }}</v-card-title>
          <v-card-subtitle>TUTOR: {{classe.id_classe}}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
    <br><br>

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
</v-main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { callFetchClasses, callAddClass, getTutor } from '@/services/communicationManager';
import { useSessionStore } from "@/stores/sessionStore";
import { useUserStore } from '@/stores/userStore';
import { id } from 'vuetify/locale';

const dialog = ref(false);
const route = useRoute();
const router = useRouter();
const formattedCourse = ref(route.params.course);
let reformattedCourse = '0';
const nomNouClasse = ref('');
const courseValue = formattedCourse.value.toUpperCase();
const emailStore = useUserStore();
const email = emailStore.email;
const tutor = emailStore.email;
const id_classe = ref("");
function esProfe() {
    const teNumeros = /\d/;
    return !teNumeros.test(email);
}

const match = courseValue.match(/\d+/);

if (match) {
  reformattedCourse = match[0];
} else if (courseValue === 'PFI') {
  reformattedCourse = '5';
} else {
  reformattedCourse = '0';
}

const classes = ref([]);

async function fetchTutor() {
  const data = await getTutor(id_classe);
  if(data.includes("No Autenticat")) {
            router.push('/');
        }

  tutor.value = data;
}


const fetchClasses = async () => {
  const sessionStore = useSessionStore();
  const sessionId = sessionStore.sessionId;

  if (sessionId.length === 0) {
    console.error("No session ID available.");
    return;
  }
  try {
    console.log("Fetching classes for course:", formattedCourse.value);
    const data = await callFetchClasses(formattedCourse.value, sessionId);
    if(data.includes("No Autenticat")) {
            router.push('/');
        }
    classes.value = data;
    id_classe.value = data.id_classe;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error.message);
  }
};


const details= async () => {
  dialog.value = true;
}

const goToClass = async () => {
  if (esProfe(email)) {
    router.push(`/classProf`);
}
else {
  router.push(`/classAlum`);
}
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

onMounted(fetchClasses,fetchTutor);
</script>