/*
    Name        : change_account.js
    Author      : Abdurrahman Nurhakim
    Version     : 1.0
    Copyright   : Your copyright notice
    Description : Change password, with database password checking process for scurity system. This web was intergrated with firebase realtime database.
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.getElementById('change-user-btn').addEventListener('click', async () => {
    const lastUsername = document.getElementById('last-username').value;
    const lastPassword = document.getElementById('last-password').value;
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;

    console.log('Change User button clicked');
    console.log('Last Username:', lastUsername);
    console.log('Last Password:', lastPassword);
    console.log('New Username:', newUsername);
    console.log('New Password:', newPassword);

    if (lastUsername && lastPassword && newUsername && newPassword) {
        const userRef = ref(database, 'login');
        try {
            const snapshot = await get(userRef);
            console.log('Snapshot:', snapshot.val());

            const userData = snapshot.val();
            if (userData.username === lastUsername && userData.password === lastPassword) {
                console.log('Last username and password match');
                await update(userRef, { username: newUsername, password: newPassword });
                console.log('Username and password updated in database');
                document.getElementById('notification').textContent = "Update success!";
                document.getElementById('notification').style.color = "green";

                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 2000);
            } else {
                console.log('Last username or password does not match');
                document.getElementById('notification').textContent = "Update failed! Invalid last username or password.";
                document.getElementById('notification').style.color = "red";
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('notification').textContent = "An error occurred. Please try again.";
        }
    } else {
        console.log('Some fields are missing');
        document.getElementById('notification').textContent = "Please fill in all fields.";
    }
});
