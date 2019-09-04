<template>
  <div>Bar
    <button @click='clickMe'>Click me</button>
    <div>{{ this.$store.state.name }}</div>
  </div>
</template>
<script>
export default {
  name: 'Bar',

  mounted() {
    this.$store.dispatch('change_name')
  },

  asyncData (store) {
    console.log('server');
    return store.dispatch('change_name');
  },

  methods: {
    clickMe () {
      alert('Click me')
    }
  }
}
</script>
