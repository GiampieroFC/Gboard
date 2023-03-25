// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, deleteDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "gboard-d8c45.firebaseapp.com",
    projectId: "gboard-d8c45",
    storageBucket: "gboard-d8c45.appspot.com",
    messagingSenderId: "132985416664",
    appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();

export const auth = getAuth(app)
export const db = getFirestore(app)

export async function sendDoc(coll, name, text) {
    await setDoc(doc(db, `${coll}`, name), {
        name,
        text
    });

    console.log("document saved")
}
export async function delDoc(coll, name) {
    await deleteDoc(doc(db, `${coll}`, name));

    console.log("document deleted")
}

