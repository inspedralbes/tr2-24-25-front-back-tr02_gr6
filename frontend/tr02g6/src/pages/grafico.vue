<template>
    <v-container>
        <v-row class="header-row">
            <v-col cols="12" class="d-flex align-center justify-space-between">
               
                <h1 class="header-title">BENVINGUT/DA {{ userStore.email }} a {{ classe }}!</h1>
            </v-col>
        </v-row>
            <v-tabs v-model="activeTab" align="center">
                <v-tab class="tabtab" @click="navigateToAlum()">Alumnes Registrats</v-tab>
                <v-tab class="tabtab" @click="navigateToResult()">Resultats</v-tab>
                <v-tab class="tabtab">Gràfics específics</v-tab>
            </v-tabs>
            <v-row>
  <v-col cols="12">
    <v-text-field
      v-model="searchQuery"
      label="Cerca per nom o cognoms"
      clearable
      @input="filterAlumnes"
    ></v-text-field>
  </v-col>
</v-row>

        <v-row class="d-flex justify-center">
          <div id="charts-container"></div>
        </v-row>

      </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import * as d3 from "d3";
  import { useUserStore } from "@/stores/userStore";
  import { getClasse, getResultats } from "@/services/communicationManager";
  const activeTab = ref(2);
  import { useRouter } from 'vue-router';
  const router = useRouter();

  const userStore = useUserStore();
  const classe = ref("");
  const id_classe = ref("");
  
  const radius = 80;
  const subRadiusBase = 10;
  const data = ref([]);
  const searchQuery = ref(""); 
const filteredAlumnes = ref([]); 

function filterAlumnes() {
  if (searchQuery.value.trim() === "") {
    filteredAlumnes.value = data.value; 
  } else {
    filteredAlumnes.value = data.value.filter((alumne) =>
      `${alumne.nom} ${alumne.cognoms}`
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    );
  }
  renderGraphs(filteredAlumnes.value);
}

