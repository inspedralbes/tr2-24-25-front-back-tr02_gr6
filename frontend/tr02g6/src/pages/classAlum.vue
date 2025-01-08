<template>
    <v-container>
        <v-row class="header-row">
            <v-col cols="12" class="d-flex align-center justify-space-between">
                <h1 class="header-title">BENVINGUT/DA {{ userStore.email }} a {{ classe }}!</h1>
            </v-col>
        </v-row>
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

        <v-btn 
            large
            class="form-button fixed-button"
            @click="navegarapantalla"
        >
            FORMULARI
        </v-btn>
    </v-container>
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
const id_classe = ref("");
const codi_random = ref("");
const showCodiRandom = ref(false);

async function fetchAlumnes(email) {
    try {
        const data = await getAlumnes(email);
        alumnes.value = data.map(alumne => ({
            ...alumne,
            formulariCompletat: Math.random() > 0.5, // Simula formulario está completado
        }));
    } catch (error) {
        console.error("Error al realitzar la solicitud:", error.message);
    }
};

async function fetchClasse(email) {
    try {
        const data = await getClasse(email);
        classe.value = data[0].classe;
        id_classe.value = data[0].id_classe;
        codi_random.value = data[0].codi_random;
    } catch (error) {
        console.error("Error al realitzar la solicitud:", error.message);
    }
};

function navegarapantalla(){
    router.push('/formPage');
};

function inici() {
    router.push('/home');
};

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
    color: white;
}

.codi-card {
    background-color: orange;
    color: white;
    text-align: center;
    border-radius: 16px;
    padding: 30px;
}
.codi-title {
    font-size: 2em;
    font-weight: bold;
}
.codi-text {
    font-size: 3em;
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

.form-button {
    background-color: orange;
    color: white;
    font-size: 1.2em;
    font-weight: bold;
    width: 250px;
    height: 60px !important;
    border-radius: 30px;
}
.fixed-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}

.home-button,
.code-button {
    color: rgb(195, 91, 0);
    background-color: orange darken-2;
}
</style>
