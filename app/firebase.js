
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBxT7z1i8jh4NqiLXJpD7iie9wRkflLyqY",
    authDomain: "nebulanest-63879.firebaseapp.com",
    projectId: "nebulanest-63879",
    storageBucket: "nebulanest-63879.appspot.com",
    messagingSenderId: "484424625990",
    appId: "1:484424625990:web:fd62b29ad56d9109fdff47"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const storage = getStorage(app)
