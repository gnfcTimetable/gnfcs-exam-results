
// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxV-OR0CnrrjR4ljVce7aUkDmMTmvxnYs",
  authDomain: "examresult-3a22c.firebaseapp.com",
  projectId: "examresult-3a22c",
  storageBucket: "examresult-3a22c.appspot.com",
  messagingSenderId: "854732632450",
  appId: "1:854732632450:web:e76c462a43efba26d89f9b",
  measurementId: "G-2QCJHG4KD9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

