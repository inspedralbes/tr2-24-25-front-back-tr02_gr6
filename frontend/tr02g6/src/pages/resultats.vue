<template>
    <v-app>
      <v-container>
        <v-row class="header-row">
          <v-col cols="12" class="d-flex align-center justify-space-between">
            <h1 class="header-title">BENVINGUT/DA {{ userStore.email }} a {{ classe }}!</h1>
          </v-col>
        </v-row>
  
        <v-tabs v-model="activeTab" align="center">
          <v-tab class="tabtab" @click="navigateToAlum()">Alumnes Registrats</v-tab>
          <v-tab class="tabtab">Resultats</v-tab>
        </v-tabs>
  
        <v-row>
          <v-col cols="12">
            <h2 class="results-title">RESULTATS:</h2>
          </v-col>
        </v-row>
  
        <v-row>
          <v-col cols="12">
            <div class="result-preview">
              <!-- Aquí se renderiza el sociograma con D3.js -->
              <svg ref="sociogramaSvg" class="sociograma-svg"></svg>
            </div>
          </v-col>
        </v-row>
  
        <v-btn 
          large
          class="form-button fixed-button"
          @click="navegarapantalla"
        >
          FORMULARI
        </v-btn>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/userStore';
  import * as d3 from 'd3';
  
  const router = useRouter();
  const userStore = useUserStore();
  const email = userStore.email;
  const activeTab = ref(1);
  const classe = ref("");
  const sociogramaData = ref(null); // Aquí almacenamos los datos del sociograma
  
  // Función para obtener los datos del sociograma
  async function fetchSociograma() {
    try {
      const response = await fetch('/resultats?id_classe=1');  // Usamos `fetch()` para obtener los datos
      const data = await response.json();
      sociogramaData.value = data; // Almacena los datos obtenidos
      nextTick(initD3Chart); // Espera al DOM para inicializar el gráfico
    } catch (error) {
      console.error("Error al obtener sociograma:", error.message);
    }
  }
  
  // Inicializar el gráfico con D3.js
  function initD3Chart() {
    if (sociogramaData.value && sociogramaData.value.length > 0) {
      const svg = d3.select($refs.sociogramaSvg); // Obtener referencia al SVG
  
      // Definir el tamaño del SVG
      const width = svg.node().getBoundingClientRect().width;
      const height = svg.node().getBoundingClientRect().height;
  
      // Limpiar cualquier contenido previo en el SVG
      svg.selectAll('*').remove();
  
      // Crear un layout para el gráfico (en este caso, un gráfico de nodos)
      const simulation = d3.forceSimulation(sociogramaData.value)
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(50));
  
      // Crear los círculos de los nodos
      const node = svg.selectAll('.node')
        .data(sociogramaData.value)
        .enter().append('circle')
        .attr('class', 'node')
        .attr('r', 10)
        .attr('fill', 'steelblue')
        .call(d3.drag().on('start', dragstart).on('drag', dragged).on('end', dragend));
  
      // Añadir las etiquetas de texto a los nodos
      const label = svg.selectAll('.label')
        .data(sociogramaData.value)
        .enter().append('text')
        .attr('class', 'label')
        .attr('dx', 12)
        .attr('dy', '.35em')
        .text(d => d.name); // Asume que cada nodo tiene un campo `name`
  
      // Actualizar las posiciones de los nodos en cada tick de la simulación
      simulation.on('tick', () => {
        node.attr('cx', d => d.x)
            .attr('cy', d => d.y);
  
        label.attr('x', d => d.x)
             .attr('y', d => d.y);
      });
  
      // Funciones para arrastrar los nodos
      function dragstart(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
  
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
  
      function dragend(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    }
  }
  
  onMounted(() => {
    fetchSociograma(); 
  });
  

  function navegarapantalla() {
    router.push('/formPage');
  }
  
  function navigateToAlum() {
    if (esProfe(email)) {
      router.push('/classProf');
    }
    router.push('/classAlum');
  }
  
  function esProfe(email) {
    const teNumeros = /\d/;
    return !teNumeros.test(email);
  }
  
  async function fetchClasse() {
    try {
      const response = await fetch(`/getClasse?email=${email}`); // Usamos fetch() para obtener la clase
      const data = await response.json();
      classe.value = data[0].classe;
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  
  onMounted(fetchClasse);
  </script>
  
  <style scoped>
  
.header-row {
    background-color: orange;
    color: white;
    padding: 20px 0;
}
.tabtab {
    color: rgb(185, 122, 7);
    text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.header-title {
    font-weight: bold;
}
.form-button {
    background-color: orange;
    color: white;
    font-size: 1.2em;
    font-weight: bold;
    width: 250px;
    height: 60px;
    border-radius: 30px;
}
  .sociograma-svg {
    width: 100%;
    height: 600px;
    border: 1px solid #ddd;
  }
  
  .node {
    cursor: pointer;
  }
  
  .link {
    pointer-events: none;
  }
 
  </style>
  