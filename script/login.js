        /*
            Name        : login.js
            Author      : Abdurrahman Nurhakim
            Version     : 1.0
            Copyright   : Your copyright notice
            Description : Login page, with token (for cookies and database checking process) for scurity system. This web was intergrated with firebase realtime database.
        */


        // Import Firebase libraries
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

       document.getElementById('login-btn').addEventListener('click', async () => {
           const username = document.getElementById('username').value;
           const password = document.getElementById('password').value;

           console.log('Login button clicked');
           console.log('Username:', username);
           console.log('Password:', password);

           if (username && password) {
               const userRef = ref(database, 'login');
               try {
                   const snapshot = await get(userRef);
                   console.log('Snapshot:', snapshot.val());

                   const userData = snapshot.val();
                   if (userData.username === username && userData.password === password) {
                       console.log('Username and password match');
                       const token = btoa(username + ':' + password);
                       const expires = new Date();
                       expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 1 day
                       document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/`;
                       console.log('Token set in cookies:', document.cookie);
                       await update(userRef, { token: token });
                       console.log('Token updated in database');
                       document.getElementById('notification').textContent = "Login successful!";
                       document.getElementById('notification').style.color = "green";
                       
                       // Redirect to login page if token is not found
                       setTimeout(() => {
                           window.location.href = '/html/dashboard.html';
                       }, 2000); // 2 seconds delay
                   } else {
                       console.log('Username or password does not match');
                       document.getElementById('notification').textContent = "Login failed! Invalid username or password.";
                       document.getElementById('notification').style.color = "red";
                   }
               } catch (error) {
                   console.error('Error:', error);
                   document.getElementById('notification').textContent = "An error occurred. Please try again.";
               }
           } else {
               console.log('Username or password missing');
               document.getElementById('notification').textContent = "Please enter both username and password.";
           }
       });
