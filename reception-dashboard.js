import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load Pending Doctors
async function loadPendingDoctors() {
  const doctorsList = document.getElementById("pendingDoctorsList");
  doctorsList.innerHTML = "";

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

  document.querySelectorAll(".accept-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const doctorId = event.target.getAttribute("data-id");
      await approveDoctor(doctorId);
    });
  });
}

// Approve Doctor
async function approveDoctor(doctorId) {
  const doctorRef = doc(db, "users", doctorId);
  await updateDoc(doctorRef, { status: "approved" });
  alert("Doctor approved!");
  loadPendingDoctors();
}

// Add Medicine
document
  .getElementById("medicineForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const medicineName = document.getElementById("medicineName").value.trim();
    const medicineQuantity = document
      .getElementById("medicineQuantity")
      .value.trim();

    if (medicineName === "" || medicineQuantity === "") {
      alert("Please fill in all fields");
      return;
    }

    try {
      await addDoc(collection(db, "medicines"), {
        name: medicineName,
        quantity: parseInt(medicineQuantity, 10),
      });

      document.getElementById("medicineForm").reset();
      alert("Medicine added successfully!");
    } catch (error) {
      console.error("Error adding medicine:", error);
      alert("Failed to add medicine.");
    }
  });

// Load Medicines in Real-time
function loadMedicines() {
  const medicineList = document.getElementById("medicineList");

  onSnapshot(collection(db, "medicines"), (snapshot) => {
    medicineList.innerHTML = "";
    snapshot.forEach((docSnapshot) => {
      const medicine = docSnapshot.data();
      const listItem = document.createElement("li");
      listItem.textContent = `${medicine.name} - ${medicine.quantity}`;
      medicineList.appendChild(listItem);
    });
  });
}

// Initialize Data
loadPendingDoctors();
loadMedicines();
