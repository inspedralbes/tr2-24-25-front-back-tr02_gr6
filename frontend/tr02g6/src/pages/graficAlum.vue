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
          <v-tab class="tabtab" @click="navigateToGrafic()">Gràfics específics</v-tab>
        </v-tabs>
  
        <v-row>
          <v-col cols="12">
            <h2 class="results-title">RESULTATS:</h2>
          </v-col>
        </v-row>
  
        <v-row>
          <v-col cols="4">
            <h3>POPULAR</h3>
            <svg ref="popularSvg" class="sociograma-svg"></svg>
          </v-col>
          <v-col cols="4">
            <h3>CONTROVERTIT</h3>
            <svg ref="controvertitSvg" class="sociograma-svg"></svg>
          </v-col>
          <v-col cols="4">
            <h3>NORMAL</h3>
            <svg ref="normalSvg" class="sociograma-svg"></svg>
          </v-col>
        </v-row>
  
        <v-row>
          <v-col cols="4">
            <h3>REBUTJAT</h3>
            <svg ref="rebutjatSvg" class="sociograma-svg"></svg>
          </v-col>
          <v-col cols="4">
            <h3>IGNORAT</h3>
            <svg ref="ignoratSvg" class="sociograma-svg"></svg>
          </v-col>
          <v-col cols="4">
            <h3>AGRESSIVITAT</h3>
            <svg ref="agresivitatSvg" class="sociograma-svg"></svg>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <h3>VICTIMITZACIÓ</h3>
            <svg ref="vicitmitzacioSvg" class="sociograma-svg"></svg>
          </v-col>
        </v-row>
  
        <v-btn large class="form-button fixed-button" @click="navegarapantalla">
          FORMULARI
        </v-btn>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from "vue";
  import { useRouter } from "vue-router";
  import { useUserStore } from "@/stores/userStore";
  import * as d3 from "d3";
  import { getClasse, getResultats } from "@/services/communicationManager";
  
  const router = useRouter();
  const userStore = useUserStore();
  const email = userStore.email;
  const activeTab = ref(1);
  const classe = ref("");
  const sociogramaData = ref(null);
  const id_classe = ref("");
  const popularSvg = ref(null);
  const controvertitSvg = ref(null);
  const normalSvg = ref(null);
  const rebutjatSvg = ref(null);
  const ignoratSvg = ref(null);
  const agresivitatSvg = ref(null);
  const vicitmitzacioSvg = ref(null);
  
  async function getidClase() {
    const data = await getClasse(email);
    id_classe.value = data[0].id_classe;
  }
  
  async function fetchSociograma() {
    try {
      const data = await getResultats(id_classe);
      sociogramaData.value = data;
  
      console.log("bolas", data);
  
      const charts = [
        { category: "popular", svg: popularSvg.value, filterFn: d => d.popular_SN === "X" },
        { category: "controvertit", svg: controvertitSvg.value, filterFn: d => d.controvertit_SN === "X" },
        { category: "normal", svg: normalSvg.value, filterFn: d => d.normal_SN === "X" },
        { category: "rebutjat", svg: rebutjatSvg.value, filterFn: d => d.rebutjat_SN === "X" },
        { category: "ignorat", svg: ignoratSvg.value, filterFn: d => d.ignorat_SN === "X" },
        { category: "agresivitat", svg: agresivitatSvg.value, filterFn: d => d.totalAgressivitat != null, sizeValueFn: d => d.totalAgressivitat },
        { category: "victimitzacio", svg: vicitmitzacioSvg.value, filterFn: d => d.totalVictimitzacio != null, sizeValueFn: d => d.totalVictimitzacio }
      ];
  
  
      nextTick(() => {
  
        charts.forEach(chart => {
          if (chart.sizeValueFn) {
            initD3Chart(chart.category, chart.svg, chart.filterFn, chart.sizeValueFn);
          } else {
            initD3Chart(chart.category, chart.svg, chart.filterFn);
          }
        });
      });
  
    } catch (error) {
      console.error("Error al obtener sociograma:", error);
    }
  }
  
  function initD3Chart(category, svgElement, filterFn, sizeValueFn = null) {
    const data = sociogramaData.value.filter(filterFn);
  
    if (!data.length) {
      console.warn(`No hay datos para la categoría "${category}".`);
      return;
    }
  
    const svg = d3.select(svgElement);
    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
  
    svg.selectAll('*').remove();
  
    const sizeScale = sizeValueFn
      ? d3.scaleLinear()
        .domain(d3.extent(data, sizeValueFn))
        .range([5, 30])
      : null;
  
    const simulation = d3.forceSimulation(data)
      .force('charge', d3.forceManyBody().strength(-10))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => sizeScale ? sizeScale(sizeValueFn(d)) : 10));
  
    let links = data
      .map((source, i) =>
        data
          .slice(i + 1)
          .map((target) => ({ source, target }))
      )
      .flat();
  
    if (["popular", "controvertit", "normal", "rebutjat", "ignorat"].includes(category)) {
      svg.append("defs")
        .append("marker")
        .attr("id", `arrowhead-${category}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "gray");
  
      const link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("stroke", "gray")
        .attr("stroke-width", 1)
        .attr("marker-end", `url(#arrowhead-${category})`);
    }
  
    const node = svg.selectAll('.node')
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", (d) => (sizeScale ? sizeScale(sizeValueFn(d)) : 10)) // Asignar tamaño fijo si sizeValueFn no está definido
      .attr("fill", () => {
        const colors = ["pink", "blue", "green", "yellow", "purple", "orange", "red"];
        for (let i = 0; i < data.length; i++) {
          return colors[i];
        };
  
      })
      .call(d3.drag().on("start", dragstart).on("drag", dragged).on("end", dragend));
  
    const label = svg.selectAll('.label')
      .data(data)
      .enter().append('text')
      .attr('class', 'label')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .text(d => d.nom);
  
    simulation.on('tick', () => {
      if (["popular", "controvertit", "normal", "rebutjat", "ignorat"].includes(category)) {
        svg.selectAll(".link")
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
      }
  
      node.attr('cx', d => d.x).attr('cy', d => d.y);
      label.attr('x', d => d.x).attr('y', d => d.y);
    });
  
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
  
  
  function navegarapantalla() {
    router.push("/formPage");
  }
  
  function navigateToAlum() {
    if (esProfe(email)) {
      router.push("/classProf");
    } else {
      router.push("/classAlum");
    }
  }
  
  function navigateToGrafic() {
    if (esProfe(email)) {
      router.push("/grafico");
    } else {
      router.push("/classAlum");
    }
  }
  
  function esProfe(email) {
    const teNumeros = /\d/;
    return !teNumeros.test(email);
  }
  
  async function fetchClasse() {
    try {
      const data = await getClasse(email);
      classe.value = data[0].classe;
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  
  onMounted(async () => {
    await getidClase();
    await fetchSociograma();
    await fetchClasse();
  });
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
  
  @media (max-width: 768px) {
    .sociograma-svg {
      height: 300px;
    }
  }
  
  .node {
    cursor: pointer;
  }
  
  .link {
    pointer-events: none;
  }
  
  .node {
    cursor: pointer;
  }
  
  .circle {
    fill: lightblue;
    stroke: #1f77b4;
    stroke-width: 2px;
  }
  
  .label {
    font-size: 14px;
    text-anchor: middle;
    fill: black;
  }
  
  .subcircle {
    fill: lightcoral;
    stroke: #ff6347;
    stroke-width: 2px;
  }
  </style>
  