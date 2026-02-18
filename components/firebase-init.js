// Replace the below config with your own Firebase project config from the Firebase Console
const firebaseConfig = {
   apiKey: "AIzaSyCZNErpIXNGplWVDozEM99eYHjX_gr57vE",
  authDomain: "eiei-e1a76.firebaseapp.com",
  projectId: "eiei-e1a76",
  storageBucket: "eiei-e1a76.appspot.com",
  messagingSenderId: "381572080594",
  appId: "1:381572080594:web:1a98854dc676648d5e5e0b",
  measurementId: "G-28SHEQRWLY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// Initialize Storage only if SDK is loaded on the page
const storage = typeof firebase.storage === 'function' ? firebase.storage() : null;

// Export for use in other scripts
window.firebaseApp = firebase;
window.firebaseDB = db;
window.firebaseStorage = storage;




