import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOI33YiyKW-V-wCHTsg-WegaMvxD_pJKc",
  authDomain: "curiokids-f13b7.firebaseapp.com",
  projectId: "curiokids-f13b7",
  storageBucket: "curiokids-f13b7.firebasestorage.app",
  messagingSenderId: "224446638746",
  appId: "1:224446638746:web:91c1e3f0dbadb098b38d23",
  measurementId: "G-73MVQHMXSY"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);