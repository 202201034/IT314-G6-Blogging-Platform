import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCddRimod_MQNv9XBWc_X_-giO7CW-Ax14",
  authDomain: "it314-blogme.firebaseapp.com",
  projectId: "it314-blogme",
  storageBucket: "it314-blogme.appspot.com",
  messagingSenderId: "321257975238",
  appId: "1:321257975238:web:cef191d335b06a4cc6d6c7",
  measurementId: "G-KCBNHRHELC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
