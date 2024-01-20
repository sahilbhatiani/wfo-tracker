import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyAi6tm7NG144p4H2g7lJFcgUrojuFmyQ14",
    authDomain: "wfo-tracker-edb55.firebaseapp.com",
    databaseURL: "https://wfo-tracker-edb55-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wfo-tracker-edb55",
    storageBucket: "wfo-tracker-edb55.appspot.com",
    messagingSenderId: "458251975070",
    appId: "1:458251975070:web:eeb4d2023ba379990d7e8f",
    measurementId: "G-S3KRJQN258"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp)
connectAuthEmulator(auth, "http://127.0.0.1:9099")

export default auth;


