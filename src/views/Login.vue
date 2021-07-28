<template>
  <div class="home">
    <navbar />
    <img alt="Vue logo" src="../assets/logo.png" />
    <form @submit.prevent="submit">
      <label for="email-input">Email</label>
      <input type="email" name="email" id="email-input" v-model="form.email" />
      <label for="password-input">Password</label>
      <input
        type="password"
        name="password"
        id="password-input"
        v-model="form.password"
      />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src
import navbar from "@/components/navbar.vue";

export default {
  name: "Login",
  components: {
    navbar,
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    submit(form) {
      console.log("submitting!!");
      this.$store.dispatch("login", this.form);
      // console.log("store stuff", this.$store.state.userProfile.name);
    },
  },
};
</script>
