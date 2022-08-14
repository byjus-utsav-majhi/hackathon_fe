import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDS2tzImqj_TdDngX1Siz-hZPhCRUS1eWk",
  authDomain: "pictogram-hackathon.firebaseapp.com",
  projectId: "pictogram-hackathon",
  storageBucket: "pictogram-hackathon.appspot.com",
  messagingSenderId: "903649091516",
  appId: "1:903649091516:web:ff07a2d1a17a5d221895b9",
  measurementId: "G-EQD2SD5684",
};

const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebase);
const storage = getStorage(firebase);

export { storage, firebase};
