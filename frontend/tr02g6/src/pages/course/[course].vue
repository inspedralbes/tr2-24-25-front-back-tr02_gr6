<template>
  <v-container>
    <h1>Gestió de {{ formattedCourse }}</h1>
    <v-row>
      <v-col cols="12" md="6" v-for="classe in classes" :key="classe.id_classe">
        <v-card class="mb-4">
          <v-card-title>{{ classe.classe }}</v-card-title>
          <v-card-subtitle>ID: {{ classe.codi_random }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
    <br><br>
    <v-btn color="primary" @click="addClass">Afegir Classe</v-btn>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
const URL = import.meta.env.VITE_API_ROUTE_CLASS;
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const formattedCourse = ref(route.params.course);
let reformattedCourse = '0';

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
  const authStore = useAuthStore();
  try {
    console.log("Fetching classes for course:", formattedCourse.value);
    const response = await fetch(
      `${URL}/classes/${formattedCourse.value}?sessionId=${authStore.sessionId}`
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener datos de clases: ${errorText}`);
    }
    classes.value = await response.json();
  } catch (error) {
    console.error("Error al realizar la solicitud:", error.message);
  }
};


const afegirClasse = async (nomNouClasse) => {
  try {
    const classeData = {
      classe: nomNouClasse,
      codi_random: generateRandomCode(),
      id_curs: reformattedCourse
    };

    const response = await fetch(`${URL}/classes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classeData),
    });

    if (!response.ok) throw new Error("Error al afegir la classe");

    const addedClass = await response.json();
    classes.value.push(addedClass);
    fetchClasses()
  } catch (error) {
    console.error("Error al agregar clase:", error);
  }
};

const generateRandomCode = () => {
  return Math.random().toString(36).substring(2, 12);
};

const addClass = () => {
  const nomNouClasse = prompt("INTRODUEIX EL NOM DE LA NOVA CLASSE:");
  if (nomNouClasse) {
    afegirClasse(nomNouClasse);
  }
};

onMounted(fetchClasses);
</script>
