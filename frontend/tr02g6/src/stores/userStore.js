import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    email: null,
    nom : null,
  }),
  actions: {
    setEmail(email) {
      this.email = email;
    },
    setName(nom) {
      this.nom = nom;
    },
    clearEmail() {
      this.email = null;
    },
  },
});
