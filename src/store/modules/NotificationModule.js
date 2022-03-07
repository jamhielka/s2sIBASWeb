export default {
    state: {
      snackbar: false,
    },
  
    mutations: {
      setSnackbar(state, payload) {
        state.snackbar = payload;
      }
    },
  
    actions: {
      addSnackbar: ({ commit }, payload) => {
        commit('setSnackbar',  payload )
      }
    },
    
    getters: {
      getSnackbar: state => state.snackbar
    },
  }