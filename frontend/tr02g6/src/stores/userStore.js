import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    email: null, // Estado para almacenar el correo del usuario
  }),
  actions: {
    setEmail(email) {
      this.email = email;
    },
    clearEmail() {
      this.email = null;
    },
  },
});