function renderGraphs(alumnes) {
  const container = d3.select("#charts-container");
  container.html("");

  alumnes.forEach((alumno) => {
    const svg = container
      .append("div")
      .attr("class", "graph")
      .append("svg")
      .attr("width", 800)  
      .attr("height", 800); 

    const centerX = 400;  
    const centerY = 400; 

    svg.append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", radius)
      .style("fill", "#f285ce");

    svg.append("text")
      .attr("x", centerX)
      .attr("y", centerY)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("font-weight", "bold")
      .text(`${alumno.nom} ${alumno.cognoms}`);

    // Nodo Agressivitat 
    svg.append("circle")
      .attr("cx", centerX - 250) 
      .attr("cy", centerY)
      .attr("r", radius)
      .style("fill", "#a09fa3");

    svg.append("text")
      .attr("x", centerX - 250)
      .attr("y", centerY)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("font-weight", "bold")
      .text("Agressivitat");

    const aggressivityKeys = ['agressivitatFisica', 'agressivitatRelacional', 'agressivitatVerbal'];
    let angleAggressivity = 0;
    const angleStepAggressivity = (2 * Math.PI) / aggressivityKeys.length;

    aggressivityKeys.forEach(key => {
      const value = alumno[key];

      if (value > 0) {
        const subRadiusSize = subRadiusBase + value * 2;
        const subX = centerX - 250 + radius * 0.9 * Math.cos(angleAggressivity);  
        const subY = centerY + radius * 0.9 * Math.sin(angleAggressivity);  

        svg.append("circle")
          .attr("cx", subX)
          .attr("cy", subY)
          .attr("r", subRadiusSize)
          .style("fill", "red");

        svg.append("text")
          .attr("x", subX)
          .attr("y", subY - 8)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .style("font-weight", "bold")
          .text(key.replace('agressivitat', ''));

        svg.append("text")
          .attr("x", subX)
          .attr("y", subY + 8)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(value);

        angleAggressivity += angleStepAggressivity;
      }
    });

    // Nodo Victimització 
    svg.append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY - 230)  
      .attr("r", radius)
      .style("fill", "#f1e872");

    svg.append("text")
      .attr("x", centerX)
      .attr("y", centerY - 230)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("font-weight", "bold")
      .text("Victimització");

    const victimizationKeys = ['victimitzacioFisica', 'victimitzacioVerbal', 'victimitzacioRelacional'];
    let angleVictimization = 0;
    const angleStepVictimization = (2 * Math.PI) / victimizationKeys.length;

    victimizationKeys.forEach(key => {
      const value = alumno[key];
      if (value > 0) {
        const subRadiusSize = subRadiusBase + value * 2;
        const subX = centerX + radius * 0.9 * Math.cos(angleVictimization);
        const subY = centerY - 230 + radius * 0.9 * Math.sin(angleVictimization);

        svg.append("circle")
          .attr("cx", subX)
          .attr("cy", subY)
          .attr("r", subRadiusSize)
          .style("fill", "green");

        svg.append("text")
          .attr("x", subX)
          .attr("y", subY - 8)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .style("font-weight", "bold")
          .text(key.replace('victimitzacio', ''));

        svg.append("text")
          .attr("x", subX)
          .attr("y", subY + 8)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(value);

        angleVictimization += angleStepVictimization;
      }
    });

    // Nodo Prosocialitat 
    const prosocialValue = alumno.prosocialitat_SN || 1;
    const prosocialRadius = (prosocialValue / 7) * radius + 30;

    svg.append("circle")
      .attr("cx", centerX + 200)  
      .attr("cy", centerY)
      .attr("r", prosocialRadius)
      .style("fill", "#5df99d");

    svg.append("text")
      .attr("x", centerX + 200)
      .attr("y", centerY)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("font-weight", "bold")
      .text("Prosocialitat");

    const prosocialKeys = ['ajuda_SN', 'colaboracio_SN', 'respecte_SN'];
    let angleProsocial = 0;
    const angleStepProsocial = (2 * Math.PI) / prosocialKeys.length;

    prosocialKeys.forEach(key => {
      if (alumno[key] === 'X') {
        const subX = centerX + 200 + prosocialRadius * 1.8 * Math.cos(angleProsocial);
        const subY = centerY + prosocialRadius * 1.8 * Math.sin(angleProsocial);

        svg.append("circle")
          .attr("cx", subX)
          .attr("cy", subY)
          .attr("r", subRadiusBase)
          .style("fill", "#8997ff");

        svg.append("text")
          .attr("x", subX)
          .attr("y", subY)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(key.replace('_SN', ''));

        angleProsocial += angleStepProsocial;
      }
    });

    // Nodo condicional
    const conditions = {
      'popular_SN': 'Popular',
      'rebutjat_SN': 'Rebutjat',
      'ignorat_SN': 'Ignorat',
      'controvertit_SN': 'Controvertit',
      'norma_SN': 'Normatiu'
    };

    const activeConditions = Object.entries(conditions)
      .filter(([key, _]) => alumno[key] === 'X')
      .map(([_, label]) => label);

    if (activeConditions.length > 0) {
      const condY = centerY + 230;
      svg.append("circle")
        .attr("cx", centerX)
        .attr("cy", condY)
        .attr("r", radius / 2)
        .style("fill", "#8997ff");

      svg.append("text")
        .attr("x", centerX)
        .attr("y", condY)
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .style("font-size", "16px")
        .text(activeConditions.join(', '));
    }
  });
}


  async function fetchClasse() {
    const classeData = await getClasse(userStore.email);
    classe.value = classeData[0]?.classe || "Desconeguda";
    id_classe.value = classeData[0]?.id_classe;
  }
  
  async function fetchSociograma() {
  const sociogramaData = await getResultats(id_classe.value);
  console.log(id_classe.value)
  data.value = sociogramaData;
  filterAlumnes();
}
       function navigateToAlum() {
    router.push("/classProf");
}

function navigateToResult() {
  if (!aparece.value || aparece.value === "" || Number(aparece.value) < 1) {
    router.push('/resultats');
  } else {
    router.push('/grafics');
  }
} 
  onMounted(async () => {
  await fetchClasse(); 
  await fetchSociograma(); 
  filterAlumnes(); 
});
  </script>
  
  <style scoped>
  .graph {
    margin-bottom: 20px;
  }
  
  .header-title {
    font-size: 1.5rem;
    text-align: center;
    color: #333;
    margin: 20px 0;
  }
  
  .results-title {
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 20px;
  }
  .header-row {
    background-color: orange;
    color: white;
    padding: 20px 0;
}

.header-title {
    font-weight: bold;
    color: white;
}

.tabtab,
.alumnes-title {
    color: rgb(185, 122, 7);
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
}

.codi-card {
    background-color: orange;
    color: white;
    text-align: center;
    border-radius: 16px;
    padding: 30px;
}

.codi-title {
    font-size: 2em;
    font-weight: bold;
}

.codi-text {
    font-size: 3em;
    font-weight: bold;
}

.alumne-card {
    transition: all 0.3s;
    padding: 0.5em;
    background-color: #fff8e1;
    border-color: orange;
}

.alumne-card:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.form-button {
    background-color: orange;
    color: white;
    font-size: 1.2em;
    font-weight: bold;
    width: 250px;
    height: 60px !important;
    border-radius: 30px;
}

.fixed-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}

.tarjeta-verda {
    background-color: green;
    color: white;
}

.tarjeta-vermella {
    background-color: red;
    color: white;
}

.home-button,
.code-button {
    color: rgb(195, 91, 0);
    background-color: orange darken-2;
}
</style>