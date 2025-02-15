import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDx5ViCf5WVIzMq0MQRFT5UeR8Xnztzvks",
    authDomain: window.location.hostname === 'localhost' 
        ? 'localhost' 
        : "pexverse-42c0f.firebaseapp.com",
    databaseURL: "https://pexverse-42c0f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pexverse-42c0f",
    storageBucket: "pexverse-42c0f.firebasestorage.app",
    messagingSenderId: "48846009059",
    appId: "1:48846009059:web:c473791994e8e22bc90bd6",
    measurementId: "G-LM3LJEYR30"
};

// Initialize Firebase with custom auth domain
const app = initializeApp({
    ...firebaseConfig,
    authDomain: window.location.hostname === 'localhost' 
        ? window.location.hostname 
        : firebaseConfig.authDomain
});
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db }; 