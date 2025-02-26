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

<<<<<<< HEAD
// const modal = document.getElementById("medicineModal");
// const openFormBtn = document.getElementById("openMedicineForm");
// const closeBtn = document.querySelector(".close-btn");
// const medicineForm = document.getElementById("medicineForm");

// async function loadPendingDoctors() {
//   const doctorsList = document.getElementById("pendingDoctorsList");
//   doctorsList.innerHTML = ""; // Clear previous data

//   const q = query(
//     collection(db, "users"),
//     where("userType", "==", "doctor"),
//     where("status", "==", "pending")
//   );
//   const querySnapshot = await getDocs(q);

//   querySnapshot.forEach((docSnapshot) => {
//     const doctor = docSnapshot.data();
//     const doctorItem = document.createElement("li");
//     doctorItem.innerHTML = `
//             ${doctor.email}
//             <button class="accept-btn" data-id="${docSnapshot.id}">Accept</button>
//         `;
//     doctorsList.appendChild(doctorItem);
//   });

//   // Add event listeners for all accept buttons
//   document.querySelectorAll(".accept-btn").forEach((button) => {
//     button.addEventListener("click", async (event) => {
//       const doctorId = event.target.getAttribute("data-id");
//       await approveDoctor(doctorId);
//     });
//   });
// }

=======
// Load Pending Doctors
>>>>>>> bfd44405ef7df65febc44de06fdc871b42fce7c7
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
<<<<<<< HEAD
    button.style.backgroundColor = "black";
    button.style.borderRadius = "5px";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "10px 15px";
    button.style.position = "absolute";
    button.style.right = "5px";
    button.style.cursor = "pointer";

=======
>>>>>>> bfd44405ef7df65febc44de06fdc871b42fce7c7
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

<<<<<<< HEAD
// const fetchMedicines = async () => {
//   const querySnapshot = await getDocs(collection(db, "medicines"));
//   medicineList.innerHTML = ""; // Clear previous entries

//   querySnapshot.forEach((doc) => {
//     const data = doc.data();
//     const row = `
//       <tr>
//         <td>${data.medicineName}</td>
//         <td>${data.brandName}</td>
//         <td>${data.stockLevel}</td>
//       </tr>`;
//     medicineList.innerHTML += row;
//   });
// };

// // Live Update: Listen for Real-Time Changes
// onSnapshot(collection(db, "medicines"), (snapshot) => {
//   medicineList.innerHTML = "";
//   snapshot.forEach((doc) => {
//     const data = doc.data();
//     medicineList.innerHTML += `
//       <tr>
//         <td>${data.medicineName}</td>
//         <td>${data.brandName}</td>
//         <td>${data.stockLevel}</td>
//       </tr>`;
//   });
// });

// fetchMedicines();
// // Submit Form & Save to Firestore
// medicineForm.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const medicineName = document.getElementById("medicineName").value;
//   const brandName = document.getElementById("brandName").value;
//   const stockLevel = document.getElementById("stockLevel").value;

//   try {
//     await addDoc(collection(db, "medicines"), {
//       medicineName,
//       brandName,
//       stockLevel,
//     });

//     alert("Medicine added successfully!");
//     modal.style.display = "none"; // Close modal
//     medicineForm.reset(); // Clear form
//   } catch (error) {
//     console.error("Error adding document: ", error);
//   }
// });

// // Close modal if user clicks outside
// window.addEventListener("click", (event) => {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// });
=======
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
>>>>>>> bfd44405ef7df65febc44de06fdc871b42fce7c7
