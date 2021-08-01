<template>
  <div id="content-div" class="Map">
    <navbar />
    <h1>Map Page</h1>
    <div>{{ user }}</div>
    <div id="viewDiv"></div>
    <button type="button" @click.prevent="getSuggestion">suggest</button>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import Map from "@arcgis/core/Map";
import config from "@arcgis/core/config";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import Locate from "@arcgis/core/widgets/Locate";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Search from "@arcgis/core/widgets/Search";
import Directions from "@arcgis/core/widgets/Directions";
import navbar from "@/components/navbar.vue";
import Locator from "@arcgis/core/tasks/Locator";
import * as locator from "@arcgis/core/rest/locator";

export default {
  name: "Map",
  components: { navbar },
  data() {
    return {
      apiKey:
        "AAPKa09ed67007b84a9a8cd572139da0a689O0dITAAlfUUMdMrMSBgatyDl2TipCPnZDJvzAsB6V-i4OjcVl_TAgvueLx5DqiwM",
      geocodeUrl:
        "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
      graphicsLayer: {},
    };
  }, // end data
  methods: {
    // call to suggest api, get the magic key then forward to the findAddressCandidates API
    getSuggestion() {
      console.log("getting suggest");
      let params = { text: this.user.address };
      locator
        .suggestLocations(this.geocodeUrl, params)
        .then((response) => {
          console.log(response[0]);
          this.findAddress(response[0].magicKey);
        })
        .catch((error) => {
          console.log("Error with Suggest:", error);
        });
    },
    searchAddress() {
      console.log("searching address...");
      Search.search(this.user.address)
        .then((response) => {
          console.log("search response:", response);
        })
        .catch((error) => {
          console.log("search error:", error);
        });
    },
    findAddress(magicKeyIn) {
      let params = {
        magicKey: magicKeyIn,
      };
      let findAddressUrl = this.geocodeUrl + "/findAddressCandidates?";
      findAddressUrl += "f=pjson&" + "magicKey=" + magicKeyIn;
      console.log("findAddressUrl:", findAddressUrl);
      axios
        .get(findAddressUrl)
        .then((response) => {
          console.log("findAddress response:", response.data.candidates[0]);
          console.log("location:", response.data.candidates[0].location);
        })
        .catch((error) => {
          console.log("findAddress error:", error);
        });
    },
    getLocation(magicKeyIn) {
      console.log("getting location, magicKey", magicKeyIn);
      let params = {
        magicKey: magicKeyIn,
      };
      locator
        .addressesToLocations(this.geocodeUrl, params)
        .then((response) => {
          console.log("location response:", response);
        })
        .catch((error) => {
          console.log("error getting location:", error);
        });
    },
    getSharedBins() {
      console.log("getting shared bins");
    },
    shareMyBin() {
      console.log("sharing bin");
    },
  }, // end methods
  mounted() {
    config.apiKey = this.apiKey;

    const map = new Map({
      basemap: "arcgis-topographic", // Basemap layer service
    });
    // create div to put the map in
    // let viewDiv = document.createElement("div");
    // viewDiv.id = "viewDiv";
    // document.querySelector("#content-div").appendChild(viewDiv);

    const view = new MapView({
      map: map,
      center: [-149.961251, 61.193971], // Longitude, latitude
      zoom: 16, // Zoom level
      container: "viewDiv", // Div element
    }); // end view

    // SEARCH
    const search = new Search({
      view: view,
    }); // end search
    view.ui.add(search, "top-right");
    search.on("search-complete", (event) => {
      console.log("search results:", event);
    });

    // // DIRECTIONS
    // const directionsWidget = new Directions({
    //   view: view,
    // });
    // view.ui.add(directionsWidget, {
    //   position: "bottom-left",
    //   index: 2,
    // });

    this.graphicsLayer = new GraphicsLayer();
    map.add(this.graphicsLayer);

    // points array
    // const points = [
    //   {
    //     //Create a point
    //     type: "point",
    //     longitude: -149.961251,
    //     latitude: 61.193971,
    //   },
    //   {
    //     //Create a point
    //     type: "point",
    //     longitude: -149.963729,
    //     latitude: 61.194617,
    //   },
    // ]; // end points array

    const simpleMarkerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40], // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 1,
      },
    };
    // picture marker symbol
    // let pictureSymbol = {
    //   type: "picture-marker", // autocasts as new PictureMarkerSymbol()
    //   url: "https://raw.githubusercontent.com/rjamesak/assets/master/trash-can.svg",
    //   width: "24px",
    //   height: "24px",
    // };

    // loop the points array and
    // add the points to the graphic layer
    // points.forEach((point) => {
    //   const pointGraphic = new Graphic({
    //     geometry: point,
    //     symbol: pictureSymbol,
    //   });
    //   graphicsLayer.add(pointGraphic);
    // });

    const locate = new Locate({
      view: view,
      useHeadingEnabled: false,
      goToOverride: function (view, options) {
        options.target.scale = 1500;
        return view.goTo(options.target);
      },
    });
    view.ui.add(locate, "top-left");
  }, // end mounted
  computed: {
    user() {
      return this.$store.state.userProfile;
    },
  }, // end computed
};
</script>

<style scoped lang="scss">
@import url("https://js.arcgis.com/4.20/@arcgis/core/assets/esri/themes/dark/main.css");

#viewDiv {
  padding: 0;
  margin: 0;
  height: 95vh;
  width: 95vw;
}
</style>