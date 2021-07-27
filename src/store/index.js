import Vue from "vue";
import Vuex from "vuex";
import { fb_auth, fb_users } from "../firebase";
// import { fb_auth } from "../firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userProfile: {},
  },
  mutations: {
    setUserProfile(state, userData) {
      state.userProfile = userData;
    },
  },
  actions: {
    async login({ dispatch }, form) {
      const { user } = await fb_auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );
      dispatch("getUserProfile", user);
    },
    async getUserProfile({ commit }, user) {
      // get user profile from firebase (send the uid)
      const userProfile = await fb_users.get(user.uid);
      // set profile in state
      commit("setUserProfile", userProfile.data());
    },
  },
  modules: {},
});
