<template>
  <div class="profile">
    <div v-if="isLoading" class="loading-div">
      <vue-spinner />
    </div>
    <div v-else class="content-div">
      <navbar />
      <h1>Profile Page</h1>
      <img class="profile-image" src="@/assets/account_circle_black_24dp.svg" />
      <p>Please enter all information (form validation is coming soon)</p>
      <form
        @submit.prevent="updateProfile"
        id="profile-form"
        class="form-items"
      >
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
        <button class="submit-button" type="submit">Update Profile</button>
      </form>

      <a href="" @click.prevent="signout">Sign me out</a>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import navbar from "@/components/navbar.vue";
import { getSuggestion, getAddressLocation } from "../../services";
import Spinner from "vue-simple-spinner";

export default {
  name: "ProfilePage",
  components: { navbar, vueSpinner: Spinner },
  data() {
    return {
      form: {
        fullName: "",
        email: "",
        address: "",
        city: "",
        location_x: "",
        location_y: "",
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
      this.validateUserInfo(user);

      console.log("user before dispatch:", user);
      await this.$store.dispatch("updateUserProfile", user);
    },
    validateUserInfo(user) {
      // validate
      if (user.email === "") user.email = this.user.email;
      if (user.fullName === "") user.fullName = this.user.fullName;
      if (user.address === "") user.address = this.user.address;
      if (user.city === "") user.city = this.user.city;
      if (user.location_x === "") user.location_x = this.user.location_x;
      if (user.location_y === "") user.location_y = this.user.location_y;
      console.log("user after validation:", user);
    },
  },
  computed: {
    user() {
      return this.$store.state.userProfile;
    },
    isLoading() {
      return this.$store.getters.loadingStatus;
    },
  },
};
</script>
<style lang="scss">
.profile-image {
  height: 120px;
  width: 120px;
}
.content-div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
