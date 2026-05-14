// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZNErpIXNGplWVDozEM99eYHjX_gr57vE",
  authDomain: "eiei-e1a76.firebaseapp.com",
  projectId: "eiei-e1a76",
  storageBucket: "eiei-e1a76.appspot.com",
  messagingSenderId: "381572080594",
  appId: "1:381572080594:web:1a98854dc676648d5e5e0b",
  measurementId: "G-28SHEQRWLY"
};

// Initialize Firebase (handles both Compat and Modular SDKs)
function initializeFirebase() {
  // Modular path
  if (typeof window.initializeApp !== 'undefined' &&
      typeof window.getFirestore !== 'undefined') {
    try {
      const app = window.initializeApp(firebaseConfig);
      const dbModular = window.getFirestore(app);
      const storage = window.getStorage(app);

      window.firebaseApp = app;
      window.firebaseDB = {
        collection: (collectionName) => ({
          get: async () => {
            const docs = [];
            const querySnapshot = await window.getDocs(
              window.collection(dbModular, collectionName)
            );
            querySnapshot.forEach(doc => {
              docs.push({
                id: doc.id,
                data: () => doc.data(),
                exists: () => true
              });
            });
            return {
              docs,
              size: docs.length,
              empty: docs.length === 0
            };
          },
          doc: (docId) => ({
            get: async () => {
              const docRef = window.doc(dbModular, collectionName, docId);
              const docSnap = await window.getDoc(docRef);
              return {
                id: docSnap.id,
                data: () => docSnap.data(),
                exists: () => docSnap.exists()
              };
            },
            update: async (data) => {
              const docRef = window.doc(dbModular, collectionName, docId);
              return window.updateDoc(docRef, data);
            },
            delete: async () => {
              const docRef = window.doc(dbModular, collectionName, docId);
              return window.deleteDoc(docRef);
            },
            set: async (data, options) => {
              const docRef = window.doc(dbModular, collectionName, docId);
              return window.setDoc(docRef, data, options);
            }
          }),
          add: async (data) => {
            return window.addDoc(window.collection(dbModular, collectionName), data);
          },
          limit: (n) => ({
            get: async () => {
              const q = window.query(
                window.collection(dbModular, collectionName),
                window.limit(n)
              );
              const querySnapshot = await window.getDocs(q);
              const docs = [];
              querySnapshot.forEach(doc => {
                docs.push({
                  id: doc.id,
                  data: () => doc.data()
                });
              });
              return {
                docs,
                size: docs.length
              };
            }
          }),
          orderBy: (field, direction) => ({
            get: async () => {
              const q = window.query(
                window.collection(dbModular, collectionName),
                window.orderBy(field, direction || 'asc')
              );
              const querySnapshot = await window.getDocs(q);
              const docs = [];
              querySnapshot.forEach(doc => {
                docs.push({
                  id: doc.id,
                  data: () => doc.data()
                });
              });
              return {
                docs,
                size: docs.length
              };
            }
          })
        })
      };

      window.firebaseStorage = storage;
      console.log('Firebase (Modular) initialized successfully with Compat wrapper');
      return;
    } catch (error) {
      console.error('Firebase initialization error (modular):', error);
      return;
    }
  }

  // Compat path
  if (typeof firebase === 'undefined') {
    // Try again after a bit
    setTimeout(initializeFirebase, 100);
    return;
  }

  try {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const storage = (typeof firebase.storage === 'function') ? firebase.storage() : null;

    window.firebaseApp = firebase.app();
    window.firebaseDB = db;
    window.firebaseStorage = storage;
    console.log('Firebase (Compat) initialized successfully');
  } catch (error) {
    if (error.code !== 'app/duplicate-app') {
      console.error('Firebase initialization error (compat):', error);
    } else {
      window.firebaseApp = firebase.app();
      window.firebaseDB = firebase.firestore();
      window.firebaseStorage = (typeof firebase.storage === 'function') ? firebase.storage() : null;
      console.log('Firebase already initialized, using existing app');
    }
  }
}

// Run immediately on load
initializeFirebase();
