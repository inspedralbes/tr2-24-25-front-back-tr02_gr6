<template>
    <v-app>
        <v-main class="fill-height d-flex flex-column kahoot-background">
            <div class="d-flex align-center justify-center flex-grow-1">
                <v-sheet class="pa-6" width="400" elevation="5" rounded>
                    <v-form @submit.prevent>
                        <v-text-field
                            v-model="codi_classe"
                            required
                            label="Codi de la classe"
                            outlined
                        ></v-text-field>
                        <v-btn @click="putClass" class="mt-4" type="submit" block color="orange darken-3" dark>
                            Ingressar
                        </v-btn>
                    </v-form>
                </v-sheet>
            </div>
            <footer class="footer">
                <div class="footer-content">
                    Per més informació sobre CESC, visita 
                    <a href="https://bullying.cat/cesc/?lang=es" target="_blank">bullying.cat</a>
                    <span>|</span>
                    <a href="#">Términs</a>
                    <span>|</span>
                    <a href="#">Privacitat</a>
                    <span>|</span>
                    <a href="#">Avís sobre cookies</a>
                </div>
            </footer>
        </v-main>
    </v-app>
</template>

<script setup>
import { callPutClass, redirect } from '@/services/communicationManager';
import { useUserStore } from '@/stores/userStore';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const emailStore = useUserStore();
const email = emailStore.email;
const codi_classe = ref("");

async function putClass() {
    try {
        if (!codi_classe.value) {
            alert("El codi de classe no pot estar buit.");
            return;
        }

        const obj = await callPutClass(email, codi_classe.value);
        if (obj.error) {
            console.error("El codi no existeix");
            alert("El codi no existeix");
        } else if (obj.message) {
            console.log("Acción exitosa:", obj.message);
            router.push("/classAlum");
        }
    } catch (error) {
        console.error("Error al meterse en la clase", error);
    }
}
onMounted(redirect)
</script>

<style>
.kahoot-background {
    background: rgb(255, 197, 88);
    color: white;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.footer {
    background-color: orange;
    color: white;
    text-align: center;
    padding: 10px 0;
    position: fixed;
    bottom: 0;
    width: 100%;
    font-size: 14px;
}

.footer-content a {
    color: #FFD700;
    text-decoration: none;
    margin: 0 5px;
    font-weight: bold;
}

.footer-content span {
    margin: 0 5px;
}

.v-toolbar-title {
    font-size: 20px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
}
</style>
