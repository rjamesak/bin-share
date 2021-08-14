# bin-share
Bin Share is a trash bin sharing app that I developed for one of my CS classes at OSU. 
It's a Vue app that uses the ArcGIS API for Javascript. 
You can try it out <a href="https://trashbin-share.web.app/"> here</a> <br>
<img src="https://github.com/rjamesak/Assets/blob/main/BinShareMapScreen.jpg"/> <br>
I learned some interesting things during this project: <br>
1. ArcGIS API for Javascript - This is the heart of the mapping service. I used 'Suggest' to find addresses, REST APIs to geocode addresses. <br>
  - I used Feature Layers to add, remove, and query bin locations. <br>
2. I used Vuex to manage the user's state.
3. The app is hosted on Firebase and I used Firestore to manage the user's data.

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
