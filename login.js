document.getElementById('loginForm').addEventListener('submit', loginUser);

function loginUser(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');

    // Reference to the Firebase Realtime Database
    const dbRef = firebase.database().ref('users');

    dbRef.orderByChild('username').equalTo(username).once('value', snapshot => {
        if (snapshot.exists()) {
            const userData = Object.values(snapshot.val())[0];

            if (userData.password === password) {
                if (userData.userType === 'doctor' && !userData.approved) {
                    errorDiv.textContent = 'Your account is not yet approved by the admin.';
                } else {
                    errorDiv.textContent = '';
                    let redirectUrl = '';

                    if (userData.userType === 'doctor') {
                        redirectUrl = `doctor_dashboard.html?username=${encodeURIComponent(username)}`;
                    } else if (userData.userType === 'patient') {
                        redirectUrl = `patient_dashboard.html?username=${encodeURIComponent(username)}`;
                    } else if (userData.userType === 'receptionist') {
                        redirectUrl = `receptionist_dashboard.html?username=${encodeURIComponent(username)}`;
                    }

                    window.location.href = redirectUrl;
                }
            } else {
                errorDiv.textContent = 'Invalid password.';
            }
        } else {
            errorDiv.textContent = 'User not found.';
        }
    }).catch(error => {
        console.error('Error logging in:', error);
        errorDiv.textContent = 'Error logging in. Please try again.';
    });
}