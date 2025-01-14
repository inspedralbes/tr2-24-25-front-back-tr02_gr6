<template>
  <v-container class="d-flex align-center justify-center ">
    <v-row class="ma-0" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card color="#FFF8E1" class="elevation-6 mx-auto" max-width="600">
          <v-window v-model="step" class="pa-3">
            <v-window-item :value="1">
              <v-row justify="center">
                <v-col cols="12" sm="10">
                  <v-card-text>
                    <slot name="logo">
                      <v-img
                        class="rounded-circle mx-auto mb-4"
                        max-width="150"
                        src="/login1.png"
                      ></v-img>
                    </slot>
                    <v-form @submit.prevent="handleLogin" ref="form">
                      <div class="text-subtitle-1 text-medium-emphasis mb-2">
                        Email
                      </div>
                      <v-text-field
                        v-model="user.email"
                        density="compact"
                        placeholder="Introduce tu email"
                        :rules="[(v) => !!v || 'Aquest camp és obligatori']"
                        prepend-inner-icon="mdi-email-outline"
                        variant="outlined"
                      ></v-text-field>

                      <div class="text-subtitle-1 text-medium-emphasis mt-4 mb-2">
                        Contrasenya
                      </div>
                      <v-text-field
                        v-model="user.contrassenya"
                        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="visible ? 'text' : 'password'"
                        density="compact"
                        placeholder="Introduce tu contraseña"
                        :rules="[(v) => !!v || 'Aquest camp és obligatori']"
                        prepend-inner-icon="mdi-lock-outline"
                        variant="outlined"
                        @click:append-inner="visible = !visible"
                      ></v-text-field>

                      <v-row justify="center" class="mt-4">
                        <v-btn
                          color="#FF8F00"
                          size="large"
                          variant="tonal"
                          type="submit"
                          class="mr-4"
                        >
                          Log In
                        </v-btn>
                        <v-btn size="large" tile outlined @click="step++">
                          Sign Up
                        </v-btn>
                      </v-row>

                      <v-alert
                        v-if="errorMessage"
                        type="error"
                        class="mt-3"
                      >
                        {{ errorMessage }}
                      </v-alert>
                    </v-form>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-window-item>

           <v-window-item :value="2">
              <v-row justify="center">
                <v-col cols="12" sm="10">
                  <v-card-text>
                    <v-btn
                      class="ma-2"
                      color="amber-darken-3"
                      @click="step--"
                    >
                      <v-icon icon="mdi-arrow-left" start></v-icon>
                    </v-btn>
                    <h2 class="text-center mb-6">Crea un compte</h2>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="text-subtitle-1 text-medium-emphasis mb-2">
                          Nom
                        </div>
                        <v-text-field
                          v-model="user.nom"
                          density="compact"
                          placeholder="Nom"
                          :rules="[(v) => !!v || 'Aquest camp és obligatori']"
                          prepend-inner-icon="mdi-account-outline"
                          variant="outlined"
                        />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-subtitle-1 text-medium-emphasis mb-2">
                          Cognoms
                        </div>
                        <v-text-field
                          v-model="user.cognoms"
                          density="compact"
                          placeholder="Cognoms"
                          :rules="[(v) => !!v || 'Aquest camp és obligatori']"
                          prepend-inner-icon="mdi-account-outline"
                          variant="outlined"
                        />
                      </v-col>
                    </v-row>

                    <div class="text-subtitle-1 text-medium-emphasis mt-4 mb-2">
                      Email
                    </div>
                    <v-text-field
                      v-model="user.email"
                      density="compact"
                      placeholder="email@example.com"
                      :rules="[(v) => !!v || 'Aquest camp és obligatori']"
                      prepend-inner-icon="mdi-email-outline"
                      variant="outlined"
                    />

                    <div class="text-subtitle-1 text-medium-emphasis mt-4 mb-2">
                      Contrasenya
                    </div>
                    <v-text-field
                      v-model="user.contrassenya"
                      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                      :type="visible ? 'text' : 'password'"
                      density="compact"
                      placeholder="Insereix contrasenya"
                      :rules="[(v) => !!v || 'Aquest camp és obligatori']"
                      prepend-inner-icon="mdi-lock-outline"
                      variant="outlined"
                      @click:append-inner="visible = !visible"
                    />

                    <v-btn
                      color="#FF8F00"
                      size="large"
                      variant="tonal"
                      type="submit"
                      class="mt-4"
                      block
                      @click="handleRegister"
                    >
                      Sign up
                    </v-btn>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from "vue";
import { callPostProf, callGetProf,callGetClasseFormaPart } from "@/services/communicationManager";
import { useRouter } from "vue-router";
const router = useRouter();
import { useSessionStore } from "@/stores/sessionStore"; 
import { useUserStore } from "@/stores/userStore"; 

const step = ref(1);

const user = reactive({
  nom: "",
  cognoms: "",
  email: "",
  contrassenya: "",
});

const visible = ref(false);
const errorMessage = ref("");
const sessionStore = useSessionStore();
const emailStore = useUserStore();
const identifierPlaceholder = "email@example.com";
const passwordPlaceholder = "Insereix contrasenya";

function esProfe(email) {
    const teNumeros = /\d/;
    return !teNumeros.test(email);
}

async function teClasse(email) {
    try {
        const obj = await callGetClasseFormaPart(email);
        const data = JSON.stringify(obj);

        console.log("Data received in teClasse:", data);

        if (data.includes("null")) {
            console.log(" data is null");
            return false;
        }
                console.log("data not null")
        return true;
    } catch (error) {
        console.error("Error in teClasse:", error);
        return false;
    }
}

async function handleLogin() {
    try {
        const data = await callGetProf(user.email, user.contrassenya);

        if (data && data.sessionId) {
            sessionStore.setSessionId(data.sessionId);
            sessionStore.setUserId(data.tutorId || data.alumneId);
            emailStore.setEmail(user.email);
            emailStore.setName(user.nom);
            const email = user.email;
            const esProfeCheck = esProfe(email);
            const teClasseCheck = await teClasse(email); 

            if (esProfeCheck && teClasseCheck) {
                console.log("PROFE Y CON CLASE");
                router.push("/classProf");
              } else if (esProfeCheck && !teClasseCheck) {
                console.log("Ets user, però no formes part de cap classe.");
                router.push("/formProfe");
            } else if (!esProfeCheck && !teClasseCheck) {
                console.log("ALUMNO Y SIN CLASE");
                router.push("/codeClass");
            } else {
                console.log("ALUMNO Y CON CLASE");
                router.push("/classAlum")
              }
        } else {
            errorMessage.value = "Email o contrassenya incorrectes.";
        }
    } catch (error) {
        errorMessage.value = "Error al iniciar sessió. Si us plau, torna a intentar-ho.";
        console.error("Error al iniciar sessió:", error);
    }
}

async function handleRegister() {
  if (
    !user.nom ||
    !user.cognoms ||
    !user.email ||
    !user.contrassenya
  ) {
    alert("Si us plau, omple tos els camps.");
    return;
  }

  try {
    const response = await callPostProf(user);
    if (response.error == "Usat."){
      alert("Correu en ús.");
    } else {
      console.log("Usuari registrat correctament:", response);
      step.value = 1;
    }
  } catch (error) {
    console.error("Error durant el registre:", error);
  }
}
</script>

<style scoped>
</style>
