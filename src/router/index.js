import Vue from "vue";
import VueRouter from "vue-router";
import LoginPage from "../views/LoginPage.vue";
import { fb_auth, getCurrentUser, currentUser } from "../firebase";

Vue.use(VueRouter);

const routes = [
  // Public routes
  {
    path: "/",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutPage.vue"),
  },
  {
    path: "/signup",
    name: "Signup",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SignUp.vue"),
  },
  {
    path: "/forgot-password",
    name: "Forgot-Password",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ForgotPassword.vue"),
  },
  // Private routes
  {
    path: "/profile",
    name: "Profile",
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ProfilePage.vue"),
    meta: {
      authReq: true, // change to true
    },
  },
  {
    path: "/delete-account",
    name: "Delete-Account",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/DeleteAccount.vue"),
    meta: {
      authReq: true, // change to true
    },
  },
  {
    path: "/map",
    name: "Map",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/MapView.vue"),
    meta: {
      authReq: true, // change to true
    },
  },
  {
    path: "/list",
    name: "List",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ListPage.vue"),
    meta: {
      authReq: true, // change to true
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// Nav guard: check for logged in users
router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta.authReq)) {
    // add conditional to check if logged in
    getCurrentUser()
      // user is returned from the promise
      .then((user) => {
        console.log("user in nav guard promise:", user)
        next()
      })
      .catch((err) => {
        // no signed in user
        console.log("no user:", err)
        next({ name: "Login" })
      })
  } else {
    next();
  }
});

export default router;
