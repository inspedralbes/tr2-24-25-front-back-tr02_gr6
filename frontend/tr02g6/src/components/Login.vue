<template>
  <div justify="center" class="align-center justify-center">
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
        <div class="text-subtitle-1 text-medium-emphasis">Email</div>
        <v-text-field
          v-model="identifier"
          density="compact"
          :placeholder="identifierPlaceholder"
          :rules="[v => !!v || 'Este campo es obligatorio']"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Contraseña
        </div>

        <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          :placeholder="passwordPlaceholder"
          :rules="[v => !!v || 'Este campo es obligatorio']"
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { callGetProf } from "@/services/communicationManager";
import { useRouter } from "vue-router";

// Definir los props (por si quieres personalizar los textos)
defineProps({
  identifierPlaceholder: {
    type: String,
    default: "email@example.com",
  },
  passwordPlaceholder: {
    type: String,
    default: "Ingrese su contraseña",
  },
});

// Definir las variables reactivas
const visible = ref(false);
const identifier = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();  

const handleLogin = async () => {
  try {
    const data = await callGetProf(identifier.value, password.value);

    if (data && data.email) {
      router.push("/home");
    } else {
      errorMessage.value = "Correo o contraseña incorrectos.";
    }
  } catch (error) {
    errorMessage.value = "Error al iniciar sesión. Inténtalo más tarde.";
    console.error("Error al iniciar sesión:", error);
  }
};

</script>

<style scoped>
</style>
