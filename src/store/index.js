import Vue from "vue";
import Vuex from "vuex";
import { fb_auth, fb_users } from "../firebase";
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    userProfile: {},
    loadingStatus: false
  },
  // MUTATIONS
  mutations: {
    setUserProfile(state, userData) {
      state.userProfile = userData;
      state.loadingStatus = false;
    },
    clearUserProfile(state) {
      state.userProfile = {}
    },
    loadingStatus(state, newLoadingStatus) {
      state.loadingStatus = newLoadingStatus
    }
  },
  // ACTIONS
  actions: {
    // CREATE NEW USER
    async createNewUser({ dispatch }, form) {
      console.log("in createnewuser:", form.email, form.password);
      const { user } = await fb_auth.createUserWithEmailAndPassword(
        form.email,
        form.password
      );
      console.log("user after user creation", user);
      // add to users collection
      dispatch("addUserToCollection", user);

      // get profile info from collection and commit user to state
      dispatch("getUserProfile", user);
    },

    // LOGIN ACTION
    async login({ dispatch }, form) {
      console.log("from store, login:", form.email, form.password);
      // destructuring, gets the .user from the returned user credential
      // destructuring: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
      // firebase user credential: https://firebase.google.com/docs/reference/js/firebase.auth#usercredential
      const userCredential = await fb_auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );
      console.log("returned user info:", userCredential);
      dispatch("getUserProfile", userCredential.user);
    },

    // LOGOUT ACTION
    async logout({ commit }) {
      console.log('logging out in store...')
      // firebase logout
      fb_auth.signOut()
        .then(() => {
          console.log('Signout successful!')
        })
        .catch((error) => {
          console.log('Signout error:', error)
        })
      // clear user
      commit("clearUserProfile")
    },

    // ADD TO USER COLLECTION
    async addUserToCollection({ dispatch }, user) {
      console.log("in addUserToCollection, user:", user);
      console.log("in addUserToCollection, user.uid:", user.uid);
      const response = await fb_users.doc(user.uid).set({
        email: user.email,
      }, { merge: true });
      console.log("add to collection response:", response);
    },

    // UPDATE USER PROFILE
    async updateUserProfile({ dispatch }, user) {
      console.log("update user in store:", user)
      // update the collection
      const response = await fb_users.doc(user.uid).set({
        email: user.email,
        fullName: user.fullName,
        address: user.address,
        city: user.city,
        location_x: user.location_x,
        location_y: user.location_y
      })
      console.log('update user response:', response)
      dispatch("getUserProfile", user)
    },

    // GET USER FROM COLLECTION, call commit
    // gets user info from collection and commits to state
    getUserProfile({ commit }, user) {
      this.state.loadingStatus = true
      console.log("in getUserProfile, user", user);
      // get user profile from firebase (send the uid)
      fb_users
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("doc data:", doc.data());
            let userProfileData = doc.data()
            userProfileData.uid = user.uid
            commit("setUserProfile", userProfileData);
          } else {
            console.log("No document exists");
            this.state.loadingStatus = false;
          }
        })
        .catch((error) => {
          console.log("Error getting doc:", error);
          this.state.loadingStatus = false
        });
    },
  },
  getters: {
    // loading status info https://jack72828383883.medium.com/how-to-set-up-a-simple-loading-spinner-in-vue-with-vuex-8afc0ef50363
    loadingStatus(state) {
      return state.loadingStatus
    },
  },
  modules: {},
});
