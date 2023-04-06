// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, deleteDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "gboard-gfc.firebaseapp.com",
    projectId: "gboard-gfc",
    storageBucket: "gboard-gfc.appspot.com",
    messagingSenderId: "833039003306",
    appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

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

