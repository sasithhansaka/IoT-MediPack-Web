// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
// } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
// import {
//   getFirestore,
//   doc,
//   setDoc,
// } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyBx5fhNrSL6mHjgak_SpQIKK0DsXXQXUMk",
//   authDomain: "iotproject-1cfa2.firebaseapp.com",
//   projectId: "iotproject-1cfa2",
//   storageBucket: "iotproject-1cfa2.firebasestorage.app",
//   messagingSenderId: "844629933940",
//   appId: "1:844629933940:web:e0ef982b5dc6fab3e1f621",
//   measurementId: "G-QM1KPT6B5T",
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// window.register = function () {
//   const email = document.getElementById("register-email").value;
//   const password = document.getElementById("register-password").value;
//   createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       alert("Registered successfully!");
//       setDoc(doc(db, "users", user.uid), {
//         email: email,
//         createdAt: new Date(),
//       });
//     })
//     .catch((error) => {
//       alert(error.message);
//     });
// };

// window.login = function () {
//   const email = document.getElementById("login-email").value;
//   const password = document.getElementById("login-password").value;
//   signInWithEmailAndPassword(auth, email, password)
//     .then(() => {
//       alert("Logged in successfully!");
//     })
//     .catch((error) => {
//       alert(error.message);
//     });
// };

// window.logout = function () {
//   signOut(auth)
//     .then(() => {
//       alert("Logged out successfully!");
//     })
//     .catch((error) => {
//       alert(error.message);
//     });
// };

// -------------------------------------------

// Firebase Initialization
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
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

// Register Event Listener
registerBtn.addEventListener("click", async () => {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const userType = document.getElementById("userType").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userData = { userType, email };
    if (userType === "doctor") {
      userData.status = "pending"; // Doctor needs approval
    }

    await setDoc(doc(db, "users", user.uid), userData);
    alert(
      "Registration successful!" +
        (userType === "doctor" ? " Awaiting approval." : "")
    );
  } catch (error) {
    alert(error.message);
  }
});

// Login Event Listener
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      alert("User data not found.");
      return;
    }

    const userData = userDoc.data();
    if (userData.userType === "doctor" && userData.status !== "approved") {
      alert("Doctor approval pending.");
      return;
    }

    redirectToDashboard(userData.userType);
  } catch (error) {
    alert(error.message);
  }
});

// Redirect User After Login
function redirectToDashboard(userType) {
  switch (userType) {
    case "reception":
      window.location.href = "reception-dashboard.html";
      break;
    case "patient":
      window.location.href = "patient-dashboard.html";
      break;
    case "doctor":
      window.location.href = "doctor-dashboard.html";
      break;
    default:
      alert("Unknown user type");
  }
}
