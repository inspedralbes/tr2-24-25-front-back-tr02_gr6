<template>
    <v-app>
        <v-main class="fill-height d-flex align-center justify-center kahoot-background">
            <v-sheet class="pa-6" width="400" elevation="5">
                <v-form @submit.prevent>
                    <v-text-field v-model="codi_classe" required label="Codi de la classe"></v-text-field>
                    <v-btn @click="putClass" class="mt-2" type="submit" block color="black">Ingressar</v-btn>
                </v-form>
            </v-sheet>
        </v-main>
        <footer class="footer">
            <div class="footer-content">
                Per més informació sobre cesc <a href="https://bullying.cat/cesc/?lang=es"
                    target="_blank">bullying.cat</a>
                <span>|</span>
                <a href="#">Términs</a>
                <span>|</span>
                <a href="#">Privacitat</a>
                <span>|</span>
                <a href="#">Avís sobre cookies</a>
            </div>
        </footer>
    </v-app>
</template>

<script setup>
import { callPutClass } from '@/services/communicationManager';
import { useUserStore } from '@/stores/userStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter() 
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
         if(obj.error) {
            console.error("El codi no existeix")
            alert("El codi no existeix")
        } else if (obj.message) {
            console.log("Acción exitosa:", obj.message);
            router.push("/classAlum")
        }
    } catch (error) {
        console.error("Error al meterse en la clase", error);
    }
}
</script>

<style>
.kahoot-background {
    background: linear-gradient(135deg, #6a1b9a, #8e24aa);
    color: white;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.footer {
    background-color: #6a1b9a;
    color: white;
    text-align: center;
    padding: 10px 0;
    position: fixed;
    bottom: 0;
    width: 100%;
    font-size: 14px;
}

.footer-content a {
    color: #ffd700;
    text-decoration: none;
    margin: 0 5px;
}

.footer-content span {
    margin: 0 5px;
}
</style>
