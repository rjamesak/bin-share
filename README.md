# bin-share
Bin Share is a trash bin sharing app that I developed for one of my CS classes at OSU. 
It's a Vue app that uses the ArcGIS API for Javascript. 
You can try it out <a href="https://trashbin-share.web.app/"> here</a> <br>
<img src="https://github.com/rjamesak/Assets/blob/main/BinShareMapScreen.jpg"/> <br>
<img src="https://github.com/rjamesak/Assets/blob/main/BinShareMapDirections.jpg/> <br>
Some of the tech used for this project: <br>
1. ArcGIS API for Javascript - This is the heart of the mapping service. I used 'Suggest' to find addresses, REST APIs to geocode addresses.
2. Feature Layers were used to add, remove, and query bin locations.
3. Vuex is used to manage the user's state. Vue router is used for navigation. 
5. The app is hosted on Firebase with data stored in Firestore.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
