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
                <v-tab class="tabtab" @click="navigateToResult()">Resultats</v-tab>
                <v-tab class="tabtab">Gràfics específics</v-tab>
            </v-tabs>

            <v-row>
                <v-col cols="12">
                    <h2 class="results-title">GRÀFICS ESPECÍFICS:</h2>
                </v-col>
            </v-row>

            <!-- Contenedor para los gráficos generados -->
            <v-row>
                <div id="charts-container"></div>
            </v-row>

            <v-btn large class="form-button fixed-button" @click="navegarapantalla">
                FORMULARI
            </v-btn>
        </v-container>
    </v-app>
</template>


<script setup>
import { ref, onMounted } from "vue";
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

async function getidClase() {
    const data = await getClasse(email);
    id_classe.value = data[0].id_classe;
}

async function fetchSociograma() {
    const data = await getResultats(id_classe);
    sociogramaData.value = data;

    console.log("datos", data);
    const container = d3.select("#charts-container");

    const width = 2000 / 3; // Ajustar el ancho de cada gráfico
    const height = 1300 / 2; // Ajustar el alto de cada gráfico

    const radius = 80; // Radio de los círculos principales
    const subRadius = 20; // Radio de los subcírculos

    // Crear un gráfico para cada alumno
    data.forEach((row, index) => {
        const svg = container.append("div")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("id", `visualization-${index}`);

        const centerX = width / 2;
        const centerY = height / 2;

        // Nodo central (Nombre del alumno)
        const group = svg.append("g")
            .attr("transform", `translate(${centerX}, ${centerY})`);

        group.append("circle")
            .attr("class", "circle")
            .attr("r", radius)
            .style("fill", "#FFD700");

        group.append("text")
            .attr("class", "label")
            .attr("y", 5)
            .text(row.nom_alumne);  // Nombre del alumno

        // Datos principales
        const mainFields = [
            { name: "Agressivitat", children: [
                    { name: 'Física', value: row.agressivitatFisica },
                    { name: 'Verbal', value: row.agressivitatVerbal },
                    { name: 'Relacional', value: row.agressivitatRelacional }
                ]
            },
            { name: "Prosocialitat", value: row.prosocialitat },
            { name: "Victimització", children: [
                    { name: 'Física', value: row.victimitzacioFisica },
                    { name: 'Verbal', value: row.victimitzacioVerbal },
                    { name: 'Relacional', value: row.victimitzacioRelacional }
                ]
            },
            { name: "Popular", value: row.popular_SN },
            { name: "Rebutjat", value: row.rebutjat_SN },
            { name: "Ignorat", value: row.ignorat_SN },
            { name: "Controvertit", value: row.controvertit_SN },
            { name: "Normatiu", value: row.norma_SN }
        ];

        // Distribuir nodos principales alrededor del centro
        const positions = [
            { x: 0, y: -1 }, // Arriba
            { x: 1, y: 0 },  // Derecha
            { x: -1, y: 0 }, // Izquierda
            { x: 0, y: 1 },  // Abajo
        ];

        mainFields.forEach((field, i) => {
            const pos = positions[i];
            const x = centerX + pos.x * (radius + 100);
            const y = centerY + pos.y * (radius + 100);

            const mainGroup = svg.append("g")
                .attr("transform", `translate(${x}, ${y})`);

            // Circulo principal
            mainGroup.append("circle")
                .attr("class", "circle")
                .attr("r", field.name === "Prosocialitat" ? radius * (field.value / 10) : radius) // Cambiar tamaño según valor
                .style("fill", field.name === "Prosocialitat" ? "#90EE90" : "#ADD8E6");

            // Texto del círculo principal
            mainGroup.append("text")
                .attr("class", "label")
                .attr("y", 5)
                .text(field.name);

            // Mostrar valor debajo del nombre
            mainGroup.append("text")
                .attr("class", "label")
                .attr("y", 25) // Desplazar un poco hacia abajo
                .text(field.value || ""); // Mostrar el valor si existe

            // Si tiene subcampos, añadirlos dentro
            if (field.children) {
                const subAngleStep = (2 * Math.PI) / field.children.length;
                field.children.forEach((subField, j) => {
                    const subAngle = j * subAngleStep;
                    const subX = x + Math.cos(subAngle) * (radius - 20);
                    const subY = y + Math.sin(subAngle) * (radius - 20);

                    svg.append("circle")
                        .attr("class", "subcircle")
                        .attr("r", subRadius * (subField.value / 10)) // Tamaño proporcional
                        .attr("cx", subX)
                        .attr("cy", subY);

                    svg.append("text")
                        .attr("class", "label")
                        .attr("x", subX)
                        .attr("y", subY + 5)
                        .text(subField.name);

                    // Mostrar valor debajo del nombre del subcampo
                    svg.append("text")
                        .attr("class", "label")
                        .attr("x", subX)
                        .attr("y", subY + 25) // Desplazar un poco hacia abajo
                        .text(`${subField.value}`); // Mostrar el valor
                });
            }
        });
    });
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

function navigateToResult() {
    router.push('/resultats');
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