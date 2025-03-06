import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let patientEmails = []; 

async function fetchPatientEmails() {
  try {
    const querySnapshot = await getDocs(collection(db, "patients"));
    patientEmails = querySnapshot.docs.map((doc) => doc.data().email);
    console.log("Fetched patient emails:", patientEmails); // Debugging
  } catch (error) {
    console.error("Error fetching patient emails:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchPatientEmails(); 

  const userEmail = localStorage.getItem("userEmail");
  if (userEmail) {
    const emailDisplay = document.getElementById("userEmailDisplay");
    if (emailDisplay) {
      emailDisplay.textContent = userEmail;
    } else {
      console.error("Element with id 'userEmailDisplay' not found.");
    }
  } else {
    console.error("Email not found in localStorage.");
  }

  // Email suggestion logic
  const patientEmailInput = document.getElementById("patientEmail");
  const suggestionBox = document.getElementById("suggestions");

  patientEmailInput.addEventListener("input", () => {
    const inputText = patientEmailInput.value.trim().toLowerCase();
    if (inputText.length < 2) {
      suggestionBox.innerHTML = "";
      return;
    }

    // Filter emails based on input
    const filteredEmails = patientEmails.filter((email) =>
      email.toLowerCase().startsWith(inputText)
    );

    // Display suggestions
    suggestionBox.innerHTML = filteredEmails.length
      ? filteredEmails
          .map((email) => `<div class="suggestion-item">${email}</div>`)
          .join("")
      : "<div class='no-match'>No matches found</div>";

    // Add click event to select email
    document.querySelectorAll(".suggestion-item").forEach((item) => {
      item.addEventListener("click", () => {
        patientEmailInput.value = item.textContent;
        suggestionBox.innerHTML = ""; // Clear suggestions
      });
    });
  });

  // Add medicine data to Firestore
  document
    .getElementById("addMedicineForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const medicineCount = document.getElementById("medicineCount").value.trim();
      const patientEmail = document.getElementById("patientEmail").value.trim();
      const progress = document.getElementById("progress").value;

      if (!medicineCount || !patientEmail || !progress) {
        alert("Please fill in all fields.");
        return;
      }

      const timestamp = new Date().toLocaleString();

      try {
        await addDoc(collection(db, "prescriptions"), {
          doctorEmail: userEmail,
          patientEmail,
          medicineCount,
          progress,
          timestamp,
        });

        alert("Medicine added successfully!");
        document.getElementById("addMedicineForm").reset();
      } catch (error) {
        console.error("Error adding medicine:", error);
        alert("Error adding medicine. Try again.");
      }
    });

  // Search for past prescriptions by patient email
  const searchBtn = document.getElementById("searchBtn");
  const searchPatientEmailInput = document.getElementById("searchPatientEmail");
  const prescriptionsList = document.getElementById("prescriptionsList");

  searchBtn.addEventListener("click", async () => {
    const patientEmailToSearch = searchPatientEmailInput.value.trim();

    if (!patientEmailToSearch) {
      alert("Please enter a patient email.");
      return;
    }

    try {
      const q = query(
        collection(db, "prescriptions"),
        where("patientEmail", "==", patientEmailToSearch)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        prescriptionsList.innerHTML = "<p>No prescriptions found for this patient.</p>";
        return;
      }

      let prescriptionsHtml = "";
      querySnapshot.forEach((doc) => {
        const prescription = doc.data();
        prescriptionsHtml += `
          <div class="prescription-item">
            <p><strong>Doctor Email:</strong> ${prescription.doctorEmail}</p>
            <p><strong>Medicine Count:</strong> ${prescription.medicineCount}</p>
            <p><strong>Progress:</strong> ${prescription.progress}</p>
            <p><strong>Timestamp:</strong> ${prescription.timestamp}</p>
          </div>
        `;
      });

      prescriptionsList.innerHTML = prescriptionsHtml;

      // Auto-fill email in the Add Medicine form
      document.getElementById("patientEmail").value = patientEmailToSearch;
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      alert("Error fetching prescriptions. Try again.");
    }
  });
});
