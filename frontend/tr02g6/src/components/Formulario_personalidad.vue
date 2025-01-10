<!-- eslint-disable no-undef -->
<script setup>
import { getAlumnes, postResultats } from '@/services/communicationManager';
import { onMounted, ref, watch } from 'vue'
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';
const router = useRouter();
const errorMessage = ref("");
const correos = ref([])
const alumnos = ref([])
const cae_bien = ref([]);
const cae_no_bien = ref([]);
const difunde_rumores = ref([]);
const ayuda_demás = ref([]);
const da_empujones = ref([]);
const no_deja_participar = ref([]);
const anima_demas = ref([]);
const insulta = ref([]);
const victima_empujones = ref([]);
const victima_insultar = ref([]);
const victima_no_deja_participar = ref([]);
const amigos = ref([]);
const terminosycondiciones = ref(false);
const dialog = ref(false);
const limitSelections = (selectedItems) => {
  if (selectedItems.length > 3) {
    selectedItems.shift();
  }
};
  const sessionStore = useUserStore();
  const email = sessionStore.email
const listaarrays = [
  cae_bien,
  cae_no_bien,
  difunde_rumores,
  ayuda_demás,
  da_empujones,
  no_deja_participar,
  anima_demas,
  insulta,
  victima_empujones,
  victima_insultar,
  victima_no_deja_participar,
  amigos
];
listaarrays.forEach((array) => {
  watch(array, (newVal) => {
    limitSelections(newVal);
  });
});

async function fecthGetAlumnos() {
  try {
    const llista_alumnes = await getAlumnes(email);
    correos.value = llista_alumnes.map(alumne => alumne.email);
    alumnos.value = llista_alumnes.map(alumne => `${alumne.nom} ${alumne.cognoms}`);
    console.log(llista_alumnes);
  }
  catch (error) {
    console.error('Error en obtenir els correus', error);
  }
}

onMounted(() => {
  fecthGetAlumnos();
});

const navegarapantalla = () => {
    router.push('classAlum');
};

async function fetchPostResultats() {
  try {
    const valido = listaarrays.every(listaarrays => listaarrays.value.length === 3);
    if (!valido) {
      errorMessage.value = "Tots els camps han de tenir exactament tres seleccions.";
    }
    else {
      const formulariEnviar = {
        cauBe: cae_bien.value,
        noCauBe: cae_no_bien.value,
        correRumors: difunde_rumores.value,
        ajuda: ayuda_demás.value,
        donaEmpentes: da_empujones.value,
        noDeixaParticipar: no_deja_participar.value,
        anima: anima_demas.value,
        insulta: insulta.value,
        esEmpentat: victima_empujones.value,
        esInsultat: victima_insultar.value,
        esAillat: victima_no_deja_participar.value,
        esAmic: amigos.value,
      }
      console.log(formulariEnviar);
      const resultats = await postResultats(email, formulariEnviar);
      console.log("Formulario enviado con éxito:", resultats);
      cae_bien.value = '';
      cae_no_bien.value = '';
      difunde_rumores.value = '';
      ayuda_demás.value = '';
      da_empujones.value = '';
      no_deja_participar.value = '';
      anima_demas.value = '';
      insulta.value = '';
      victima_empujones.value = '';
      victima_insultar.value = '';
      victima_no_deja_participar.value = '';
      amigos.value = '';
      dialog.value = true;
    }
  }
  catch (error) {
    console.error('Hi ha hagut algun problema en enviar el formulari.', error);
  }
}
</script>

<template id="cuerpo">
  <div id="formulario">
    <v-card-title>CESC- Conducta i Experiencies Socials en Clase (ESO)</v-card-title>
    <v-card-text>Es obligatori triar tres opcions en cada pregunta</v-card-text>
    <div id="preguntasTest">
      <v-select v-model="cae_bien" label="Em cau bé" :items="alumnos" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="cae_bien[0]" />
      <v-text-field disabled :label="cae_bien[1]" />
      <v-text-field disabled :label="cae_bien[2]" />

      <v-select v-model="cae_no_bien" :items="alumnos" label="No em cau bé" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="cae_no_bien[0]" />
      <v-text-field disabled :label="cae_no_bien[1]" />
      <v-text-field disabled :label="cae_no_bien[2]" />

      <v-select v-model="difunde_rumores" :items="alumnos" label="Fa córrer rumors" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="difunde_rumores[0]" />
      <v-text-field disabled :label="difunde_rumores[1]" />
      <v-text-field disabled :label="difunde_rumores[2]" />

      <v-select v-model="ayuda_demás" :items="alumnos" label="Ajusa els altres" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="ayuda_demás[0]" />
      <v-text-field disabled :label="ayuda_demás[1]" />
      <v-text-field disabled :label="ayuda_demás[2]" />

      <v-select v-model="da_empujones" :items="alumnos" label="Dóna empentes" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="da_empujones[0]" />
      <v-text-field disabled :label="da_empujones[1]" />
      <v-text-field disabled :label="da_empujones[2]" />

      <v-select v-model="no_deja_participar" :items="alumnos" label="No deixa participar" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="no_deja_participar[0]" />
      <v-text-field disabled :label="no_deja_participar[1]" />
      <v-text-field disabled :label="no_deja_participar[2]" />

      <v-select v-model="anima_demas" :items="alumnos" label="Anima els altres" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="anima_demas[0]" />
      <v-text-field disabled :label="anima_demas[1]" />
      <v-text-field disabled :label="anima_demas[2]" />

      <v-select v-model="insulta" :items="alumnos" label="Insulta" :rules="requiredRule" :multiple="true" />
      <v-text-field disabled :label="insulta[0]" />
      <v-text-field disabled :label="insulta[1]" />
      <v-text-field disabled :label="insulta[2]" />

      <v-select v-model="victima_empujones" :items="alumnos" label="A qui donen empentes?" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="victima_empujones[0]" />
      <v-text-field disabled :label="victima_empujones[1]" />
      <v-text-field disabled :label="victima_empujones[2]" />

      <v-select v-model="victima_insultar" :items="alumnos" label="A qui insulten o ridiculitzen?"
        :rules="requiredRule" :multiple="true" />
      <v-text-field disabled :label="victima_insultar[0]" />
      <v-text-field disabled :label="victima_insultar[1]" />
      <v-text-field disabled :label="victima_insultar[2]" />

      <v-select v-model="victima_no_deja_participar" :items="alumnos" label="A qui no deixen participar?"
        :rules="requiredRule" :multiple="true" />
      <v-text-field disabled :label="victima_no_deja_participar[0]" />
      <v-text-field disabled :label="victima_no_deja_participar[1]" />
      <v-text-field disabled :label="victima_no_deja_participar[2]" />

      <v-select v-model="amigos" :items="alumnos" label="Els meus amics / amigues" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="amigos[0]" />
      <v-text-field disabled :label="amigos[1]" />
      <v-text-field disabled :label="amigos[2]" />
    </div>
    <v-btn type="submit" @click="fetchPostResultats">
      Enviar
    </v-btn>
    <v-alert v-if="errorMessage" type="error" class="mt-3">
    {{ errorMessage }}
    </v-alert>
    <v-dialog v-model="dialog" width="auto">
      <v-card id="mensajeagradecimiento" max-width="400" text="Les dades introduïdes son completament privades."
        title="Respostes Enviades.">
        <template #actions>
          <v-btn text="Vale" @click="navegarapantalla()" />
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
#preguntasTest {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
}

#preguntasTest>* {
  margin: 5px;
}

#formulario>* {
  margin: 5px
}
</style>