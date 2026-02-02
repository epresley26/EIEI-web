// Replace the below config with your own Firebase project config from the Firebase Console
const firebaseConfig = {
  apiKey: "YAIzaSyCZNErpIXNGplWVDozEM99eYHjX_gr57vE",
  authDomain: "eiei-e1a76.firebaseapp.com",
  projectId: "eiei-e1a76",
  storageBucket: "eiei-e1a76.firebasestorage.app",
  messagingSenderId: "381572080594",
  appId: "1:381572080594:web:1a98854dc676648d5e5e0b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Export for use in other scripts
window.firebaseApp = firebase;
window.firebaseDB = db;
window.firebaseStorage = storage;




