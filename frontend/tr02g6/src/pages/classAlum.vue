<template>
    <v-app>
        <v-container>
            <v-row class="header-row">
                <v-col cols="12" class="d-flex align-center justify-space-between">
                    <h1 class="header-titol">BENVINGUT/DA {{ userStore.email }} a {{ classe }}!</h1>
                </v-col>
            </v-row>

            <v-tabs v-model="activeTab" align="center">
                <v-tab class="tabtab">Alumnes Registrats</v-tab>
                <v-tab class="tabtab" @click="navigateToResult()">Resultats</v-tab>
            </v-tabs>

            <v-tabs-items v-model="activeTab">

                <v-tab-item>
                    <v-row>
                        <v-col cols="12">
                            <h2 class="alumnes-titol">ALUMNES REGISTRATS:</h2>
                        </v-col>
                    </v-row>
                    <v-row align="stretch">
                        <v-col 
                            v-for="alumne in alumnes" 
                            :key="alumne.id_alumne" 
                            cols="12" sm="6" md="4"
                        >
                            <v-card class="alumne-card" outlined>
                                <v-btn icon class="delete-button" @click="deleteUser" >
                                    <v-icon></v-icon>
                                </v-btn>
                                <v-card-title>
                                    <v-avatar class="me-3" color="orange darken-2" size="40">
                                        {{ alumne.nom.charAt(0).toUpperCase() }}
                                    </v-avatar>
                                    <div>
                                        <h3 class="mb-1">{{ alumne.nom }}</h3>
                                        <p>{{ alumne.email }}</p>
                                    </div>
                                </v-card-title>
                                <v-card-subtitle>
                                    <v-chip 
                                        :color="alumne.formulari_fet >0 ? 'green darken-5' : 'red darken-1'"
                                        dark
                                    >
                                        {{ alumne.formulari_fet >0 ? 'Formulari Completat' : 'Formulari Pendent' }}
                                    </v-chip>
                                </v-card-subtitle>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-tab-item>

            </v-tabs-items>

            <v-btn 
    large
    class="form-button fixed-button"
    @click="navegarapantalla"
    :disabled="resposta"
>
    FORMULARI
</v-btn>
        </v-container>
    </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { getAlumnes, getClasse, getFormulariRespost } from '@/services/communicationManager';
import { useRouter } from 'vue-router';
import { io } from 'socket.io-client';

const router = useRouter();
const formulariRespost = ref();
const userStore = useUserStore();

const alumnes = ref([]);
const email = userStore.email;
const codiRandom = ref("");
const socket = io(import.meta.env.VITE_API_ROUTE_SOCKET);
const resposta = ref(false);
const classe = ref("");
const activeTab = ref(0); 
async function fetchAlumnes(email) {
    try {
        const data = await getAlumnes(email);
        alumnes.value = data
        console.log(data)
    }catch (error) {
        console.error("Error al obtener alumnos:", error.message);
    }
}


async function fetchClasse(email) {
    try {
        const data = await getClasse(email);
        classe.value = data[0].classe;
        codiRandom.value = data[0].codi_random;
        console.log(data);
    } catch (error) {
        console.error("Error al obtener la clase:", error.message);
    }
}

async function deleteUser(email) {
    try {
        const data = await deleteUser(email);
        console.log(data);
    } catch (error) {
        console.error("Error al eliminar el alumno:", error.message);
    }
}

async function comprovarFormulari(email) {
    try {
        const data = await getFormulariRespost(email);
        formulariRespost.value = data.resposta; // Guarda el valor de resposta en formulariRespost
        resposta.value = data.resposta;
        console.log(data);
    } catch (error) {
        console.error("Error al realitzar la solicitud:", error.message);
    }
}

const navegarapantalla = () => {
    if (!formulariRespost.value) { // Comprueba si formulariRespost es false
        router.push('/formPage');
    }
};

const navigateToResult = () => {
    router.push('/resultats');
};

socket.on('actualitzarAlumnes', () => {
    fetchAlumnes(email);
});

onMounted(() => {
    fetchAlumnes(email);
    fetchClasse(email);
    comprovarFormulari(email).then(() => console.log("Valor:" + formulariRespost.value));
});
</script>

<style>
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

.header-titol {
    font-weight: bold;
}
.alumnes-titol, .results-title {
    color: orange;
    font-weight: bold;
}
.alumne-card {
    transition: all 0.3s;
    padding: 0.5em;
    background-color: #fff8e1;
    border-color: orange;
}
.alumne-card:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
.result-preview {
    text-align: center;
    margin-top: 20px;
}
.iframe {
    width: 100%;
    height: 500px;
    border: 1px solid orange;
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
.fixed-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
}

.grey--text {
    color: white;
    background-color: grey;
}

.tarjeta-verda {
    background-color: green;
    color: white;
}

.tarjeta-vermella {
    background-color: red;
    color: white;
}

.grey--text {
    color: white;
    background-color: grey;
}

.tarjeta-verda {
    background-color: green;
    color: white;
}

.tarjeta-vermella {
    background-color: red;
    color: white;
}
</style>