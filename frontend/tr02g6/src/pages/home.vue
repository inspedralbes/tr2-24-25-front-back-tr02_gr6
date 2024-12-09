<template>
    <v-main>
      <v-container class="py-8 px-6" >
        <h1>CESC FORMULARI</h1>
        <br><br>
        <h3>TUTORIAL:</h3>
      </v-container>
    </v-main>

<v-navigation-drawer>
      <v-avatar ma="5"class="mb-4" color="grey-darken-1" size="64"></v-avatar>
      <v-list-item 
  :title="userStore.email" 
  subtitle="Profesor/a">
</v-list-item>
  <v-divider></v-divider>
  <v-list-item v-for="[icon, text] in links"
          :key="icon"
          :prepend-icon="icon"
          :title="text"
          @click="goToCourse(text)"></v-list-item>
</v-navigation-drawer>

</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore';
const userStore = useUserStore();

const links = [
  ['mdi-inbox-arrow-down', '1 ESO'],
  ['mdi-inbox-arrow-down', '2 ESO'],
  ['mdi-inbox-arrow-down', '3 ESO'],
  ['mdi-inbox-arrow-down', '4 ESO'],
  ['mdi-inbox-arrow-down', 'PFI'],
]

const router = useRouter() 

const goToCourse = (course) => {
  const formattedCourse = course.toLowerCase().replace(' ', '')
  router.push(`/course/${formattedCourse}`) 
}
</script>
