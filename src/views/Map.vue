<template>
  <div id="content-div" class="Map">
    <navbar />
    <h1>Map Page</h1>
    <div>{{ user }}</div>
    <div id="viewDiv"></div>
    <button v-if="user.sharing" type="button" @click.prevent="unshareMyBin">
      Stop Sharing My Bin
    </button>
    <button v-else type="button" @click.prevent="shareMyBin">
      Share My Bin
    </button>
    <button @click.prevent="getSharedBins">get shared bins</button>
    <button @click.prevent="getSharedBinsWIP">get shared bins WIP</button>
    <button @click.prevent="getSharedBinsFromUsers">
      get shared bins from users
    </button>
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
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Search from "@arcgis/core/widgets/Search";
import Directions from "@arcgis/core/widgets/Directions";
import navbar from "@/components/navbar.vue";
import Locator from "@arcgis/core/tasks/Locator";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import * as locator from "@arcgis/core/rest/locator";
import { getSuggestion, getAddressLocation } from "/services.js";
import { fb_db, fb_users } from "../firebase.js";

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
      binsLayer: new FeatureLayer({
        source: [],
        objectIdField: "ObjectID",
        fields: [
          {
            name: "ObjectID",
            type: "oid",
          },
          {
            name: "binID",
            type: "string",
          },
          {
            name: "address",
            type: "string",
          },
        ],
        geometryType: "point",
        popupEnabled: true,
        popupTemplate: {
          // ultimately want this to be the address
          title: "Available Bin",
          defaultPopupTemplateEnabled: true,
          content: [
            {
              type: "fields",
              fieldInfos: [
                // add the fields to display
                {
                  fieldName: "address",
                  label: "Address:",
                },
              ],
            },
          ],
          // put the fields here that should be displayed
          outFields: ["address"],
        },
      }),

      binRenderer: new SimpleRenderer({
        type: "simple",
        symbol: {
          type: "picture-marker", // autocasts as new PictureMarkerSymbol()
          url: "https://raw.githubusercontent.com/rjamesak/assets/master/trash-can.svg",
          width: "24px",
          height: "24px",
        },
      }),
    };
  }, // end data
  methods: {
    async getMagicKey() {
      let magicKey = "";
      try {
        const returnedKey = await getSuggestion(this.user.address);
        console.log("magicKey:", magicKey);
        magicKey = returnedKey;
      } catch (error) {
        console.log("error getting magic key:", error);
      }
      // get address location
      try {
        const location = await getAddressLocation(magicKey);
        console.log("location:", location);
      } catch (error) {
        console.log("error getting location:", error);
      }
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
      fb_db
        .collection("sharedBins")
        .get()
        .then((sharedBins) => {
          sharedBins.forEach((sharedBin) => {
            const point = {
              type: "point",
              longitude: sharedBin.data().location_x,
              latitude: sharedBin.data().location_y,
            };
            const pointGraphic = new Graphic({
              geometry: point,
              symbol: this.pictureSymbol,
            });
            this.graphicsLayer.add(pointGraphic);
            console.log("sharedBin ID:", sharedBin.id);
            console.log("sharedBin.data():", sharedBin.data());
          });
        })
        .catch((error) => {
          console.log("error getting shared bins:", error);
        });
    },
    getSharedBinsFromUsers() {
      let features = [];
      console.log("getting shared bins from users");
      // move this fb call to external function
      fb_db
        .collection("users")
        .where("sharing", "==", true)
        .get()
        .then((users) => {
          users.forEach((user) => {
            // get the bin data and create a point for it
            const feature = {
              geometry: {
                type: "point",
                longitude: user.data().location_x,
                latitude: user.data().location_y,
              },
              attributes: {
                // ObjectID: user.id, // this is not working
                binID: user.id,
                address: user.data().address,
              },
            };
            console.log("sharedBin ID:", user.id);
            console.log("user.data():", user.data());
            // add feature to features array
            features.push(feature);
          }); // end forEach
          // add features array to the feature layer
          console.log("features:", features);
          this.binsLayer.source = features;
          // add renderer to the feature layer
          this.binsLayer.renderer = this.binRenderer;
          // add feature layer to the map
          this.map.add(this.binsLayer);
        })
        .catch((error) => {
          console.log("error getting shared bins:", error);
        });
    },
    getSharedBinsWIP() {
      let features = [];
      console.log("getting shared bins");
      // move this fb call to external function
      fb_db
        .collection("sharedBins")
        .get()
        .then((sharedBins) => {
          sharedBins.forEach((sharedBin) => {
            // get the bin data and create a point for it
            const feature = {
              geometry: {
                type: "point",
                longitude: sharedBin.data().location_x,
                latitude: sharedBin.data().location_y,
              },
              attributes: {
                ObjectID: sharedBin.id, // this is not working
                binID: sharedBin.id,
              },
            };
            console.log("sharedBin ID:", sharedBin.id);
            console.log("sharedBin.data():", sharedBin.data());
            // add feature to features array
            features.push(feature);
          }); // end forEach
          // add features array to the feature layer
          console.log("features:", features);
          // get feature layer
          // let binsLayer = this.makeFeatureLayer();
          // console.log("bins layer:", binsLayer);
          this.binsLayer.source = features;
          // add renderer to the feature layer
          this.binsLayer.renderer = this.binRenderer;
          // add feature layer to the map
          this.map.add(this.binsLayer);
        })
        .catch((error) => {
          console.log("error getting shared bins:", error);
        });
    },
    async shareMyBin() {
      console.log("sharing bin");
      // call store to update share status to true
      let user = this.user;
      user.sharing = true;
      const response = await this.$store.dispatch("setSharingStatus", user);
      console.log("response from sharing:", response);
      this.addBinToList();
    },
    addBinToList() {
      fb_db
        .collection("sharedBins")
        .doc(this.user.uid)
        .set({
          location_x: this.user.location_x,
          location_y: this.user.location_y,
        })
        .then((response) => {
          console.log("add bin to list response:", response);
        })
        .catch((error) => {
          console.log("error adding bin:", error);
        });
    },
    async unshareMyBin() {
      let user = this.user;
      user.sharing = false;
      const response = await this.$store.dispatch("setSharingStatus", user);
      console.log("response from unsharing call:", response);
      this.removeBinFromList();
    },
    removeBinFromList() {
      fb_db
        .collection("sharedBins")
        .doc(this.user.uid)
        .delete()
        .then(() => {
          console.log("deleted!!");
        })
        .catch((error) => {
          console.log("error deleting:", error);
        });
    },
    makeFeatureLayer() {
      let featLayer = new FeatureLayer({
        source: [],
        objectIdField: "ObjectID",
        fields: [
          {
            name: "ObjectID",
            type: "oid",
          },
          {
            name: "binID",
            type: "string",
          },
        ],
        geometryType: "point",
      });
      return featLayer;
    },
  }, // end methods
  mounted() {
    config.apiKey = this.apiKey;

    this.map = new Map({
      basemap: "arcgis-topographic", // Basemap layer service
    });

    const view = new MapView({
      map: this.map,
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
    this.map.add(this.graphicsLayer);

    // create point for user's location
    let userPoint = {};
    if (this.user.location_x) {
      userPoint = {
        type: "point",
        longitude: this.user.location_x,
        latitude: this.user.location_y,
      };
    }

    const simpleMarkerSymbol = {
      type: "simple-marker",
      color: [226, 119, 40], // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 1,
      },
    };
    // picture marker symbol
    this.pictureSymbol = {
      type: "picture-marker", // autocasts as new PictureMarkerSymbol()
      url: "https://raw.githubusercontent.com/rjamesak/assets/master/trash-can.svg",
      width: "24px",
      height: "24px",
    };

    // add user point to graphic layer
    const userPointGraphic = new Graphic({
      geometry: userPoint,
      symbol: simpleMarkerSymbol,
    });
    this.graphicsLayer.add(userPointGraphic);

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