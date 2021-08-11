import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// import firebaseui from "firebaseui";

// firebase init
const firebaseConfig = {
    // apiKey: process.env.VUE_APP_APIKEY,
    // authDomain: process.env.VUE_APP_AUTHDOMAIN,
    // projectId: process.env.VUE_APP_PROJECTID,
    // storageBucket: process.env.VUE_APP_STORAGEBUCKET,
    // messagingSenderId: process.env.VUE_APP_MESSAGESENDERID,
    // appId: process.env.VUE_APP_APPID,
    // measurementId: process.env.VUE_APP_MEASUREMENTID,
    apiKey: "AIzaSyCp-gQPojN57ZRH1uwnVEzCsV4Ufbe6oA0",
    authDomain: "trashbin-share.firebaseapp.com",
    projectId: "trashbin-share",
    storageBucket: "trashbin-share.appspot.com",
    messagingSenderId: "890236558445",
    appId: "1:890236558445:web:1d9e5e989ee26cbdeab364",
    measurementId: "G-BZ5LECZ5W7",
};
firebase.initializeApp(firebaseConfig);

// utils
const fb_db = firebase.firestore();
const fb_auth = firebase.auth();
// collection references
const fb_users = fb_db.collection("users");

// GET CURRENT USER // to do
const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        fb_auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                console.log("user in firebase.js:", user);
                resolve(user);
                // ...
            } else {
                // User is signed out
                // ...
                console.log("no signed-in user");
                reject('no signed in user')
            }
        });
    });
};

const getSharedBins = async () => {
    return await
        fb_db
            .collection("users")
            .where("sharing", "==", true)
            .get()
}

export { fb_db, fb_auth, fb_users, getCurrentUser, getSharedBins };
