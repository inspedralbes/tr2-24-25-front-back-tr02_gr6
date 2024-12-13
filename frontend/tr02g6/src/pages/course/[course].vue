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
      <br>
      <br>
      <v-btn color="primary" @click="addClass">Afegir Classe</v-btn>
      <v-btn @click="navegarapantalla">Formulario</v-btn>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute,useRouter } from 'vue-router'
  
  const route = useRoute()
  const router = useRouter()

  const formattedCourse = ref(route.params.course)
  const reformattedCourse = formattedCourse.value.toUpperCase().replace('', '  ')

  const classes = ref([]) 

  const navegarapantalla = () =>{
  router.push('/formPage')
} 
  
   const fetchClasses = async () => {
    try {
      console.log(formattedCourse.value)
      const response = await fetch(`http://localhost:3001/classes/${formattedCourse.value}`)
      if (!response.ok) throw new Error('Error al obtener datos');
        classes.value = await response.json();
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
  };

    const afegirClasse = async () => {
    const classeData = {
        id_classe: this.preguntes.length, 
        classe: this.nuevaPregunta,
        id_course: this.nuevasRespostes,
      };

      try {
        const response = await fetch(`http://localhost:3001/classes/${formattedCourse.value}`,{
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(classeData),
        });

        if (response.ok) {
          const preguntaAgregada = await response.json();
          this.preguntes.push(preguntaAgregada); // Agregar a la lista
          this.limpiarFormulario();
        } else {
          console.error('Error al afegir');
        }
      } catch (error) {
        console.error(error);
      }
    }



  onMounted(fetchClasses)

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