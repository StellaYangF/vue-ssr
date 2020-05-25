<template>
  <div id='app'>App
    <Bar></Bar>
    <Foo></Foo>
    <router-link to='/'>Foo</router-link>
    <router-link to='/bar'>Bar</router-link>
    <router-view></router-view>
  </div>
</template>
<script>
import Foo from './components/Foo.vue';
import Bar from './components/Bar.vue';

export default {
  name: 'App',
  components: {
    Foo,
    Bar,
  }
}
</script>
