<template>
  <v-container>
    <v-row justify-align="center" >
      <v-col cols="12" sm="10">
        <v-card class="elevation-6 mt-10">
          <v-window v-model="step">
            <!-- Paso 1: Login -->
            <v-window-item :value="1">
              <v-row>
                <v-col cols="12" md="6">
                  <v-card-text class="mt-12">
                    <slot name="logo">
                      <v-img
                        class="mx-auto"
                        max-width="228"
                        src="https://icones.pro/wp-content/uploads/2021/02/icone-utilisateur-bleu.png"
                      ></v-img>
                    </slot>
                    <v-form @submit.prevent="handleLogin" ref="form">
                      <v-card
                        class="mx-auto pa-12 pb-8"
                        elevation="8"
                        max-width="448"
                        rounded="lg"
                      >
                        <div class="text-subtitle-1 text-medium-emphasis">
                          Email
                        </div>
                        <v-text-field
                          v-model="professor.email"
                          density="compact"
                          :placeholder="identifierPlaceholder"
                          :rules="[(v) => !!v || 'Aquest camp és obligatori']"
                          prepend-inner-icon="mdi-email-outline"
                          variant="outlined"
                        ></v-text-field>

                        <div
                          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
                        >
                          Contrasenya
                        </div>

                        <v-text-field
                          v-model="professor.contrasenya"
                          :append-inner-icon="
                            visible ? 'mdi-eye-off' : 'mdi-eye'
                          "
                          :type="visible ? 'text' : 'password'"
                          density="compact"
                          :placeholder="passwordPlaceholder"
                          :rules="[(v) => !!v || 'Aquest camp és obligatori']"
                          prepend-inner-icon="mdi-lock-outline"
                          variant="outlined"
                          @click:append-inner="visible = !visible"
                        ></v-text-field>

                        <v-btn
                          block
                          class="mb-8"
                          color="blue"
                          size="large"
                          variant="tonal"
                          type="submit"
                        >
                          Log In
                        </v-btn>

                        <v-alert v-if="errorMessage" type="error" class="mt-3">
                          {{ errorMessage }}
                        </v-alert>
                      </v-card>
                    </v-form>
                  </v-card-text>
                </v-col>
                <v-col cols="12" md="6" class="blue rounded-bl-xl">
                  <div style="text-align: center; padding: 180px 0">
                    <v-card-text class="white--text">
                      <h3 class="text-center">Encara no tens un compte?</h3>
                    </v-card-text>
                    <div class="text-center">
                      <v-btn tile outlined dark @click="step++">SIGN UP</v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Paso 2: Registro -->
            <v-window-item :value="2">
              <v-row>
                <v-col cols="12" md="6" class="blue rounded-br-xl">
                  <div style="text-align: center; padding: 180px 0">
                    <v-card-text class="white--text">
                      <h3 class="text-center">Ja tens un compte?</h3>
                    </v-card-text>
                    <div class="text-center">
                      <v-btn tile outlined dark @click="step--">Log in</v-btn>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card-text class="mt-3">
                    <h4 class="text-center">Crea un compte</h4>
                    <v-spacer class="ma-7"></v-spacer>
                    <v-row justify-align="center">
                      <v-col cols="12" sm="8">
                        <v-row>
                          <!-- Nombre -->
                          <v-col cols="12" sm="6">
                            <div class="text-subtitle-1 text-medium-emphasis">
                              Nom
                            </div>
                            <v-text-field
                              v-model="professor.nom"
                              density="compact"
                              :placeholder="'Nom'"
                              :rules="[
                                (v) => !!v || 'Aquest camp és obligatori',
                              ]"
                              prepend-inner-icon="mdi-account-outline"
                              variant="outlined"
                              class="mt-4"
                            />
                          </v-col>
                          <v-col cols="12" sm="6">
                            <div class="text-subtitle-1 text-medium-emphasis">
                              Cognoms
                            </div>
                            <v-text-field
                              v-model="professor.cognoms"
                              density="compact"
                              :placeholder="'Cognoms'"
                              :rules="[
                                (v) => !!v || 'Aquest camp és obligatori',
                              ]"
                              prepend-inner-icon="mdi-account-outline"
                              variant="outlined"
                              class="mt-4"
                            />
                          </v-col>
                        </v-row>

                        <div class="text-subtitle-1 text-medium-emphasis">
                          Email
                        </div>
                        <v-text-field
                          v-model="professor.email"
                          density="compact"
                          :placeholder="'email@example.com'"
                          :rules="[(v) => !!v || 'Aquest camp és obligatori']"
                          prepend-inner-icon="mdi-email-outline"
                          variant="outlined"
                          class="mt-4"
                        />

                        <div class="text-subtitle-1 text-medium-emphasis">
                          Contrasenya
                        </div>
                        <v-text-field
                          v-model="professor.contrassenya"
                          :append-inner-icon="
                            visible ? 'mdi-eye-off' : 'mdi-eye'
                          "
                          :type="visible ? 'text' : 'password'"
                          density="compact"
                          :placeholder="'Insereix contrasenya'"
                          :rules="[(v) => !!v || 'Aquest camp és obligatori']"
                          prepend-inner-icon="mdi-lock-outline"
                          variant="outlined"
                          class="mt-4"
                          @click:append-inner="visible = !visible"
                        />

                        <v-btn
                          class="mb-5"
                          color="blue"
                          dark
                          block
                          tile
                          @click="handleRegister"
                        >
                          Sign up
                        </v-btn>
                      </v-col>
                    </v-row>
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
import { callPostProf, callGetProf } from "@/services/communicationManager";
import { useRouter } from "vue-router";
import { useSessionStore } from "@/stores/sessionStore"; 
const step = ref(1);

const professor = reactive({
  nom: "",
  cognoms: "",
  email: "",
  contrassenya: "",
});

const visible = ref(false);
const errorMessage = ref("");
const router = useRouter();

const identifierPlaceholder = "email@example.com";
const passwordPlaceholder = "Insereix contrasenya";

async function handleLogin() {
  try {
    const data = await callGetProf(professor.email, professor.contrasenya);
    if (data && data.sessionId) {
      const sessionStore = useSessionStore(); 
      sessionStore.setSessionId(data.sessionId); 
      router.push("/home");
    } else {
      errorMessage.value = "Email o contrasenya incorrectes.";
    }
  } catch (error) {
    errorMessage.value = "Error al iniciar sessió. Si us plau, torna a intentar-ho.";
    console.error("Error al iniciar sessió:", error);
  }
}

async function handleRegister() {
  if (
    !professor.nom ||
    !professor.cognoms ||
    !professor.email ||
    !professor.contrassenya
  ) {
    alert("Si us plau, omple tos els camps.");
    return;
  }

  try {
    const response = await callPostProf(professor);
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
.v-application .rounded-bl-xl {
  border-bottom-left-radius: 300px !important;
}
.v-application .rounded-br-xl {
  border-bottom-right-radius: 300px !important;
}
</style>
