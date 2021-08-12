<template>
  <div class="List">
    <navbar />
    <h1>List Page</h1>
    <div
      v-for="(availableBin, index) in availableBins"
      :key="availableBin.id"
      class="bin-list"
    >
      <div>Address: {{ availableBin.address }}</div>
      <div v-for="direction in availableBin.directions">{{ direction }}</div>
      <button type="button" @click.prevent="getDirections($event, index)">
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
          directions: [],
          location_x: sharedBin.data().location_x,
          location_y: sharedBin.data().location_y,
        };
        // push bin to the list of bins
        this.availableBins.push(curBin);
        console.log("sharedBin ID:", sharedBin.id);
        console.log("sharedBin.data():", sharedBin.data());
      });
    },
    async getDirections(event, index) {
      if (this.availableBins[index].directions.length > 0) return;
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
      instructions.forEach((instruction, dirIndex) => {
        console.log(instruction.textContent);
        this.availableBins[index].directions.push(instruction.textContent);
      });
      console.log(event.target.parentNode);
      // this.addDirectionsToDom(event.target.parentNode, instructions);
    },
    addDirectionsToDom(element, directions) {
      directions.forEach((direction, index) => {
        let newDiv = document.createElement("div");
        newDiv.textContent = direction.textContent;
        element.appendChild(newDiv);
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
button {
  max-width: 300px;
  margin: auto;
}
</style>
