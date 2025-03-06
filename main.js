document.getElementById('registrationForm').addEventListener('submit', registerUser);

function registerUser(e) {
    e.preventDefault();

    const userType = document.getElementById('userType').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Reference to the Firebase Realtime Database
    const dbRef = firebase.database().ref('users');

    // Check if the username already exists
    dbRef.orderByChild('username').equalTo(username).once('value', snapshot => {
        if (snapshot.exists()) {
            alert('Username already exists. Please choose a different username.');
        } else {
            // Create a new user object
            const newUser = {
                userType: userType,
                username: username,
                password: password, // Note: In a real application, you should hash the password before saving
                approved: userType === 'doctor' ? false : true // Doctors need approval
            };

            // Save the user to the database
            dbRef.push(newUser)
                .then(() => {
                    alert('User registered successfully!');
                    document.getElementById('registrationForm').reset();
                })
                .catch((error) => {
                    console.error('Error registering user:', error);
                    alert('Error registering user. Please try again.');
                });
        }
    }).catch(error => {
        console.error('Error checking username:', error);
        alert('Error checking username. Please try again.');
    });
}