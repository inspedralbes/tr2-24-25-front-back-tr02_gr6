import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', {
  state: () => ({
    sessionId: null,
    userId: null,
  }),
  actions: {
    setSessionId(id) {
      this.sessionId = id;
    },
    setUserId(userId) { 
      this.userId = userId;
    },
    clearSessionId() {
      this.sessionId = null;
    },
  },
});
