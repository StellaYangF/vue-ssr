import Vue from 'vue';
import App from './App.vue';
import createRouter from './router.js';
import createStore from './store.js' ;

export default () => {
  let router = createRouter();
  let store = createStore();
  let app = new Vue({
    router, 
    store,
    render: h => h(App),
  });
  return { app, router, store };
}