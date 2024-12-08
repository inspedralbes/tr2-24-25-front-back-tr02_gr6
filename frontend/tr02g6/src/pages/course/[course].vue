<template>
    <v-container>
      <h1>Gestió de {{ reformattedCourse }}</h1>
      <v-row>
        <v-col cols="12" md="6" v-for="classe in classes" :key="classe.id_classe">
          <v-card class="mb-4">
            <v-card-title>{{ classe.classe }}</v-card-title>
            <v-card-subtitle>ID: {{ classe.id_classe }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
      <v-btn color="primary" @click="addClass">Afegir Classe</v-btn>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const formattedCourse = ref(route.params.course)
  const reformattedCourse = formattedCourse.value.toUpperCase().replace('', ' ')

  const classes = ref([]) 
  
  const mockData = {
    '1eso': [{ id_classe: 1, classe: '1 eso a' }, { id_classe: 2, classe: '1rESOB' }],
    '2eso': [{ id_classe: 3, classe: '2nESOA' }, { id_classe: 4, classe: '2nESOB' }],
    '3eso': [{ id_classe: 5, classe: '3rESOA' }, { id_classe: 6, classe: '3rESOB' }],
    '4eso': [{ id_classe: 7, classe: '4tESOA' }, { id_classe: 8, classe: '4tESOB' }],
    'pfi': [{ id_classe: 9, classe: 'PFIA' }, { id_classe: 10, classe: 'PFIB' }],
  }
  
  onMounted(() => {
    classes.value = mockData[formattedCourse.value] 
  })
  const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 11)
}

const addClass = () => {
  const newClass = prompt('Introduce el nombre de la nueva clase:')
  if (newClass) {
    const newId = generateRandomId() 
    classes.value.push({ id_classe: newId, classe: newClass }) 
  }
}
  </script>
  