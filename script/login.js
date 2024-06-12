       // Import Firebase libraries
       import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
       import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

       // Your web app's Firebase configuration
       const firebaseConfig = {
           authDomain: "fish-feeding-c9aeb.firebaseapp.com",
           databaseURL: "https://fish-feeding-c9aeb-default-rtdb.firebaseio.com",
           projectId: "fish-feeding-c9aeb",
           storageBucket: "fish-feeding-c9aeb.appspot.com",
           messagingSenderId: "345413774132",
           appId: "1:345413774132:web:86dd1828a68f1b29ec1361"
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
