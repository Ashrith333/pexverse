// Import Firebase auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDx5ViCf5WVIzMq0MQRFT5UeR8Xnztzvks",
  authDomain: "pexverse-42c0f.firebaseapp.com",
  databaseURL: "https://pexverse-42c0f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pexverse-42c0f",
  storageBucket: "pexverse-42c0f.firebasestorage.app",
  messagingSenderId: "48846009059",
  appId: "1:48846009059:web:c473791994e8e22bc90bd6",
  measurementId: "G-LM3LJEYR30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign up function with additional user data
export const signUp = async (email, password, userData) => {
  console.log('Starting sign up process');
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created in Auth');
    
    const user = userCredential.user;
    console.log('Storing user data in Firestore');
    
    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      createdAt: new Date().toISOString()
    });
    
    console.log('User data stored in Firestore');
    return userCredential;
  } catch (error) {
    console.error('Error in signUp:', error);
    throw error;
  }
};

// Sign in function
export const signIn = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error in signIn:', error);
    throw error;
  }
};

// Sign out function
export const logOut = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error('Error in logOut:', error);
    throw error;
  }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Export db for use in other files
export { db }; 