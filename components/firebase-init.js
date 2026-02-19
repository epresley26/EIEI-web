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

// Initialize Firebase - wait for firebase global to be defined
(function initializeFirebase() {
  if (typeof firebase === 'undefined') {
    console.log('Waiting for Firebase SDK to load...');
    setTimeout(initializeFirebase, 100);
    return;
  }
  
  try {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const storage = typeof firebase.storage === 'function' ? firebase.storage() : null;
    
    // Export for use in other scripts
    window.firebaseApp = firebase.app();
    window.firebaseDB = db;
    window.firebaseStorage = storage;
    console.log('Firebase initialized successfully');
  } catch (error) {
    if (error.code !== 'app/duplicate-app') {
      console.error('Firebase initialization error:', error);
    } else {
      // App already initialized, just set the window references
      window.firebaseApp = firebase.app();
      window.firebaseDB = firebase.firestore();
      window.firebaseStorage = firebase.storage();
      console.log('Firebase already initialized, using existing app');
    }
  }
})();
window.firebaseStorage = storage;




