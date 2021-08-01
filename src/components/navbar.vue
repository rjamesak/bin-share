<template>
  <div class="navbar">
    <router-link :to="{ name: 'Login' }">Login</router-link> |
    <router-link :to="{ name: 'About' }">About</router-link> |
    <router-link :to="{ name: 'Signup' }">Signup</router-link> |
    <router-link :to="{ name: 'Profile' }">Profile</router-link> |
    <router-link :to="{ name: 'Map' }">Map</router-link>
  </div>
</template>

<script>
export default {
  name: "navbar",
  data() {
    return {};
  },
  methods: {
    name() {},
  },
  props: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
