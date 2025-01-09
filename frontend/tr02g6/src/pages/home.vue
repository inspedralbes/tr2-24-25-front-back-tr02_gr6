<template>
  <v-app>
    <v-navigation-drawer permanent class="app-drawer">
      <v-avatar class="mt-4 ml-4 mr-4 drawer-avatar" color="orange darken-2" size="64">
        {{ userStore.email.charAt(0).toUpperCase() }}
      </v-avatar>
      <v-list-item :title="userStore.email" subtitle="Professor/a" class="drawer-header"></v-list-item>
      <v-divider></v-divider>
      <v-list-item v-for="[icon, text] in links" :key="icon" :prepend-icon="icon" :title="text"
        @click="goToCourse(text)">
      </v-list-item>
    </v-navigation-drawer>

    <v-main class="main-content">
      <v-container class="container" fluid>
        <h1 class="cesc-titol">CESC FORMULARI</h1>
        <h3 class="cesc-subtit">Automatització de la dinàmica de grups</h3>
        <v-divider class="my-5"></v-divider>

        <h3 class="tutorial">Tutorial: Com utilitzar la plataforma</h3>
        <v-row class="mt-8">
          <v-col cols="12" md="4">
            <v-card outlined class="tutorial-card">
              <iframe src="https://www.empresaiformacio.org/sBid/" frameborder="0" class="result-iframe"></iframe>
              <v-card-title class="card-title">Pas 1: Introduïu el codi</v-card-title>
              <v-card-text>
                Els professors només han de proporcionar el codi de la classe als alumnes. Aquest codi connecta
                directament amb el sistema.
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card outlined class="tutorial-card">
              <iframe src="https://www.empresaiformacio.org/sBid/" frameborder="0" class="result-iframe"></iframe>
              <v-card-title class="card-title">Pas 2: Realitza el Form</v-card-title>
              <v-card-text>
                Els alumnes completen el formulari virtual amb preguntes dissenyades per analitzar les dinàmiques del
                grup.
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card outlined class="tutorial-card">
              <iframe src="https://www.empresaiformacio.org/sBid/" frameborder="0" class="result-iframe"></iframe>
              <v-card-title class="card-title">Pas 3: Visualització automàtica</v-card-title>
              <v-card-text>
                Els resultats es processen automàticament i es presenten amb gràfics interactius que expliquen clarament
                la dinàmica del grup.
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <h3 class="tutorial mt-8">Gràfics i Visualització</h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="grafic-card">
                <v-card-title class="grafic-title">Gràfic de Popularitat</v-card-title>
                <v-card-text>
                  Aquest gràfic mostra quins alumnes són més populars i quins estan
                  més aïllats en el grup.
                </v-card-text>
                <iframe src="https://www.empresaiformacio.org/sBid/" frameborder="0" class="result-iframe"></iframe>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="grafic-card">
                <v-card-title class="grafic-title">Gràfic de Rols</v-card-title>
                <v-card-text>
                  Identifica els rols dins del grup: líder positiu, líder negatiu,
                  possibles casos de bullying, etc.
                </v-card-text>
                <iframe src="https://www.empresaiformacio.org/sBid/" frameborder="0" class="result-iframe"></iframe>
              </v-card>
            </v-col>
          </v-row>
    </v-container>
    </v-main>
  </v-app>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore';
import { redirect } from '@/services/communicationManager';

const userStore = useUserStore();
const links = [
  ["mdi-inbox-arrow-down", "1 ESO"],
  ["mdi-inbox-arrow-down", "2 ESO"],
  ["mdi-inbox-arrow-down", "3 ESO"],
  ["mdi-inbox-arrow-down", "4 ESO"],
  ["mdi-inbox-arrow-down", "PFI"],
];

const router = useRouter();
redirect()
const goToCourse = (course) => {
  const formattedCourse = course.toUpperCase().replace(' ', '')
  router.push(`/course/${formattedCourse}`) 
}
</script>

<style scoped>
.main-content {
  margin-left: 250px;
  padding: 0;
}

.app-drawer {
  width: 250px; 
  background: #ffb522;
  color: white;
}

.container {
  padding: 16px;
}

.cesc-titol {
  font-size: 3em;
  font-weight: bold;
  color: #ffb522;
  margin-bottom: 10px;
  text-align: center;
}

.cesc-subtit {
  font-size: 1.5em;
  color: #cc7423;
  text-align: center;

}

.tutorial {
  font-size: 2em;
  color: #e9a319;
  margin-bottom: 20px;
  text-align: center;

}

.tutorial-card {
  text-align: center;
  transition: transform 0.3s ease-in-out;
}

.tutorial-card:hover {
  text-align: center;
  transform: scale(1.05);
}

.card-title {
  text-align: center;
  font-size: 1.5em;
  color: #ff7043;
}
</style>
