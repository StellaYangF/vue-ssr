import VueRouter from 'vue-router';
import Vue from 'vue';
import Foo from './components/Foo';
import Bar from './components/Bar';

Vue.use(VueRouter);

export default () => {
  let router = new VueRouter({
    mode: 'history',
    routes: [
      { path: '/', component: Foo, },
      { path: '/bar', component: Bar, }
    ]
  });
  return router;
}