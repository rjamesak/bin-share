<template>
  <div class="List">
    <navbar />
    <h1>List Page</h1>
    <div
      v-for="(availableBin, index) in availableBins"
      :key="availableBin.id"
      class="bin-list"
    >
      <div>address: {{ availableBin.address }}</div>
      <div>id: {{ availableBin.id }}</div>
      <div class="longitude">x: {{ availableBin.location_x }}</div>
      <div class="latitude">y: {{ availableBin.location_y }}</div>
      <button type="button" @click.prevent="getDirections(index)">
        Go Here!
      </button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import navbar from "@/components/navbar.vue";
import { fb_db, getSharedBins } from "../firebase.js";
import axios from "axios";

export default {
  name: "List",
  components: {
    navbar,
  },
  data() {
    return {
      availableBins: [],
    };
  },
  methods: {
    addBinsToList(sharedBins) {
      sharedBins.forEach((sharedBin) => {
        // set info for each bin
        let curBin = {
          address: sharedBin.data().address,
          id: sharedBin.id,
          location_x: sharedBin.data().location_x,
          location_y: sharedBin.data().location_y,
        };
        // push bin to the list of bins
        this.availableBins.push(curBin);
        console.log("sharedBin ID:", sharedBin.id);
        console.log("sharedBin.data():", sharedBin.data());
      });
    },
    async getDirections(index) {
      // get the lat/long of the clicked box
      let endLat = this.availableBins[index].location_y;
      let endLong = this.availableBins[index].location_x;
      let startLat = this.user.location_y;
      let startLong = this.user.location_x;
      // call the service
      let response = await axios.get(
        `https://bing-maps.herokuapp.com/gps/${startLat}/${startLong}/${endLat}/${endLong}`
      );
      // parse the xml data
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(response.data, "text/xml");
      let instructions = xmlDoc.querySelectorAll("Instruction");
      instructions.forEach((instruction) => {
        console.log(instruction.textContent);
      });
    },
  }, // end methods
  async mounted() {
    // this.getSharedBins();
    let sharedBins = await getSharedBins();
    this.addBinsToList(sharedBins);
  },
  computed: {
    user() {
      return this.$store.state.userProfile;
    },
  },
};
</script>
<style lang="scss" scoped>
.bin-list {
  display: flex;
  flex-direction: column;
  margin: 10px;
  outline: thin solid black;
}
</style>
