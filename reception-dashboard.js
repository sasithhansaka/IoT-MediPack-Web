import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadPendingDoctors() {
  const doctorsList = document.getElementById("pendingDoctorsList");
  doctorsList.innerHTML = ""; // Clear previous data

  const q = query(
    collection(db, "users"),
    where("userType", "==", "doctor"),
    where("status", "==", "pending")
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((docSnapshot) => {
    const doctor = docSnapshot.data();
    const doctorItem = document.createElement("li");
    doctorItem.innerHTML = `
            ${doctor.email} 
            <button class="accept-btn" data-id="${docSnapshot.id}">Accept</button>
        `;
    doctorsList.appendChild(doctorItem);
  });

  // Add event listeners for all accept buttons
  document.querySelectorAll(".accept-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const doctorId = event.target.getAttribute("data-id");
      await approveDoctor(doctorId);
    });
  });
}

// Function to approve a doctor
async function approveDoctor(doctorId) {
  const doctorRef = doc(db, "users", doctorId);
  await updateDoc(doctorRef, { status: "approved" });
  alert("Doctor approved!");
  loadPendingDoctors(); // Reload the list
}

// Load pending doctors on page load
loadPendingDoctors();
