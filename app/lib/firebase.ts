// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIG3JecPWhjO_45xrUTDPSOpjW6t1sJAE",
  authDomain: "appchat-flutter-be8af.firebaseapp.com",
  databaseURL: "https://appchat-flutter-be8af-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "appchat-flutter-be8af",
  storageBucket: "appchat-flutter-be8af.firebasestorage.app",
  messagingSenderId: "59598183574",
  appId: "1:59598183574:web:7daf999c882e04981036b7",
  measurementId: "G-GMMM1HQF5K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side
let analytics: any = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
