import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default () => {
  let store = new Vuex.Store({
    state: {
      name: "China"
    },
    mutations: {
      change_name(state) {
        state.name = "中国";
      }
    },
    actions: {
      change_name({ commit }) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            commit("change_name");
            resolve();
          }, 1000);
        });
      }
    }
  });

  if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
  }

  return store;
};
