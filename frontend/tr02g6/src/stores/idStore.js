import { defineStore } from 'pinia';

export const useIdStore = defineStore('auth', {
  state: () => ({
    sessionId: null, 
  }),
  actions: {
    setSessionId(id) {
      this.sessionId = id;
    },
    clearSessionId() {
      this.sessionId = null;
    },
  },
});
