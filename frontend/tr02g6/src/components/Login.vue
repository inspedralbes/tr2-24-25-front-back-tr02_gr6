<template>
    <div  justify="center" class="align-center justify-center">
        <slot name="logo">
      <v-img
        class="mx-auto"
        max-width="228"
        src="https://icones.pro/wp-content/uploads/2021/02/icone-utilisateur-bleu.png"
      ></v-img>
        </slot>
  
        <v-form @submit.prevent="submitLogin()" ref="form">  
      <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
      >

      <!-- <div class="text-subtitle-1 text-medium-emphasis">Institut</div>
  
        <v-text-field
                v-model="institut"
          density="compact"
          :placeholder="buscarInstitut"
          :rules="[v => !!v || 'Item is required']"
          prepend-inner-icon="mdi-city"
          variant="outlined"
        ></v-text-field>
        <v-btn class="ma-5" 
        block
          color="blue"
          size="large"
          variant="tonal"
          height="50"
          min-width="50"
        >CERCA INSTITUT</v-btn> -->


        <div class="text-subtitle-1 text-medium-emphasis">Email</div>
  
        <v-text-field
                v-model="identifier"
          density="compact"
          :placeholder="identifierPlaceholder"
          :rules="[v => !!v || 'Item is required']"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
        ></v-text-field>
  
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Contrasenya
  
         
        </div>
  
        <v-text-field
                v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          :placeholder="passwordPlaceholder"
          :rules="[v => !!v || 'Item is required']"
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
      </v-card>
        </v-form>
    </div>
  </template>
  <script setup>

import { ref, onMounted } from "vue";
  
      defineProps({
          identifierPlaceholder: {
              type: String,
              default: 'email@example.com',
          },
          passwordPlaceholder: {
              type: String,
              default: 'Insereix contrasenya',
          }, buscarInstitut: {
              type: String,
              default: 'Institut',
          }
      })
  
      const emits = defineEmits(['submit-login'])
  
       const visible =  ref(false)
       const form = ref(null)
  
       const identifier = ref('')
       const password = ref('')
  
       const submitLogin = async () => {
  
          const { valid } = await form.value.validate()
  
          if (valid) {
              emits('submit-login', { identifier: identifier.value, password: password.value })
          }
       }
  </script>
  <style scoped>
  </style>