import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0I33YiykW-V-wCHTsg-WegaMvXD_pJKc",
  authDomain: "curiokids-f13b7.firebaseapp.com",
  projectId: "curiokids-f13b7",
  storageBucket: "curiokids-f13b7.firebasestorage.app",
  messagingSenderId: "224446638746",
  appId: "1:224446638746:web:91c1e3f0dbadb098b38d23",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);