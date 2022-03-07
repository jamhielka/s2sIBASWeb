export default {
    state: {
      overlay: false,
    },
  
    mutations: {
      setOverlay(state, payload) {
        state.overlay = payload;
      }
    },
  
    actions: {
      addOverlay: (context, payload) => {
        context.commit('setOverlay', { payload })
      }
    },
    
    getters: {
      getOverlay: state => state.overlay
    },
  }