import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBx5fhNrSL6mHjgak_SpQIKK0DsXXQXUMk",
  authDomain: "iotproject-1cfa2.firebaseapp.com",
  projectId: "iotproject-1cfa2",
  storageBucket: "iotproject-1cfa2.firebasestorage.app",
  messagingSenderId: "844629933940",
  appId: "1:844629933940:web:e0ef982b5dc6fab3e1f621",
  measurementId: "G-QM1KPT6B5T",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.register = function () {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Registered successfully!");
      setDoc(doc(db, "users", user.uid), {
        email: email,
        createdAt: new Date(),
      });
    })
    .catch((error) => {
      alert(error.message);
    });
};

window.login = function () {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Logged in successfully!");
    })
    .catch((error) => {
      alert(error.message);
    });
};

window.logout = function () {
  signOut(auth)
    .then(() => {
      alert("Logged out successfully!");
    })
    .catch((error) => {
      alert(error.message);
    });
};
