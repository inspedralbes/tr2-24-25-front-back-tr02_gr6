<template>
  <v-app>
    <v-container>
      <v-row class="header-row">
        <v-col cols="12" class="d-flex align-center justify-space-between">
          <h1 class="header-title">BENVINGUT/DA {{ userStore.email }} a {{ classe }}!</h1>
        </v-col>
      </v-row>

      <v-tabs v-model="activeTab" align="center">
        <v-tab class="tabtab" @click="navigateToAlum()">Alumnes Registrats</v-tab>
        <v-tab class="tabtab">Resultats</v-tab>
      </v-tabs>

      <v-row>
        <v-col cols="12">
          <h2 class="results-title">RESULTATS:</h2>
        </v-col>
      </v-row>

      <v-row>
        <v-btn  @click="spawnToGraphs">
          OBTENIR RESULTATS
        </v-btn>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { getClasse } from '@/services/communicationManager';
const URL = import.meta.env.VITE_API_MAIN;
const router = useRouter();
const userStore = useUserStore();
const email = userStore.email;
const activeTab = ref(1);
const classe = ref("");
const id_classe = ref("");

async function getidClase() {
  const data = await getClasse(email);
  id_classe.value = data[0].id_classe;

}


function navigateToAlum() {
  if (esProfe(email)) {
    router.push("/classProf");
  } else {
    router.push("/classAlum");
  }
}

function esProfe(email) {
  const teNumeros = /\d/;
  return !teNumeros.test(email);
}


const spawnToGraphs = async () => {
  try {
    const response = await fetch(`${URL}/run-calculations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_classe: id_classe.value }), // Pasar el id_classe
    });

    if (!response.ok) {
      throw new Error('Error al ejecutar el cálculo: ' + response.statusText);
    }

    const data = await response.json();
    console.log('Resultado del cálculo:', data);

    router.push('/grafics');
  } catch (error) {
    console.error('Error al ejecutar el cálculo:', error);
  }
};

async function fetchClasse() {
  try {
    const data = await getClasse(email);
    classe.value = data[0].classe;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

onMounted(async () => {
  await getidClase();
  await fetchClasse();
});
</script>

<style scoped>
.header-row {
  background-color: orange;
  color: white;
  padding: 20px 0;
}
.tabtab {
  color: rgb(185, 122, 7);
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.header-title {
  font-weight: bold;
}

.form-button {
  background-color: orange;
  color: white;
  font-size: 1.2em;
  font-weight: bold;
  width: 250px;
  height: 60px;
  border-radius: 30px;
}

.sociograma-svg {
  width: 100%;
  height: 600px;
  border: 1px solid #ddd;
}

@media (max-width: 768px) {
  .sociograma-svg {
    height: 300px;
  }
}

.node {
  cursor: pointer;
}

.link {
  pointer-events: none;
}
</style>
