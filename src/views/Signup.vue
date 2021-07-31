<template>
  <div class="signup">
    <navbar />
    <h1>Signup Page</h1>
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
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src
import navbar from "@/components/navbar.vue";

export default {
  name: "Signup",
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
    submit(form) {
      console.log("submitting");
      this.$store.dispatch("createNewUser", this.form);
    },
  },
};
</script>
