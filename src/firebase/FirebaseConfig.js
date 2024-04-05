import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB2qI9XoNZNmKE9qGJAWHt_kThctmRKi0I",
  authDomain: "cake-5279a.firebaseapp.com",
  projectId: "cake-5279a",
  storageBucket: "cake-5279a.appspot.com",
  messagingSenderId: "977883541995",
  appId: "1:977883541995:web:c7f607e64d4e7033fc69ae",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
