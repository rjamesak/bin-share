<template>
  <div class="home">
    <div v-if="isLoading" class="loading-div">
      <vue-spinner />
    </div>
    <div v-else class="content-div">
      <navbar />
      <img alt="Vue logo" src="../assets/logo.png" />
      <form @submit.prevent="submit" class="form-items">
        <label for="email-input">Email</label>
        <input
          type="email"
          name="email"
          id="email-input"
          v-model="form.email"
        />
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
  </div>
</template>

<script>
// @ is an alias to /src
import navbar from "@/components/navbar.vue";
import Spinner from "vue-simple-spinner";

export default {
  name: "Login",
  components: {
    navbar,
    vueSpinner: Spinner,
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
    async submit(form) {
      console.log("submitting!!");
      console.log("store loadingStatus:", this.$store.getters.loadingStatus);
      await this.$store.dispatch("login", this.form);
      this.$router.push({ name: "Profile" });
      // console.log("store stuff", this.$store.state.userProfile.name);
    },
  },
  computed: {
    isLoading() {
      return this.$store.getters.loadingStatus;
    },
  },
};
</script>
