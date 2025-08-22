// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getRemoteConfig, fetchAndActivate, getNumber } from "firebase/remote-config";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtlFLTc0MAQa4WXzbbPEKBJoMHmjWi0VA",
  authDomain: "teto-egen-test-35da4.firebaseapp.com",
  projectId: "teto-egen-test-35da4",
  storageBucket: "teto-egen-test-35da4.firebasestorage.app",
  messagingSenderId: "57581304677",
  appId: "1:57581304677:web:2cb5b26f06112efefcbf8c",
  measurementId: "G-5Q76NCDMQ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const remoteConfig = getRemoteConfig(app);
const db = getFirestore(app);
const auth = getAuth(app);

remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
remoteConfig.defaultConfig = {
  "quiz_question_count": 12, // Default number of questions
};

fetchAndActivate(remoteConfig)
  .then(() => {
    console.log("Remote config fetched and activated");
  })
  .catch((err) => {
    console.error("Remote config fetch failed", err);
  });


export { app, analytics, remoteConfig, getNumber, db, auth };
