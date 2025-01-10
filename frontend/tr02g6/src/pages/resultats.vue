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
                        <v-col cols="12">
                            <div class="result-preview">
                                <iframe src="https://www.empresaiformacio.org/sBid/" frameborder="0" class="result-iframe"></iframe>
                            </div>
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
    </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getClasse } from '@/services/communicationManager';
import { useUserStore } from '@/stores/userStore';
const router = useRouter();
const userStore = useUserStore();
const email=userStore.email
const activeTab = ref(1); 
const classe = ref("");

async function fetchClasse(){
    try {
        const data = await getClasse(email);
        classe.value = data[0].classe;
    } catch (error) {
        console.error("Error:", error.message);
    }
}

function navegarapantalla() {
    router.push('/formPage');
}
function navigateToAlum() {
    router.push('/classAlum');
}
    onMounted(fetchClasse)

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
.fixed-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
}
</style>
