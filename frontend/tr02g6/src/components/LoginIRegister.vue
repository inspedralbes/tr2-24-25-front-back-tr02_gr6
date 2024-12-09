<template>
    <v-container>
        <v-row align="center" justify="center" >
            <v-col cols="12" sm="10">
              <v-card class="elevation-6 mt-10"  >
               <v-window v-model="step">
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
  
                          
                          <v-row align="center" justify="center">
                            <v-col cols="12" sm="8">
                             
                            <v-text-field
                              label="Email"
                              outlined
                              dense
                              color="blue"
                              autocomplete="false"
                             class="mt-16"
                            />
                            <v-text-field
                              label="Contrasenya"
                              outlined
                              dense
                              color="blue"
                            autocomplete="false"
                             type="password"
                            
                            />
                              <v-row>
                                <v-col cols="12" sm="7">
                                  <v-checkbox
                         
                          label="Recorda'm-ho"
                          class="mt-n1"
                          color="blue"
                        > </v-checkbox>
                                </v-col>
                              </v-row>
                            <v-btn color="blue" dark block tile>Log in</v-btn>
                            </v-col>
                          </v-row>  
                        </v-card-text>
                      </v-col>
                      <v-col cols="12" md="6" class="blue rounded-bl-xl" >
                      <div style="  text-align: center; padding: 180px 0;">
                        <v-card-text class="white--text" >
                          <h3 class="text-center ">Encara no tens un compte?</h3>
                          
                        </v-card-text>
                        <div class="text-center">
                          <v-btn tile outlined dark @click="step++">SIGN UP</v-btn>
                        </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-window-item>
                  <v-window-item :value="2">
                    <v-row >
                      <v-col cols="12" md="6" class="blue rounded-br-xl">
                       <div style="  text-align: center; padding: 180px 0;">
                        <v-card-text class="white--text" >
                          <h3 class="text-center ">Ja tens un compte?</h3>
                          
                        </v-card-text>
                        <div class="text-center">
                          <v-btn tile outlined dark @click="step--">Log in</v-btn>
                        </div>
                        </div>
                      </v-col>
  
                      <v-col cols="12" md="6">
                        <v-card-text class="mt-3">
                          <h4
                            class="text-center"
                          >Creat un compte</h4>
                          <v-row align="center" justify="center">
                            <v-col cols="12" sm="8">
                             <v-row>
                             <v-col cols="12" sm="6">
                              <v-text-field
                              label="Nom"
                              outlined
                              dense
                              color="blue"
                              autocomplete="false"
                             class="mt-4"
                            />
                             </v-col>
                             <v-col cols="12" sm="6">
                              <v-text-field
                              label="Cognom"
                              outlined
                              dense
                              color="blue"
                              autocomplete="false"
                             class="mt-4"
                            />
                             </v-col>
                             </v-row>
                            <v-text-field
                              label="Email"
                              outlined
                              dense
                              color="blue"
                              autocomplete="false"
                            />
                            <v-text-field
                              label="Contrasenya"
                              outlined
                              dense
                              color="blue"
                            autocomplete="false"
                             type="password"
                            
                            />
                              <v-row>
                                <v-col cols="12" sm="7">
                                 <v-spacer></v-spacer>
                                </v-col>
                               
                              </v-row>
                            <v-btn class="mb-5"  color="blue" dark block tile>Sign up</v-btn>
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
  
  <script>
    
  
    export default {
     data: () => ({
      step: 1
    }),
    props: {
      source: String
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