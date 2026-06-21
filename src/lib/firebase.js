import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration keys reading from environment variables
const firebaseConfig = {
            apiKey: "AIzaSyC6HgWx9PwhrVLsWbSDADLWj9L4Y6_mJcE",
            authDomain: "aggrani-portfolio.firebaseapp.com",
            projectId: "aggrani-portfolio",
            storageBucket: "aggrani-portfolio.firebasestorage.app",
            messagingSenderId: "35641147322",
            appId: "1:35641147322:web:4050d3a0b142e910c1e783"
        };
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

// Initialize Firebase (Serverless compatible initialization)

export { db };