<template>
    <v-container>
        <v-row>
            <v-col cols="12" class="d-flex align-center">
                <v-btn 
                    icon 
                    class="home-button"
                    @click="inici"
                >
                    <v-icon>mdi-home</v-icon>
                </v-btn>
                <h1>BENVINGUT/DA {{ userStore.email }} a {{ classe }}!</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <h2>ALUMNES REGISTRATS:</h2>
            </v-col>
        </v-row>
        <v-row align="stretch">
            <v-col 
                v-for="alumne in alumnes" 
                :key="alumne.id_alumne" 
                cols="12" sm="6" md="4"
            >
                <v-card>
                    <v-card-title>
                        {{ alumne.nom }}
                    </v-card-title>
                    <v-card-subtitle>
                        {{ alumne.email }}
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="d-flex align-center">
                <v-switch 
                class="fixed-button mb-12 mr-10"
                    v-model="habilitarForm"
                    label="📝"
                ></v-switch>
            </v-col>
        </v-row>
        <v-btn 
            large
            class="form-button fixed-button"
            :disabled="!habilitarForm"
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
import { ro } from 'vuetify/locale';

const router = useRouter();

const userStore = useUserStore();
const alumnes = ref([]);
const email = userStore.email;
const classe = ref("");

const habilitarForm = ref(false); 

async function fetchAlumnes(email) {
    try {
        const data = await getAlumnes(email);
        if(data.includes("No Autenticat")) {
            router.push('/');
        }
        alumnes.value = data;
        console.log(data);
    } catch (error) {
        
        console.error("Error al realitzar la solicitud:", error.message);
        router.push('/');
    }
}

async function fetchClasse(email) {
    try {
        if(data.includes("No Autenticat")) {
            router.push('/');
        }
        const data = await getClasse(email);
        classe.value = data[0].classe;
        console.log(data);
    } catch (error) {
        console.error("Error al realitzar la solicitud:", error.message);
    }
}

const navegarapantalla = () => {
    router.push('/formPage');
}

const inici = () => {
    router.push('/home');
}

onMounted(() => {
    fetchAlumnes(email);
    fetchClasse(email);
});
</script>

<style>
.form-button {
    background-color: orange;
    color: white;
    font-size: 1.2em;
    font-weight: bold;
    width: 250px;
    height: 60px !important;
}

.fixed-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}
</style>
