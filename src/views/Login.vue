<template>
  <div class="home">
    <navbar />
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import navbar from "@/components/navbar.vue";

export default {
  name: "Login",
  components: {
    HelloWorld,
    navbar,
  },
};
</script>
