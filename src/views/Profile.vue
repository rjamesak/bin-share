<template>
  <div class="profile">
    <navbar />
    <h1>Profile Page</h1>
    <form @submit.prevent="updateProfile" id="profile-form" class="form-items">
      <label for="email-input">Email:</label>
      <input
        type="email"
        name="email"
        id="email-input"
        v-model="form.email"
        :placeholder="user.email"
      />
      <label for="full-name">Full Name:</label>
      <input
        type="text"
        name="full-name"
        id="full-name"
        v-model="form.fullName"
        :placeholder="user.fullName"
      />
      <label for="address">Address:</label>
      <input
        type="text"
        name="address"
        id="address"
        v-model="form.address"
        :placeholder="user.address"
      />
      <label for="city">City:</label>
      <input
        type="text"
        name="city"
        id="city"
        v-model="form.city"
        :placeholder="user.city"
      />
      <button type="submit">Update Information</button>
    </form>

    <a href="" @click.prevent="signout">signout</a>
  </div>
</template>

<script>
// @ is an alias to /src
import navbar from "@/components/navbar.vue";
import { getSuggestion, getAddressLocation } from "../../services";

export default {
  name: "Profile",
  components: { navbar },
  data() {
    return {
      form: {
        fullName: null,
        email: null,
        address: null,
        city: null,
        location_x: null,
        location_y: null,
      },
    };
  },
  methods: {
    async signout() {
      console.log("signing out");
      await this.$store.dispatch("logout");
      console.log(this.$store.getters.loadingStatus);
      this.$router.push({
        name: "Login",
      });
    },
    async updateProfile() {
      // get location from address
      if (this.address !== "") {
        let magicKey = "";
        // get magic key from suggestion api
        try {
          const returnedKey = await getSuggestion(this.form.address);
          console.log("magicKey:", magicKey);
          magicKey = returnedKey;
        } catch (error) {
          console.log("error getting magic key:", error);
        }
        // get address location from findAddressCandidates
        try {
          const location = await getAddressLocation(magicKey);
          console.log("location:", location);
          this.form.location_x = location.x;
          this.form.location_y = location.y;
        } catch (error) {
          console.log("error getting location:", error);
        }
      }
      //send data to store to update
      let user = this.form;
      user.uid = this.user.uid;
      console.log("user before dispatch:", user);
      await this.$store.dispatch("updateUserProfile", user);
    },
  },
  computed: {
    user() {
      return this.$store.state.userProfile;
    },
  },
};
</script>
