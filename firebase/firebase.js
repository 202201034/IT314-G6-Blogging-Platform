// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth" 
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASFC-cFtwumCbqLf3WY9mvFNnE_1C6fbg",
  authDomain: "blogging-platform-26284.firebaseapp.com",
  projectId: "blogging-platform-26284",
  storageBucket: "blogging-platform-26284.appspot.com",
  messagingSenderId: "200196109152",
  appId: "1:200196109152:web:f92b19bafd8b9d1dd66405",
  measurementId: "G-Q7FJV2TBXR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);