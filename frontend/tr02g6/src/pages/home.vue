<template>
  <v-main>
    <v-container class="py-8 px-6 text-center">
      <h1 class="app-title">CESC FORMULARI</h1>
      <h3 class="app-subtitle">Automatització de la dinàmica de grups</h3>
      <v-divider class="my-5"></v-divider>

      <h3 class="tutorial-title">Tutorial: Com utilitzar la plataforma</h3>
      <v-row class="mt-8">
        <v-col cols="12" md="4">
          <v-card outlined class="tutorial-card">
            <v-img src="https://picsum.photos/seed/picsum/200/300" class="card-image" cover></v-img>
            <v-card-title class="card-title">Pas 1: Introduïu el codi</v-card-title>
            <v-card-text>
              Els professors només han de proporcionar el codi de la classe als
              alumnes. Aquest codi connecta directament amb el sistema.
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card outlined class="tutorial-card">
            <v-img src="https://picsum.photos/seed/picsum/200/300" class="card-image" cover></v-img>
            <v-card-title class="card-title">Pas 2: Realitza el Form</v-card-title>
            <v-card-text>
              Els alumnes completen el formulari virtual amb preguntes dissenyades per analitzar les dinàmiques del
              grup.
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card outlined class="tutorial-card">
            <v-img src="https://picsum.photos/seed/picsum/200/300" class="card-image" cover></v-img>
            <v-card-title class="card-title">Pas 3: Visualització automàtica</v-card-title>
            <v-card-text>
              Els resultats es processen automàticament i es presenten amb gràfics interactius que expliquen clarament la dinàmica del grup.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Graphics Section -->
      <h3 class="tutorial-title mt-8">Gràfics i Visualització</h3>
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="chart-card">
            <v-card-title class="chart-title">Gràfic de Popularitat</v-card-title>
            <v-card-text>
              Aquest gràfic mostra quins alumnes són més populars i quins estan
              més aïllats en el grup.
            </v-card-text>
            <v-img src="https://picsum.photos/seed/picsum/200/300" alt="Gràfic Popularitat"
              contain></v-img>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="chart-card">
            <v-card-title class="chart-title">Gràfic de Rols</v-card-title>
            <v-card-text>
              Identifica els rols dins del grup: líder positiu, líder negatiu,
              possibles casos de bullying, etc.
            </v-card-text>
            <v-img src="https://picsum.photos/seed/picsum/200/300" alt="Gràfic Rols" contain></v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-navigation-drawer permanent class="app-drawer">
      <v-avatar class="mx-4 drawer-avatar" color="orange darken-2" size="64">
        {{ userStore.email.charAt(0).toUpperCase() }}
      </v-avatar>
      <v-list-item :title="userStore.email" subtitle="Professor/a" class="drawer-header"></v-list-item>
      <v-divider></v-divider>
      <v-list-item v-for="[icon, text] in links" :key="icon" :prepend-icon="icon" :title="text"
        @click="goToCourse(text)"></v-list-item>
    </v-navigation-drawer>
  </v-main>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const links = [
  ["mdi-inbox-arrow-down", "1 ESO"],
  ["mdi-inbox-arrow-down", "2 ESO"],
  ["mdi-inbox-arrow-down", "3 ESO"],
  ["mdi-inbox-arrow-down", "4 ESO"],
  ["mdi-inbox-arrow-down", "PFI"],
];

const router = useRouter();

const goToCourse = (course) => {
  const formattedCourse = course.toUpperCase().replace(" ", "");
  router.push(`/course/${formattedCourse}`);
};
</script>

<style scoped>
.app-title {
  font-size: 3em;
  font-weight: bold;
  color: #ffb522;
  margin-bottom: 10px;
}

.app-subtitle {
  font-size: 1.5em;
  color: #cc7423;
}

.tutorial-title {
  font-size: 2em;
  color: #e9a319;
  margin-bottom: 20px;
}

.tutorial-card {
  transition: transform 0.3s ease-in-out;
}

.tutorial-card:hover {
  transform: scale(1.05);
}

.card-title {
  font-size: 1.5em;
  color: #ff7043;
}

.chart-card {
  text-align: center;
  border-radius: 12px;
  background: #f5f5f5;
  transition: all 0.3s ease-in-out;
}

.chart-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #ff7043;
}

.app-drawer {
  background: #ffb522;
  color: white;
}

.drawer-avatar {
  font-size: 1.5em;
  color: white;
}

.drawer-header {
  font-weight: bold;
  color: white;
}
</style>
