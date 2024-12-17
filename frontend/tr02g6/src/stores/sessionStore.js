import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', {
  state: () => ({
    sessionId: localStorage.getItem('sessionId') || null, 
    userId: localStorage.getItem('userId') || null,
  }),
  actions: {
    setSessionId(id) {
      this.sessionId = id;
      localStorage.setItem('sessionId', id); 

    },
    setUserId(userId) {
      this.userId = userId;
      localStorage.setItem('userId', userId); 
    },
    clearSessionId() {
      this.sessionId = null;
      localStorage.removeItem('sessionId'); 
    },
    clearUserId() {
      this.userId = null;
      localStorage.removeItem('userId');
    },
  },
});
