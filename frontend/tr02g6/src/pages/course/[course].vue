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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { callFetchClasses, callAddClass } from '@/services/communicationManager';
import { useSessionStore } from "@/stores/sessionStore";

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


const addClass = async () => {
  const nomNouClasse = prompt('INTRODUEIX EL NOM DE LA NOVA CLASSE:');
  if (nomNouClasse) {
    const classeData = {
      classe: nomNouClasse,
      codi_random: generateRandomCode(),
      id_curs: reformattedCourse,
    };

      try {
        const response = await fetch(`http://localhost:3001/classes/${formattedCourse.value}`,{
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(classeData),
        });

        if (response.ok) {
          const preguntaAgregada = await response.json();
          this.preguntes.push(preguntaAgregada); // Agregar a la lista
          this.limpiarFormulario();
        } else {
          console.error('Error al afegir');
        }
      } catch (error) {
        console.error(error);
      }
    }



  onMounted(fetchClasses)

  const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 11)
}

const addClass = () => {
  const newClass = prompt('Introduce el nombre de la nueva clase:')
  if (newClass) {
    const newId = generateRandomId() 
    classes.value.push({ id_classe: newId, classe: newClass }) 
  }
}

</script>
