import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwdCikS1xx2Z0cJC4Dg_2M0ysqn2tw_zc",
  authDomain: "speak-743a8.firebaseapp.com",
  projectId: "speak-743a8",
  storageBucket: "speak-743a8.firebasestorage.app",
  messagingSenderId: "971851251471",
  appId: "1:971851251471:web:02349625da1be2ce93c87a",
  measurementId: "G-T6H7DD7LHB"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// Set persistence to local (survives browser restart)
setPersistence(auth, browserLocalPersistence);

export { app, auth, db };
