<template>
  <v-container>
    <v-btn 
         icon 
         class="home-button"
        @click="inici"
      >
           <v-icon>mdi-arrow-left</v-icon>
           </v-btn>

    <h1 class="mb-5 mt-3 gestio-title">Gestió de {{ formattedCourse }}</h1>

    <v-row>
      <v-col cols="12" md="6" v-for="classe in classes" :key="classe.id_classe">
        <v-card
          class="classe-card"
          :outlined="!isTutor(classe)"
          :class="{ 'disabled-card': !isTutor(classe) }"
        >
          <v-card-title class="card-title">{{ classe.classe }}</v-card-title>
          <v-card-subtitle class="card-subtitle">
            <span>TUTOR: {{ classe.tutor_email }}</span>
          </v-card-subtitle>
          <v-card-actions>
            <v-btn
              color="primary"
              :disabled="!isTutor(classe)"
              @click="isTutor(classe) ? goToClasseProf(classe.id_classe) : null"
            >
              Accedir a classe
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn class="add-class-btn" disabled>Afegir Classe</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { callFetchClasses } from "@/services/communicationManager";
import { useSessionStore } from "@/stores/sessionStore";
import { useUserStore } from "@/stores/userStore";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const formattedCourse = ref(route.params.course);
let reformattedCourse = "0";

const courseValue = formattedCourse.value.toUpperCase();
const match = courseValue.match(/\d+/);
const id_classe=ref("");
if (match) {
  reformattedCourse = match[0];
} else if (courseValue === "PFI") {
  reformattedCourse = "5";
} else {
  reformattedCourse = "0";
}

const classes = ref([]);

async function fetchClasses() {
  const sessionStore = useSessionStore();
  const sessionId = sessionStore.sessionId;

  if (!sessionId) {
    console.error("No session ID available.");
    return;
  }

  try {
    const data = await callFetchClasses(formattedCourse.value, sessionId);
    classes.value = data;
    id_classe.value=data.id_classe
  } catch (error) {
    console.error("Error", error.message);
  }
};

function inici(){
    router.push('/home');
};
function isTutor(classes){
  return classes.tutor_email=== userStore.email;
};

function goToClasseProf (){
  router.push(`/classProf`);
};

onMounted(fetchClasses);
</script>

<style scoped>
.gestio-title {
  font-size: 2.5em;
  color: #ff5722;
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.classe-card {
    transition: all 0.3s;
    padding: 0.5em;
    background-color: #fff8e1;
    border-color: orange;
}

.classe-card:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}



.disabled-card {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
  transform: none !important;
}

.add-class-btn {
  background-color: #ff5722;
  color: rgb(244, 166, 23);
  font-weight: bold;
  border-radius: 25px;
  font-size: 1.2em;
  padding: 10px 20px;
}
.add-class-btn:disabled {
  background-color: #ffa891;
  color: white;
}
.home-button {
    color: rgb(195, 91, 0);
    background-color: orange darken-2;
}

</style>
