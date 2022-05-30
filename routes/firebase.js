import initializeApp  from 'firebase/app'
import getFirestore  from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBG5ZNJYSUz7ZCzBfXj4dKqgTp5S2DCR0Q",
    authDomain: "bussstops-a7ff9.firebaseapp.com",
    projectId: "bussstops-a7ff9",
    storageBucket: "bussstops-a7ff9.appspot.com",
    messagingSenderId: "208301296264",
    appId: "1:208301296264:web:2eee409616385c2cf3ad3d"
  };

const app = initializeApp(firebaseConfig);
