import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    email: localStorage.getItem('email') || null, 
    nom: localStorage.getItem('nom') || null,
  }),
  actions: {
    setEmail(email) {
      this.email = email;
      localStorage.setItem('email', email); 

    },
    setName(nom) {
      this.nom = nom;
      localStorage.setItem('nom', nom); 
      localStorage.setItem('nom', nom); 
    },
    clearEmail() {
      this.email = null;
      localStorage.removeItem('email'); 
    },
    clearNom() {
      this.nom = null;
      localStorage.removeItem('nom'); 
    },
  },
});
