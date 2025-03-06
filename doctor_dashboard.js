document.addEventListener('DOMContentLoaded', initializeDashboard);

function initializeDashboard() {
    const doctorInfo = document.getElementById('doctorInfo');
    const currentTime = document.getElementById('currentTime');
    const prescriptionForm = document.getElementById('prescriptionForm');
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');

    // Retrieve the doctor's username from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const doctorUsername = urlParams.get('username');

    // if (doctorUsername) {
    //     doctorInfo.textContent = ` ${doctorUsername}`;
    // } else {
    //     doctorInfo.textContent = 'Error: Username not found.';
    // }

    // Display the current time
    setInterval(() => {
        const now = new Date();
        currentTime.textContent = `Current Time: ${now.toLocaleString()}`;
    }, 1000);

    // Form submission handler
    prescriptionForm.addEventListener('submit', e => addPrescription(e, doctorUsername));
}

function addPrescription(e, doctorUsername) {
    e.preventDefault();
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');
    errorDiv.textContent = '';
    successDiv.textContent = '';

    const patientUsername = document.getElementById('patientUsername').value;
    const medicineCount = parseInt(document.getElementById('medicineCount').value); // Convert to number
    const prescribedDate = new Date().toLocaleString();
    const progress = "Not Dispensed";

    // Validate patient username
    const dbRef = firebase.database().ref('users');
    dbRef.orderByChild('username').equalTo(patientUsername).once('value', snapshot => {
        if (snapshot.exists()) {
            // Add prescription to the database
            const prescriptionId = 73908294; 
            const prescriptionData = {
                patientName: patientUsername,
                medicineCount: medicineCount,
                prescribedDate: prescribedDate,
                progress: progress,
                doctorName: doctorUsername // Save the doctor's name
            };

            firebase.database().ref('prescriptions/' + prescriptionId).set(prescriptionData)
                .then(() => {
                    successDiv.textContent = 'Prescription added successfully!';
                    prescriptionForm.reset();
                })
                .catch(error => {
                    console.error('Error adding prescription:', error);
                    errorDiv.textContent = 'Error adding prescription. Please try again.';
                });
        } else {
            errorDiv.textContent = 'Invalid patient username.';
        }
    }).catch(error => {
        console.error('Error validating patient username:', error);
        errorDiv.textContent = 'Error validating patient username. Please try again.';
    });
}