<template>
  <div class="signup">
    <navbar />
    <h1>Create new account</h1>
    <form @submit.prevent="submit" class="form-items">
      <label for="email-input">Email</label>
      <input type="email" name="email" id="email-input" v-model="form.email" />
      <label for="password-input">Password</label>
      <input
        type="password"
        name="password"
        id="password-input"
        v-model="form.password"
      />
      <button class="submit-button" type="submit">Submit</button>
    </form>
    <router-link :to="{ name: 'Login' }"> Return to login page </router-link>
  </div>
</template>

<script>
// @ is an alias to /src
import navbar from "@/components/navbar.vue";

export default {
  name: "SignUp",
  components: { navbar },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async submit(form) {
      console.log("submitting");
      try {
        await this.$store.dispatch("createNewUser", this.form);
        alert("success");
        this.$router.push({ name: "Login" });
      } catch (error) {
        console.log("error:", error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>