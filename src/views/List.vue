<template>
  <div class="List">
    <navbar />
    <h1>List Page</h1>
    <div
      v-for="availableBin in availableBins"
      :key="availableBin.id"
      class="bin-list"
    >
      <div>id: {{ availableBin.id }}</div>
      <div>x: {{ availableBin.location_x }}</div>
      <div>y: {{ availableBin.location_y }}</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import navbar from "@/components/navbar.vue";
import { fb_db } from "../firebase.js";

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
    getSharedBins() {
      console.log("getting shared bins");
      fb_db
        .collection("sharedBins")
        .get()
        .then((sharedBins) => {
          sharedBins.forEach((sharedBin) => {
            // set info for each bin
            let curBin = {
              id: sharedBin.id,
              location_x: sharedBin.data().location_x,
              location_y: sharedBin.data().location_y,
            };
            // push bin to the list of bins
            this.availableBins.push(curBin);
            console.log("sharedBin ID:", sharedBin.id);
            console.log("sharedBin.data():", sharedBin.data());
          });
        })
        .catch((error) => {
          console.log("error getting shared bins:", error);
        });
    },
  },
  mounted() {
    this.getSharedBins();
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
