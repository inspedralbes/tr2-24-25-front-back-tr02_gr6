<template>
    <v-container class="py-5">
        <v-card>
            <v-card-title>CESC</v-card-title>
            <v-card-text>
                <v-form ref="classroomForm" v-model="valid" lazy-validation>
                    <v-select
                        v-model="curs"
                        :items="cursos"
                        label="Selecciona el curs"
                        required
                    ></v-select>

                    <v-text-field v-model="classeData.classe" label="Nom de la classe" required></v-text-field>

                    <v-file-input label="Imagen de la clase (opcional)" accept="image/*"></v-file-input>

                    <v-row class="mt-5" justify="end">
                        <v-btn color="error" class="mr-3" @click="cancel">
                            Cancelar
                        </v-btn>
                        <v-btn color="primary" :disabled="!valid" @click="createClassroom">
                            Crear
                        </v-btn>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, reactive, computed, onBeforeMount } from "vue";
import { useUserStore } from "@/stores/userStore";
import { callAddClass,redirect } from "@/services/communicationManager";

const userStore = useUserStore();
const valid = ref(false);
const router = useRouter();
const curs = ref(""); 
const classeData = reactive({
    classe: "",
    codi_random: generateRandomCode(),
});

const cursos = ["1º ESO", "2º ESO", "3º ESO", "4º ESO", "PFI"];

const id_curs = computed(() => {
    if (curs.value === "1º ESO") return 1;
    if (curs.value === "2º ESO") return 2;
    if (curs.value === "3º ESO") return 3;
    if (curs.value === "4º ESO") return 4;
    if (curs.value === "PFI") return 5;
    return null;
});

function generateRandomCode() {
    return Math.random().toString(36).substring(2, 12);
}

async function createClassroom() {
    try {
        const email = userStore.email;
        const dataToSend = {
            id_curs: id_curs.value,
            classe: classeData.classe,
            codi_random: classeData.codi_random,
        };

        console.log("Formulario enviado:", dataToSend);
        alert("Classroom creado con éxito.");
        await callAddClass(email,dataToSend)
        console.log('call add class', email,dataToSend);
        router.push("/classProf");
    } catch (error) {
        console.error("ERROR", error);
    }
}

function cancel() {
    curs.value = "";
    classeData.classe = "";
    alert("Acción cancelada.");
}
onBeforeMount(redirect())
</script>

<style scoped>
.v-btn {
    min-width: 100px;
}
</style>
