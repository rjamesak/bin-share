import Vue from "vue";
import Vuex from "vuex";
import { fb_auth, fb_users } from "../firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userProfile: {},
  },
  // MUTATIONS
  mutations: {
    setUserProfile(state, userData) {
      state.userProfile = userData;
    },
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
      // const response = await fb_users.doc(userCredential.user.uid).set({
      //   email: userCredential.user.email,
      // });
      // console.log("add to collection response:", response);

      // get profile info from collection and commit user to state
      dispatch("getUserProfile", user);
    },

    // LOGIN
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

    // ADD USER TO COLLECTION
    async addUserToCollection({ dispatch }, user) {
      console.log("in addUserToCollection, user:", user);
      console.log("in addUserToCollection, user.uid:", user.uid);
      const response = await fb_users.doc(user.uid).set({
        email: user.email,
      });
      console.log("add to collection response:", response);
    },

    // GET USER FROM COLLECTION, call commit
    // gets user info from collection and commits to state
    getUserProfile({ commit }, user) {
      console.log("in getUserProfile, user", user);
      // get user profile from firebase (send the uid)
      fb_users
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("doc data:", doc.data());
            commit("setUserProfile", doc.data());
          } else {
            console.log("No document exists");
          }
        })
        .catch((error) => {
          console.log("Error getting doc:", error);
        });
      // set profile in state
      // console.log("getUserProfile data:", userProfile);
      // console.log("getUserProfile userProfile.data:", userProfile.data);
      // commit("setUserProfile", userProfile.data);
    },
  },
  modules: {},
});
