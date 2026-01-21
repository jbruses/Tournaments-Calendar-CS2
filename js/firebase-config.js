import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC8txrEo9wqtBvyD9d85-JWvwckyeCOaII",
  authDomain: "esports-calendar-cs2.firebaseapp.com",
  projectId: "esports-calendar-cs2",
  storageBucket: "esports-calendar-cs2.firebasestorage.app",
  messagingSenderId: "335852912699",
  appId: "1:335852912699:web:9d88e899f5ba28aade1c1e",
  measurementId: "G-V62JFKH158",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
