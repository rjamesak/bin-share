<template>
  <div id="content-div" class="Map">
    <navbar />
    <h1>Map Page</h1>
    <div id="viewDiv"></div>
    <div class="button-container">
      <button
        class="stop-share-button"
        v-if="user.sharing"
        type="button"
        @click.prevent="unshareMyBin"
      >
        Stop Sharing My Bin
      </button>
      <button
        class="share-button"
        v-else
        type="button"
        @click.prevent="shareMyBin"
      >
        Share My Bin
      </button>
    </div>
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
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import Search from "@arcgis/core/widgets/Search";
import Directions from "@arcgis/core/widgets/Directions";
import LayerList from "@arcgis/core/widgets/LayerList";
import navbar from "@/components/navbar.vue";
import Locator from "@arcgis/core/tasks/Locator";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import * as route from "@arcgis/core/rest/route";
import * as locator from "@arcgis/core/rest/locator";
import { getSuggestion, getAddressLocation } from "/services.js";
import { fb_db, fb_users, getSharedBins } from "../firebase.js";

export default {
  name: "MapView",
  components: { navbar },
  data() {
    return {
      apiKey:
        "AAPKa09ed67007b84a9a8cd572139da0a689O0dITAAlfUUMdMrMSBgatyDl2TipCPnZDJvzAsB6V-i4OjcVl_TAgvueLx5DqiwM",
      geocodeUrl:
        "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
      routeUrl:
        "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
      graphicsLayer: {},
      binsLayer: new FeatureLayer({
        title: "Shared Bins",
        source: [],
        spatialReference: { wkid: 4326 },
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
    // get the shared bins to list on the map
    async mapSharedBins() {
      let features = [];
      let users = await getSharedBins();
      users.forEach((user) => {
        // get the bin data and create a point for it
        const feature = {
          geometry: {
            type: "point",
            longitude: user.data().location_x,
            latitude: user.data().location_y,
          },
          attributes: {
            binID: user.id,
            address: user.data().address,
          },
        };
        // add feature to features array
        features.push(feature);
      }); // end forEach
      // add features array to the feature layer
      this.binsLayer.source = features;
      // add renderer to the feature layer
      this.binsLayer.renderer = this.binRenderer;
      // add feature layer to the map
      this.map.add(this.binsLayer);
    },
    async shareMyBin() {
      console.log("sharing bin");
      // call store to update share status to true
      let user = this.user;
      user.sharing = true;
      const response = await this.$store.dispatch("setSharingStatus", user);
      this.addBinToList();
      // add bin to feature layer
      this.addUserBinToFeatureLayer();
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
      // remove from the featureLayer
      this.deleteUserBinFromFeatureLayer();
    },
    removeFromFeatureLayer(featureID) {
      // query feature layer view https://developers.arcgis.com/javascript/latest/sample-code/featurelayerview-query/
      console.log("the view:", this.view);
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
    // remove the user's shared bin from the feature layer
    async deleteUserBinFromFeatureLayer() {
      let id = this.user.uid;
      let query = this.binsLayer.createQuery();
      query.where = `binID = '${id}'`;
      console.log("query.where:", query.where);
      let results = await this.binsLayer.queryFeatures(query);
      console.log("query results:", results);
      let pointToDelete = {
        deleteFeatures: results.features,
      };
      console.log("pointToDelete:", pointToDelete);
      this.updateFeatureLayer(pointToDelete);
    },
    // updates a feature layer by calling the applyEdits function
    // receives graphic object
    // {addFeatures: [{}], deleteFeatures: [{}]}
    updateFeatureLayer(points) {
      console.log("in update Feature layer, points:", points);
      this.binsLayer
        .applyEdits(points)
        .then((results) => {
          console.log("deleted points:", results.deleteFeatureResults);
          console.log("added points:", results.addFeatureResults);
        })
        .catch((error) => {
          console.log("error deleting:", error);
        });
    },
    addUserBinToFeatureLayer() {
      // create the graphic
      let point = {
        geometry: {
          type: "point",
          longitude: this.user.location_x,
          latitude: this.user.location_y,
        },
        attributes: {
          binID: this.user.uid,
          address: this.user.address,
        },
      };
      let pointToAdd = {
        addFeatures: [point],
      };
      console.log("point graphic to add", pointToAdd);

      this.updateFeatureLayer(pointToAdd);
    },
    makeLayerListWidget() {
      this.view.when(() => {
        let layerList = new LayerList({
          view: this.view,
        });
        this.view.ui.add(layerList, "bottom-left");
      });
    },
    makeLegendWidget() {
      let legend = new Legend({
        view: this.view,
        layerInfos: [
          {
            layer: this.binsLayer,
          },
        ],
      });
      this.view.ui.add(legend, "bottom-left");
    },
    addFeatureTable() {
      let featureTable = new FeatureTable({
        view: this.view,
        layer: this.binsLayer,
        container: "table-container",
      });
    },
    // WIP
    async getRoute(destination) {
      console.log("destination geom in getRoute: ", destination);
      // Symbols
      const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [200, 100, 20], // Orange
        outline: {
          color: [255, 255, 255], // White
          width: 1,
        },
      };

      let routeSymbol = {
        type: "simple-line",
        color: [0, 0, 255, 0.5],
        width: 5,
      };

      let userGeometry = {
        type: "point",
        longitude: this.user.location_x,
        latitude: this.user.location_y,
      };

      const userPointGraphic = new Graphic({
        geometry: userGeometry,
        symbol: simpleMarkerSymbol,
      });

      let destinationGraphic = new Graphic({
        geometry: {
          type: "point",
          longitude: destination.longitude,
          latitude: destination.latitude,
        },
        symbol: simpleMarkerSymbol,
      });

      // add point graphics to the graphics layer
      let routeLayer = new GraphicsLayer();
      routeLayer.add(userPointGraphic);
      routeLayer.add(destinationGraphic);

      console.log("before route params");
      const routeParams = new RouteParameters({
        stops: new FeatureSet({
          features: [],
        }),
      });

      // push the points to the route params stops
      routeParams.stops.features.push(userPointGraphic);
      routeParams.stops.features.push(destinationGraphic);
      console.log("routeParams:", routeParams);

      // solve the route
      route
        .solve(this.routeUrl, routeParams)
        .then((data) => {
          this.view.graphics.removeAll();
          console.log("route results:", data.routeResults);
          // add the symbol to the route results
          data.routeResults.forEach((result) => {
            result.route.symbol = routeSymbol;
            this.view.graphics.add(result.route);
          });
        })
        .catch((error) => {
          console.log("error solving:", error);
        });
    },
    addRoutePopupAction() {
      console.log("adding popup action");
      let getRouteAction = {
        title: "Get Directions",
        id: "get-route",
        className: "esri-icon-right-arrow-circled",
      };
      this.view.popup.actions.push(getRouteAction);
      this.view.popup.on("trigger-action", (event) => {
        if (event.action.id === "get-route") {
          console.log("getting route...");
          console.log("event: ", event);
          let destinationGeometry = this.view.popup.selectedFeature.geometry;
          console.log("dest geom: ", destinationGeometry);
          this.getRoute(destinationGeometry);
        }
      });
    },
  }, // end methods
  mounted() {
    config.apiKey = this.apiKey;

    this.map = new Map({
      basemap: "arcgis-topographic", // Basemap layer service
    });

    this.view = new MapView({
      map: this.map,
      center: [this.user.location_x, this.user.location_y], // Longitude, latitude
      zoom: 16, // Zoom level
      container: "viewDiv", // Div element
    }); // end view

    // SEARCH
    const search = new Search({
      view: this.view,
    }); // end search
    this.view.ui.add(search, "top-right");
    search.on("search-complete", (event) => {
      console.log("search results:", event);
    });

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
      view: this.view,
      useHeadingEnabled: false,
      goToOverride: function (view, options) {
        options.target.scale = 1500;
        return view.goTo(options.target);
      },
    });
    this.view.ui.add(locate, "top-left");

    // get the shared bins and add them to the feature layer
    this.mapSharedBins();

    this.addRoutePopupAction();

    //this.view.on("click", this.getRoute);
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
  margin: auto;
  height: 85vh;
  width: 85vw;
  align-self: center;
}
.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.share-button {
  position: absolute;
  bottom: 10px;
  background-color: #4caf50; /* Green */
  border-radius: 12px;
  border: thin solid darkslategrey;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
}
.share-button:hover,
.stop-share-button:hover {
  cursor: pointer;
}
.stop-share-button {
  position: absolute;
  bottom: 10px;
  background-color: #f44336; /* Green */
  border-radius: 12px;
  border: thin solid darkslategrey;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  display: inline-block;
}
</style>