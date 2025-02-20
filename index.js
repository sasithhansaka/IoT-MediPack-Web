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

    const userData = { userType,email };
    if (userType === "doctor") {
      userData.status = "pending"; 
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

document.addEventListener("DOMContentLoaded", function () {
  const loginContainer = document.getElementById("login");
  const registerContainer = document.getElementById("register");

  const showRegisterBtn = document.querySelector("#login p b");
  const showLoginBtn = document.querySelector("#register p b");

  // Initially, show login and hide register
  registerContainer.style.display = "none";

  // Show register form when clicking "Don't have an account? Register"
  showRegisterBtn.addEventListener("click", function () {
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
  });

  // Show login form when clicking "Have an account? Login"
  showLoginBtn.addEventListener("click", function () {
    registerContainer.style.display = "none";
    loginContainer.style.display = "block";
  });
});
