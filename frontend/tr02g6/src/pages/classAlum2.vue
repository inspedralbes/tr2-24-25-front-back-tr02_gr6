<template>
    <v-app>
        <v-container>
            <v-row class="header-row">
                <v-col cols="12" class="d-flex align-center justify-space-between">
                    <h1 class="header-title">BENVINGUT/DA {{ userStore.email }} a {{ classe }}!</h1>
                </v-col>
            </v-row>

            <v-tabs v-model="activeTab" align="center">
                <v-tab>Alumnes Registrats</v-tab>
                <v-tab>Resultats</v-tab>
            </v-tabs>

            <v-tabs-items v-model="activeTab">

                <v-tab-item>
                    <v-row>
                        <v-col cols="12">
                            <h2 class="alumnes-title">ALUMNES REGISTRATS:</h2>
                        </v-col>
                    </v-row>
                    <v-row align="stretch">
                        <v-col 
                            v-for="alumne in alumnes" 
                            :key="alumne.id_alumne" 
                            cols="12" sm="6" md="4"
                        >
                            <v-card class="alumne-card" outlined>
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
                                        :color="alumne.formulariCompletat ? 'green darken-5' : 'red darken-1'"
                                        dark
                                    >
                                        {{ alumne.formulariCompletat ? 'Formulari Completat' : 'Formulari Pendent' }}
                                    </v-chip>
                                </v-card-subtitle>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-tab-item>

                <v-tab-item>
                    <v-row>
                        <v-col cols="12">
                            <h2 class="results-title">RESULTATS:</h2>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <div class="result-preview">
                                <iframe src="https://www.empresaiformacio.org/sBid/" frameborder="0" class="result-iframe"></iframe>
                            </div>
                        </v-col>
                    </v-row>
                </v-tab-item>

            </v-tabs-items>

            <v-btn 
                large
                class="form-button fixed-button"
                @click="navegarapantalla"
            >
                FORMULARI
            </v-btn>
        </v-container>
    </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { getAlumnes, getClasse } from '@/services/communicationManager';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const alumnes = ref([]);
const email = userStore.email;
const classe = ref("");
const activeTab = ref(0); 

async function fetchAlumnes(email) {
    try {
        const data = await getAlumnes(email);
        alumnes.value = data.map(alumne => ({
            ...alumne,
            formulariCompletat: Math.random() > 0.5, // Simula estado del formulario
        }));
    } catch (error) {
        console.error("Error al obtener alumnos:", error.message);
    }
}

async function fetchClasse(email) {
    try {
        const data = await getClasse(email);
        classe.value = data[0]?.classe || "";
    } catch (error) {
        console.error("Error al obtener la clase:", error.message);
    }
}

function navegarapantalla() {
    router.push('/formPage');
}

onMounted(async () => {
    await fetchClasse(email);
    await fetchAlumnes(email);
});
</script>

<style>
.header-row {
    background-color: orange;
    color: white;
    padding: 20px 0;
}
.header-title {
    font-weight: bold;
}
.alumnes-title, .results-title {
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
.result-iframe {
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
</style>
