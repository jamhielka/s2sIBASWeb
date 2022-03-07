export default {
    state: {
      draw: {},
    },
  
    mutations: {
      setDrawDetails(state, payload) {
        state.draw = payload;
      }
    },
  
    actions: {
      addDrawDetails: (context, payload) => {
        context.commit('setDrawDetails',  payload)
      }
    },
    
    getters: {
      getDrawDetails: state => state.draw
    },
  }