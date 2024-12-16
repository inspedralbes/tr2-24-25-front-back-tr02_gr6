<!-- eslint-disable no-undef -->
<script setup>
import { getAlumnes, postResultats } from '@/services/communicationManager';
import { onMounted, ref, watch } from 'vue'
const requiredRule = [
  correo => !!correo || 'Este campo es obligatorio',

];
const correos = ref([])
const alumnos = ref([])
const correo = ref();
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

/*function validarform() {
  const valido = listaarrays.every(listaarrays => listaarrays.value.length === 3);
  if (!valido) {
    alert("Todos los campos deben tener exactamente 3 selecciones.");
  }
  else if (correo.value == null) {
    alert('Debe seleccionar un correo.');
  }
  else if (!terminosycondiciones.value) {
    alert('Debe aceptar los terminos y condiciones.');
  }
 else{
  const formData = {
    correo: correo.value,
    cae_bien: cae_bien.value,
    cae_no_bien: cae_no_bien.value,
    difunde_rumores: difunde_rumores.value,
    ayuda_demás: ayuda_demás.value,
    da_empujones: da_empujones.value,
    no_deja_participar: no_deja_participar.value,
    anima_demas: anima_demas.value,
    insulta: insulta.value,
    victima_empujones: victima_empujones.value,
    victima_insultar: victima_insultar.value,
    victima_no_deja_participar: victima_no_deja_participar.value,
    amigos: amigos.value,
  };
  console.log("Formulario enviado con éxito:", formData);
  dialog.value = true;
}
};*/

async function fecthGetAlumnos() {
  try {
    const llista_alumnes = await getAlumnes();
    correos.value = llista_alumnes.map(alumne => alumne.email);
    alumnos.value = llista_alumnes.map(alumne => `${alumne.nom} ${alumne.cognoms}`);
    console.log(llista_alumnes);
  }
  catch (error) {
    console.error('Error al obtener correos', error);
  }
}

onMounted(() => {
  fecthGetAlumnos();
});


async function fetchPostResultats() {
  try {
    const valido = listaarrays.every(listaarrays => listaarrays.value.length === 3);
    if (!valido) {
      alert("Todos los campos deben tener exactamente 3 selecciones.");
    }
    else if (correo.value == null) {
      alert('Debe seleccionar un correo.');
    }
    else if (!terminosycondiciones.value) {
      alert('Debe aceptar los terminos y condiciones.');
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
      const resultats = await postResultats(formulariEnviar);
      console.log("Formulario enviado con éxito:", resultats);
      correo.value = '';
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
    console.error('Hubo problemas al enviar los resultados.', error);
  }
}
</script>

<template id="cuerpo">
  <div id="formulario">
    <v-card-title>CESC- Conducta y Experiencias Sociales en Clase (ESO)</v-card-title>
    <v-select v-model="correo" label="Correo" :rules="requiredRule" :items="correos" />
    <v-card-text>Es obligatorio seleccionar tres opciones en cada pregunta</v-card-text>
    <div id="preguntasTest">
      <v-select v-model="cae_bien" label="¿Quién me cae bien?" :items="alumnos" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="cae_bien[0]" />
      <v-text-field disabled :label="cae_bien[1]" />
      <v-text-field disabled :label="cae_bien[2]" />

      <v-select v-model="cae_no_bien" :items="alumnos" label="¿Quién NO me cae bien?" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="cae_no_bien[0]" />
      <v-text-field disabled :label="cae_no_bien[1]" />
      <v-text-field disabled :label="cae_no_bien[2]" />

      <v-select v-model="difunde_rumores" :items="alumnos" label="¿Quién difunde rumores?" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="difunde_rumores[0]" />
      <v-text-field disabled :label="difunde_rumores[1]" />
      <v-text-field disabled :label="difunde_rumores[2]" />

      <v-select v-model="ayuda_demás" :items="alumnos" label="¿Quien ayuda a los demás?" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="ayuda_demás[0]" />
      <v-text-field disabled :label="ayuda_demás[1]" />
      <v-text-field disabled :label="ayuda_demás[2]" />

      <v-select v-model="da_empujones" :items="alumnos" label="¿Quien da empujones?" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="da_empujones[0]" />
      <v-text-field disabled :label="da_empujones[1]" />
      <v-text-field disabled :label="da_empujones[2]" />

      <v-select v-model="no_deja_participar" :items="alumnos" label="¿Quien no deja participar?" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="no_deja_participar[0]" />
      <v-text-field disabled :label="no_deja_participar[1]" />
      <v-text-field disabled :label="no_deja_participar[2]" />

      <v-select v-model="anima_demas" :items="alumnos" label="¿Quien anima a los demás?" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="anima_demas[0]" />
      <v-text-field disabled :label="anima_demas[1]" />
      <v-text-field disabled :label="anima_demas[2]" />

      <v-select v-model="insulta" :items="alumnos" label="¿Quien insulta?" :rules="requiredRule" :multiple="true" />
      <v-text-field disabled :label="insulta[0]" />
      <v-text-field disabled :label="insulta[1]" />
      <v-text-field disabled :label="insulta[2]" />

      <v-select v-model="victima_empujones" :items="alumnos" label="¿A quién dan empujones?" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="victima_empujones[0]" />
      <v-text-field disabled :label="victima_empujones[1]" />
      <v-text-field disabled :label="victima_empujones[2]" />

      <v-select v-model="victima_insultar" :items="alumnos" label="¿A quién insultan o ridiculizan?"
        :rules="requiredRule" :multiple="true" />
      <v-text-field disabled :label="victima_insultar[0]" />
      <v-text-field disabled :label="victima_insultar[1]" />
      <v-text-field disabled :label="victima_insultar[2]" />

      <v-select v-model="victima_no_deja_participar" :items="alumnos" label="¿A quién no dejan participar?"
        :rules="requiredRule" :multiple="true" />
      <v-text-field disabled :label="victima_no_deja_participar[0]" />
      <v-text-field disabled :label="victima_no_deja_participar[1]" />
      <v-text-field disabled :label="victima_no_deja_participar[2]" />

      <v-select v-model="amigos" :items="alumnos" label="¿Quienes son mis amigos/amigas?" :rules="requiredRule"
        :multiple="true" />
      <v-text-field disabled :label="amigos[0]" />
      <v-text-field disabled :label="amigos[1]" />
      <v-text-field disabled :label="amigos[2]" />
    </div>
    <v-checkbox v-model="terminosycondiciones" label="He leído y acepto los términos y condiciones." />
    <v-btn type="submit" @click="fetchPostResultats">
      Enviar
    </v-btn>
    <v-dialog v-model="dialog" width="auto">
      <v-card id="mensajeagradecimiento" max-width="400" text="Los datos introducidos son completamente privados."
        title="¡Gracias por participar!">
        <template #actions>
          <v-btn text="Vale" @click="dialog = false" />
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
#formulario {
  background: linear-gradient(rgb(255, 254, 205), rgb(187, 252, 255), rgb(246, 219, 255));
}

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

#mensajeagradecimiento {
  background-image: url("https://i.pinimg.com/736x/89/94/46/8994461746191a7480ceea961a045852.jpg");
}
</style>