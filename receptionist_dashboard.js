document.addEventListener('DOMContentLoaded', loadDashboard);

function loadDashboard() {
    const dbRef = firebase.database().ref();

    dbRef.child('fullmedicine_container').child('status').once('value', snapshot => {
        const statusElement = document.getElementById('status');
        statusElement.textContent = `THE STOCK PERCENTAGE: ${snapshot.val()}`;
    }).catch(error => {
        console.error('Error fetching status:', error);
    });

    const doctorsTable = document.getElementById('doctorsTable').getElementsByTagName('tbody')[0];
    dbRef.child('users').orderByChild('userType').equalTo('doctor').once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            const userData = childSnapshot.val();
            if (!userData.approved) {
                const row = doctorsTable.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                
// folder stucture updated 

                cell1.textContent = userData.username;
                const approveButton = document.createElement('button');
                approveButton.textContent = 'Approve';
                approveButton.onclick = function() {
                    approveDoctor(childSnapshot.key);
                };
                cell2.appendChild(approveButton);
            }
        });
    }).catch(error => {
        console.error('Error loading doctors:', error);
    });

    const allDoctorsTable = document.getElementById('allDoctorsTable').getElementsByTagName('tbody')[0];
    dbRef.child('users').orderByChild('userType').equalTo('doctor').once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            const userData = childSnapshot.val();
            const row = allDoctorsTable.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);

            cell1.textContent = userData.username;
            cell2.textContent = userData.approved ? 'Yes' : 'No';
        });
    }).catch(error => {
        console.error('Error loading doctors:', error);
    });

    const patientsTable = document.getElementById('patientsTable').getElementsByTagName('tbody')[0];
    dbRef.child('users').orderByChild('userType').equalTo('patient').once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            const userData = childSnapshot.val();
            const row = patientsTable.insertRow();
            const cell1 = row.insertCell(0);

            cell1.textContent = userData.username;
        });
    }).catch(error => {
        console.error('Error loading patients:', error);
    });
}

function approveDoctor(userId) {
    const dbRef = firebase.database().ref('users/' + userId);
    dbRef.update({ approved: true })
        .then(() => {
            alert('Doctor approved successfully!');
            location.reload();
        })
        .catch(error => {
            console.error('Error approving doctor:', error);
            alert('Error approving doctor. Please try again.');
        });
}